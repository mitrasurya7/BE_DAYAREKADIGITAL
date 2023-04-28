import mysql from 'mysql2';

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'db_test',
    port: 3306,
    multipleStatements: true,
});

export default connection;