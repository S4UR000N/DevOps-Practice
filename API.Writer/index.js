import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const PORT = process.env.PORT || 3001;
const DB_FILE = process.env.DB_FILE || '/data/db.json';
const MAX_RECORDS = 100;

const adapter = new JSONFile(DB_FILE);
const db = new Low(adapter, {});

await db.read();
db.data = db.data || {};
db.data.records = db.data.records || [];
db.data.insertCount = db.data.insertCount || 0;

const app = express();

app.get('/', async (req, res) => {
  await db.read();

  const next = db.data.insertCount + 1;
  const record = `record ${next}`;
  db.data.records.push(record);

  if (db.data.records.length > MAX_RECORDS) {
    db.data.records = db.data.records.slice(-MAX_RECORDS);
  }

  db.data.insertCount = next;
  await db.write();

  res.json({ message: 'Record added', record, totalRecords: db.data.records.length, insertCount: next });
});

app.listen(PORT, () => console.log(`Writer running on port ${PORT}`));
