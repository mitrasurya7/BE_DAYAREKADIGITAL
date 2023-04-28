import connection from "./library/database.mjs";
import fs from "fs";

let dataCustomer = JSON.parse(fs.readFileSync("./data/customer.json", "utf8"))
  .map((el) => {
    const { name } = el;
    return `('${name}')`;
  })
  .join(",\n");
let dataTransaction = JSON.parse(
  fs.readFileSync("./data/transaction.json", "utf8")
)
  .map((el) => {
    const {
      customer_id,
      menu,
      price,
      qty,
      payment,
      total,
      created_at = new Date().toISOString().slice(0, 19).replace("T", " "),
    } = el;
    return `(${customer_id}, '${menu}', ${price}, ${qty}, '${payment}', ${total}, '${created_at}')`;
  })
  .join(",\n");

connection.query(
  `INSERT INTO Customers (name) VALUES ${dataCustomer}`,
  (err, results, fields) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Customer Insert data successfully");
      connection.query(
        `INSERT INTO Transactions (customer_id, menu, price, qty, payment, total, created_at) VALUES ${dataTransaction}`,
        (err, results, fields) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log("Transaction Insert data successfully");
            connection.end();
          }
        }
      );
    }
  }
);
