const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const PORT = 3000;
const app = express();

const connection = process.env.ELEPHANTSQL_URL || 'postgres://nxtvgtwn:2axOHwC_2dqLEqohrBE0H1gPJWYX2dZD@pellefant.db.elephantsql.com:5432/nxtvgtwn';

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

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }

    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    }

    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }

    req.userId = payload.subject;
    next();
}

app.get('/', (req, res) => {
    client.query('\
    SELECT title, content, username AS author, pub_date FROM posts LEFT OUTER JOIN users ON (posts.author_id = users.id) ORDER BY pub_date DESC;\
    ', (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else {
            let posts = result.rows;
            for (i in posts) {
                posts[i].author = posts[i].author || '[deleted]';
                posts[i].pub_date = moment(posts[i].pub_date, 'MMMM DD YYYY').fromNow();
            }
            return res.status(200).send(posts);
        }
    })
})

app.post('/register/', (req, res) => {
    let user = req.body;
    client.query(`SELECT username FROM users WHERE username = '${user.username}';`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else if (result.rows.length) {
            return res.status(401).json('Username already taken.');
        }
        else {
            client.query(`INSERT INTO users
                (first_name, last_name, email, username, password) VALUES
                ('${user.firstName}', '${user.lastName}', '${user.email}', '${user.username}', '${user.password}')
                RETURNING id, CONCAT(first_name, ' ', last_name) as full_name;`, (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json('Something went wrong.');
                }
                else {
                    let payload = { subject: result.rows[0].id };
                    let token = jwt.sign(payload, 'secretKey');
                    return res.status(200).send({ token: token, fullname: result.rows[0].full_name });
                }
            })
        }
    });
})

app.post('/login', (req, res) => {
    let user = req.body;
    client.query(`SELECT id, CONCAT(first_name, ' ', last_name) as full_name, username, password FROM users
        WHERE username = '${user.username}' AND password = '${user.password}';`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else if (!result.rows.length) {
            return res.status(401).json('Incorrect username and/or password.');
        }
        else {
            let payload = { subject: result.rows[0].id };
            let token = jwt.sign(payload, 'secretKey');
            return res.status(200).send({ token: token, fullname: result.rows[0].full_name });
        }
    })
})

app.get('/subscriptions', (req, res) => {
    client.query(`SELECT name FROM subtidders;`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else {
            subscriptions = result.rows.map(sub => sub.name);
            return res.status(200).send(subscriptions);
        }
    })
})

app.get('/users', verifyToken, (req, res) => {
    client.query(`
    SELECT
        CONCAT(first_name, ' ', last_name) as full_name,
        email, username, join_date FROM users;`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else {
            let users = result.rows;
            for (i in users) {
                users[i].join_date = moment(users[i].join_date, 'MMMM DD YYYY').fromNow();
            }
            return res.status(200).send(users);
        }
    })
})

app.listen(PORT, () => {
    console.log('Server running on localhost:' + PORT);
})