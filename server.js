const express = require("express");
const { pool } = require("./db");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/notes", async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });
    const result = await pool.query(
      "INSERT INTO notes (title, body) VALUES ($1, $2) RETURNING *",
      [title, body ?? ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/notes/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE id = $1",
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const { title, body } = req.body;
    const fields = [];
    const values = [];
    if (title !== undefined) { fields.push(`title = $${fields.length + 1}`); values.push(title); }
    if (body !== undefined) { fields.push(`body = $${fields.length + 1}`); values.push(body); }
    if (!fields.length) return res.status(400).json({ error: "no fields to update" });
    fields.push(`updated_at = NOW()`);
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE notes SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Notes API on http://localhost:${PORT}`));