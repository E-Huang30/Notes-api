const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

async function init() {
  const sql = fs.readFileSync(path.join(__dirname, "../schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Database initialised.");
  await pool.end();
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
