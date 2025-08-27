import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || '/data/db.json';

const adapter = new JSONFile(DB_FILE);
const db = new Low(adapter, {});

// helper to ensure schema always exists
async function ensureData() {
  await db.read();
  if (!db.data) {
    db.data = { records: [] };
  }
  if (!Array.isArray(db.data.records)) {
    db.data.records = [];
  }
}

await ensureData();

const app = express();

app.get('/', async (req, res) => {
  await ensureData();
  const lastRecords = db.data.records.slice(-10);
  res.json({ records: lastRecords });
});

app.listen(PORT, () => console.log(`Reader running on port ${PORT}`));
