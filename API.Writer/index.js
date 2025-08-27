import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const PORT = process.env.PORT || 3001;
const DB_FILE = process.env.DB_FILE || '/data/db.json';
const MAX_RECORDS = 100;

const adapter = new JSONFile(DB_FILE);
const db = new Low(adapter, {});

async function ensureData() {
  await db.read();
  if (!db.data) {
    db.data = { records: [], insertCount: 0 };
  }
  if (!Array.isArray(db.data.records)) {
    db.data.records = [];
  }
  if (typeof db.data.insertCount !== 'number') {
    db.data.insertCount = 0;
  }
}

await ensureData();

const app = express();

app.get('/', async (req, res) => {
  await ensureData();

  if (db.data.records.length >= MAX_RECORDS) {
    return res.status(200).json({
      message: 'Max records reached, nothing added',
      totalRecords: db.data.records.length,
      insertCount: db.data.insertCount
    });
  }

  const next = db.data.insertCount + 1;
  const record = `record ${next}`;
  db.data.records.push(record);
  db.data.insertCount = next;

  await db.write();

  res.json({
    message: 'Record added',
    record,
    totalRecords: db.data.records.length,
    insertCount: next
  });
});

app.listen(PORT, () => console.log(`Writer running on port ${PORT}`));
