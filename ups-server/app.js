const dotenv = require('dotenv')
const express = require('express')
const mysql = require('mysql')

dotenv.config()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

db.connect(error => {
  if (error) {
    console.error('[ERROR] MySQL not connected');
  } else {
    console.log('MySQL connected');
  }
})

const app = express()
const PORT = 3001
const RECORD_ID = 1

app.use(express.json());
app.use(express.urlencoded());

app.get('/language', (req, res) => {
  const sql = `SELECT * FROM language WHERE language.id = ${RECORD_ID}`
  db.query(sql, (error, results) => {
    if (error) {
      res.status(500).send('Unexpected error');
    }
    if (!results || results.length === 0) {
      res.send({
        id: RECORD_ID,
        name: 'Type Script',
        updatedAt: (new Date()).toISOString(),
      });
    }
    res.send(results[0]);
  })
})

app.post('/language', (req, res) => {
  let updatedName = req.body.name || 'Type Script';
  if (!(/^[A-Za-z]+$/.test(updatedName))) {
    updatedName = 'Type Script'
  }

  const updated = {
    id: RECORD_ID,
    name: updatedName,
    updatedAt: (new Date()).toISOString(),
  }
  const sql = `INSERT INTO language SET ? ON DUPLICATE KEY UPDATE name="${updated.name}", updatedAt="${updated.updatedAt}"`
  db.query(sql, updated, error => {
    if (error) {
      res.status(500).send('Unexpected error');
    }
    res.sendStatus(204);
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})