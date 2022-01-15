require('dotenv').config()
const fs = require('fs')

const { Pool, Client } = require('pg')
const config = {
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync(process.env.HOME + '/.postgresql/root.crt').toString()
    }
}

const pool = new Pool(config)

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})

const client = new Client(config)

client.connect()
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})