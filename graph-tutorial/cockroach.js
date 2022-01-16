require('dotenv').config()
const fs = require('fs')
const { Pool } = require('pg')

const config = {
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync(process.env.HOME + '/AppData/Roaming/.postgresql/root.crt').toString()
    }
}

const pool = new Pool(config)

async function createEvent(event) {
    return (await pool.query("INSERT INTO EVENT VALUES(gen_random_uuid(), $1, $2, $3) RETURNING id", [event.name, event.start, event.end])).rows
}

async function addUserToIncrement(event, increment) {
        qString = ` insert into increment values($1, $2, ARRAY[$3]) 
                    ON CONFLICT (event_id, idx) DO UPDATE SET users = array_append(increment.users, $3) 
                    WHERE increment.event_id = $1 AND increment.idx=$2;`

        await pool.query(qString, [event.id, increment.index, increment.user])
}

async function getEvent(id) {
    qString = `SELECT * FROM INCREMENT WHERE event_id = $1`

    return (await pool.query(qString, [id])).rows
}

// getEvent('30ec7002-8ffe-4cf5-ab09-4ffbe806a632').then((result) => console.log(result)).then(()=>{})
// dbEvent = {name: 'new test event', start: '2022-01-25 03:00:00', end: '2022-01-25 05:00:00'}
// createEvent(dbEvent).then((result) => console.log(result)).then(()=>{})
// addUserToIncrement({id: '30ec7002-8ffe-4cf5-ab09-4ffbe806a632'}, {index: 3, user: 'darren'})

module.exports = {
    createEvent,
    addUserToIncrement,
    getEvent
}
