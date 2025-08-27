import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || '/data/db.json';

const adapter = new JSONFile(DB_FILE);
const db = new Low(adapter, {});

await db.read();
db.data = db.data || {};
db.data.records = db.data.records || [];

const app = express();

app.get('/', async (req, res) => {
  await db.read();
  db.data.records = db.data.records || [];
  const lastRecords = db.data.records.slice(-10);
  res.json({ records: lastRecords });
});

app.listen(PORT, () => console.log(`Reader running on port ${PORT}`));
