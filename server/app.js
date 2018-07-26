const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');

const PORT = 3000;
const app = express();

const connection = process.env.DATABASE_URL || 'postgres://localhost:5432/tidder';

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
            return res.status(500).json('Something went wrong.');
        }
        else {
            posts = result.rows;
            for (i in posts) {
                posts[i].username = posts[i].username || '[deleted]';
            }
            return res.status(200).json(posts);
        }
    })
})

app.listen(PORT, () => {
    console.log('Server running on localhost:' + PORT);
})