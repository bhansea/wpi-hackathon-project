require('dotenv').config()

const { Pool, Client } = require('pg')
const connectionString = process.env.CONNECTION_STRING

const pool = new Pool({
  connectionString,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const client = new Client({
  connectionString,
})

client.connect()
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})