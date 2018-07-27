const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');
const moment = require('moment');

const PORT = 3000;
const app = express();

/**
 * Make sure to fill out the data in the config file.
 * Otherwise the server will throw an error.
 */
const config = require('./pg_config');
const connection = process.env.DATABASE_URL || `postgres://${config.username}:${config.password}@${config.hostname}:${config.port}/${config.db}`;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let client = new pg.Client(connection);

let sql = fs.readFileSync('init_db.sql').toString();
client.connect();

client.query(sql, (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Tables created.');
    }
})

app.get('/', (req, res) => {
    res.send('Hello from server!')
})

app.get('/all', (req, res) => {
    client.query('\
    SELECT title, content, username, pub_date FROM posts LEFT OUTER JOIN users ON (posts.author_id = users.id);\
    ', (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Something went wrong.');
        }
        else {
            posts = result.rows;
            for (i in posts) {
                posts[i].username = posts[i].username || '[deleted]';
                posts[i].pub_date = moment(posts[i].pub_date, 'MMMM DD YYYY').fromNow();
            }
            return res.status(200).send(posts);
        }
    })
})

app.post('/register/', (req, res) => {
    let user = req.body;
    client.query(`
    INSERT INTO users (username, password) VALUES ('${user.username}', '${user.password}');
    `, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else {
            return res.status(200).json('OK');
        }
    })
})

app.listen(PORT, () => {
    console.log('Server running on localhost:' + PORT);
})