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
    let offset = Number(req.query.offset);
    offset = (offset) ? offset : 0;

    client.query(`
    SELECT posts.id, title, content, username AS author, author_id, subtidders.name as subtidder, pub_date FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    ORDER BY pub_date DESC
    LIMIT 10
    OFFSET 10*${offset};
    `, (error, result) => {
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

app.get('/countPosts', (req, res) => {
    client.query(`SELECT COUNT(*) FROM posts`, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).send(result.rows[0].count);
        }
    })
})

app.delete('/delete/:id', (req, res) => {
    let postId = req.params.id;
    client.query(`DELETE FROM posts WHERE id = ${postId};`, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).json('Post deleted.');
        }
    })
})

app.post('/edit/:id', (req, res) => {
    let post = req.body;
    let postId = req.params.id;
    client.query(`UPDATE posts SET content = '${post.content}' WHERE id = ${postId};`, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).json('Post edited.');
        }
    })
})

app.post('/register/', (req, res) => {
    let user = req.body;
    user.firstName = user.firstName.replace(/'/g, "''");
    user.lastName = user.lastName.replace(/'/g, "''");
    
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
                    return res.status(200).send({
                        token: token,
                        id: result.rows[0].id,
                        fullname: result.rows[0].full_name
                    });
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
            return res.status(200).send({
                token: token,
                id: result.rows[0].id,
                fullname: result.rows[0].full_name
            });
        }
    })
})

app.get('/subscriptions', (req, res) => {
    client.query(`SELECT subtidders.name FROM users
        INNER JOIN subscriptions ON users.id = subscriptions.user_id
        INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
        WHERE users.id = ${req.query.id}
        ORDER BY subtidders.name;`, (error, result) => {
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

app.get('/allsubtidders', (req, res) => {
    client.query(`SELECT name FROM subtidders ORDER BY name`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else {
            all = result.rows.map(sub => sub.name);
            return res.status(200).send(all);
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

app.post('/t/:subtidder/add', (req, res) => {
    let subtidder = req.params.subtidder;
    let postData = req.body;
    postData.title = postData.title.replace(/'/g, "''");
    postData.content = postData.content.replace(/'/g, "''");

    client.query(`
        INSERT INTO posts (title, content, author_id, subtidder_id)
        SELECT '${postData.title}', '${postData.content}', ${postData.userId}, s.id
        FROM (SELECT id FROM subtidders WHERE name='${subtidder}') s;`, (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json('Something went wrong.');
            }
            else {
                return res.status(200).json('OK');
            }
    })
})

app.get('/search', (req, res) => {
    let s = req.query.s;
    s = s.split(' ').join(' | ').replace(/'/g, "''");

    client.query(`
    SELECT name, description, creation_date FROM subtidders
    WHERE to_tsvector('english', CONCAT(name, ' ', description))
    @@ to_tsquery('english', '${s}');
    `, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json('Something went wrong.');
        }
        else {
            let subtidders = result.rows;
            for (i in subtidders) {
                subtidders[i].creation_date = moment(subtidders[i].creation_date, 'MMMM DD YYYY').fromNow();
            }
            return res.status(200).json(subtidders);
        }
    })
})

app.listen(PORT, () => {
    console.log('Server running on localhost:' + PORT);
})