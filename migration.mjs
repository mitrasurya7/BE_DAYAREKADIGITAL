import connection from "./library/database.mjs";

let Customer = `CREATE TABLE Customers (
  id int NOT NULL AUTO_INCREMENT,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);
`;

let Transaction = `CREATE TABLE IF NOT EXISTS Transactions (
  id INTEGER NOT NULL AUTO_INCREMENT,
  customer_id INTEGER NOT null ,
  menu TEXT NOT NULL,
  price INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  payment TEXT NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (customer_id) REFERENCES Customers(id)
);


`;

connection.query(Customer, (err, results, fields) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Customer table created successfully");
    connection.query(Transaction, (err, results, fields) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Transaction table created successfully");
        connection.end();
      }
    });
  }
});

