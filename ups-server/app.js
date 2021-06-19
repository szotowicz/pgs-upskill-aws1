const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors');
const mysql = require('mysql')

dotenv.config()
const app = express()
app.use(cors());

console.log(`[${(new Date()).toISOString()}] Database: '${process.env.DB_NAME}' | Table: '${process.env.DB_TABLE_NAME}'`);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})
const TABLE_NAME = process.env.DB_TABLE_NAME
const PORT = 3001
const RECORD_ID = 1

db.connect(error => {
  if (error) {
    console.error(`[${(new Date()).toISOString()}][ERROR] MySQL not connected. Details: ${error}`)
  } else {
    console.log(`[${(new Date()).toISOString()}] MySQL connected`)
    const checkTableSql = `SELECT * FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = '${TABLE_NAME}'`
    db.query(checkTableSql, (error, results) => {
      if (error) {
        console.error(`[${(new Date()).toISOString()}][ERROR] Checking if table exists failed. Details: ${error}`)
      } else if (results.length > 0) {
        console.log(`[${(new Date()).toISOString()}] ${TABLE_NAME} table exists`)
      } else {
        const createTableSql = `CREATE TABLE ${process.env.DB_NAME}.${TABLE_NAME} (
          id int(11) NOT NULL,
          name varchar(100) NOT NULL,
          updatedAt varchar(45) NOT NULL,
          PRIMARY KEY (id)
        )`
        db.query(createTableSql, (error) => {
          if (error) {
            console.error(`[${(new Date()).toISOString()}][ERROR] Creating table failed. Details: ${error}`)
          } else {
            console.log(`[${(new Date()).toISOString()}] ${TABLE_NAME} table has been created`)
          }
        })
      }
    })
  }
})

app.use(express.json())
app.use(express.urlencoded())

app.get('/language', (req, res) => {
  const getLanguageSql = `SELECT * FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.id = ${RECORD_ID}`
  db.query(getLanguageSql, (error, results) => {
    if (error) {
      console.error(`[${(new Date()).toISOString()}][ERROR] Featching language failed. Details: ${error}`)
      res.status(500).send('Unexpected internal error')
      return
    }
    if (!results || results.length === 0) {
      res.send({
        id: RECORD_ID,
        name: 'Type Script',
        updatedAt: (new Date()).toISOString(),
      })
    }
    res.send(results[0])
  })
})

app.post('/language', (req, res) => {
  let updatedName = req.body.name || 'Type Script'
  if (!(/^[A-Za-z-_ ]+$/.test(updatedName))) {
    updatedName = 'Type Script'
    console.log(`[${(new Date()).toISOString()}] Invalid updated name. Setup default name: ${updatedName}`)
  }

  const updated = {
    id: RECORD_ID,
    name: updatedName,
    updatedAt: (new Date()).toISOString(),
  }
  const updateLanguageSql = `INSERT INTO ${TABLE_NAME} SET ? ON DUPLICATE KEY UPDATE name="${updated.name}", updatedAt="${updated.updatedAt}"`
  db.query(updateLanguageSql, updated, error => {
    if (error) {
      console.error(`[${(new Date()).toISOString()}][ERROR] Updating language failed. Details: ${error}`)
      res.status(500).send('Unexpected internal error')
      return
    }
    res.sendStatus(204)
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})