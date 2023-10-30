const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "127.0.0.1",
  user: "root",
  password: "ECE4906Alan",
  database: "sys",
});

let DB = {};

DB.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM user", (err, results) => {
      if (err) {
        return reject(err);
      }

      return resolve(results);
    });
  });
};
