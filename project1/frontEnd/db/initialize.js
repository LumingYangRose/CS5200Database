const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/test.db");

const fs = require("fs");

console.log("Reading script file");
const script = fs.readFileSync("./db/MediaDB.db.sql", "utf8");
console.log("Script file ", script.length, " characters read");

console.log("Executing the query");

db.exec(script, function (err) {
  if (err) {
    throw err;
  }
});

console.log("Query executed");

db.close();
