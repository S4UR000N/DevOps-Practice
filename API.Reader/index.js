import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || '/data/db.json';

const adapter = new JSONFile(DB_FILE);
const db = new Low(adapter, {});

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
  res.json({ records: db.data.records });
});

app.listen(PORT, () => console.log(`Reader running on port ${PORT}`));
