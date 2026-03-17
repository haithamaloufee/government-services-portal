const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(express.json());

// Frontend
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

// DB
const dbPath = path.join(__dirname, "gov.db");
const db = new sqlite3.Database(dbPath);

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server running ✅", db: "connected" });
});

// Get citizen by national id
app.get("/api/citizens/:nid", (req, res) => {
  const nid = (req.params.nid || "").trim();

  if (!/^\d{8,12}$/.test(nid)) {
    return res.status(400).json({ ok: false, error: "Invalid national id format" });
  }

  db.get(
    `SELECT national_id, full_name, dob, nationality, address FROM citizens WHERE national_id = ?`,
    [nid],
    (err, row) => {
      if (err) return res.status(500).json({ ok: false, error: "DB error" });
      if (!row) return res.status(404).json({ ok: false, error: "Citizen not found" });
      res.json({ ok: true, citizen: row });
    }
  );
});

// Home route explicitly (لتجنب مشاكل الراوت)
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
