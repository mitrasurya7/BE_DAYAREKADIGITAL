import connection from "../library/database.mjs";
import redis from "../library/redis.mjs";
class Controller {
  // create Customer
  static async createCustomer(req, res) {
    try {
      const { name } = req.body;
      const insertCustomer = `INSERT INTO Customers (name) VALUES ('${name}')`;
      connection.query(insertCustomer, (err, results, fields) => {
        if (err) throw err;
        redis.del("customers");
        res.status(201).send({ message: "Customer created successfully" });
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  // Get Customer by name Sort by name A-Z
  static async getAllCustomer(req, res) {
    try {
      const cacheCustomer = await redis.get("customers");
      if (cacheCustomer) {
        res.status(200).send(JSON.parse(cacheCustomer));
      } else {
        const getAllCustomer = `SELECT * FROM Customers order by name ASC`;
        connection.query(getAllCustomer, (err, results, fields) => {
          if (err) throw err;
          redis.set("customers", JSON.stringify(results), "EX", 60 * 60);
          res.status(200).send(results);
        });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  // Update Customer by id
  static async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updateCustomer = `UPDATE Customers SET name = '${name}' WHERE id = ${id}`;
      connection.query(updateCustomer, (err, results, fields) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
          res.status(404).send({ message: "Customer not found" });
          return;
        }
        redis.del("customers");
        res.status(200).send({ message: "Customer updated successfully" });
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  // Delete Customer by id
  static async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const findCustomer = `SELECT * FROM Customers WHERE id = ${id}`;
      connection.query(findCustomer, (err, results, fields) => {
        if (err) throw err;
        if (results.length === 0) {
          res.status(404).send({ message: "Customer not found" });
          return;
        } else {
          const deleteTransaction = `DELETE FROM Transactions WHERE customer_id = ${id}`;
          connection.query(deleteTransaction, (err, results, fields) => {
            if (err) throw err;
          });
          const deleteCustomer = `DELETE FROM Customers WHERE id = ${id}`;
          connection.query(deleteCustomer, (err, results, fields) => {
            if (err) throw err;
            redis.del("customers");
            res.status(200).send({ message: "Customer deleted successfully" });
          });
        }
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  // create Transaction
  static async createTransaction(req, res) {
    try {
      const {
        customer_id,
        menu,
        price,
        qty,
        payment,
        total = price * qty,
        created_at = new Date().toISOString().slice(0, 19).replace("T", " "),
      } = req.body;
      // check customer_id is exist
      const findUser = `SELECT * FROM Customers WHERE id = ${customer_id}`;
      connection.query(findUser, (err, results, fields) => {
        if (err) throw err;
        if (results.length === 0) {
          res.status(404).send({ message: "Customer not found" });
        }
      });
      const insertTransaction = `INSERT INTO Transactions (customer_id, menu, price, qty, payment, total, created_at) VALUES (${customer_id}, '${menu}', ${price}, ${qty}, '${payment}', ${total}, '${created_at}')`;
      connection.query(insertTransaction, (err, results, fields) => {
        if (err) throw err;
        redis.del("transactions");
        res.status(201).send({ message: "Transaction created successfully" });
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  // Get Transaction sort new date
  static async getAllTransaction(req, res) {
    try {
      const { Query, Customer } = req.query;
      let getAllTransaction;
      if (Query && Customer) {
        getAllTransaction = `SELECT c.name, t.*
        FROM customers c
        JOIN transactions t ON c.id = t.customer_id
        WHERE t.menu LIKE '${Query}%' OR t.price LIKE '${Query}%'
        ORDER BY t.created_at DESC, c.name ASC`;
      } else if (Query) {
        getAllTransaction = `SELECT * FROM Transactions
         WHERE menu LIKE '${Query}%' OR price LIKE '${Query}%' order by created_at DESC`;
      } else if (Customer === "active") {
        getAllTransaction = `select c.name, t.* 
        from customers c 
        join transactions t on c.id =t.customer_id 
        order by c.name asc `;
      } else {
        getAllTransaction = `SELECT * FROM Transactions order by created_at DESC`;
      }
      const cacheTransaction = await redis.get("transactions");
      if (cacheTransaction && !Query && !Customer) {
        res.status(200).send(JSON.parse(cacheTransaction));
      } else {
        connection.query(getAllTransaction, (err, results, fields) => {
          if (err) throw err;
          if (!Query && !Customer) {
            redis.set("transactions", JSON.stringify(results), "EX", 60 * 60);
          }
          res.status(200).send(results);
        });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  }
}

export default Controller;
