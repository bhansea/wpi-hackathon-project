require('dotenv').config()
const fs = require('fs')

const { Pool } = require('pg')
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

function createEvent(event) {
    // callback - checkout a client
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query("INSERT INTO EVENT VALUES(gen_random_uuid(), $1, $2, $3)", [event.name, event.start, event.end], (err, res) => {
            done(res)
            console.log(res)
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])
            }
        })
    })
}

createEvent({name: 'test', start: '2022-01-15 01:00:00', end: '2022-01-1 04:05:06'})