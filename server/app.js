const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    db = require('./db'),
    fs = require('fs'),
    PORT = 3000,
    app = express();

const sql = fs.readFileSync('./db/init_db.sql').toString();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/authenticate', require('./routes/authenticate'));
app.use('/t', require('./routes/subtidders'));
app.use('/users', require('./routes/users'));
app.use('/search', require('./routes/search'));
app.use('/posts', require('./routes/posts'));

db.query(sql, (err, res) => {
    if (err) {
        console.log('The tables already exist.');
    }
    else {
        console.log('Tables created.');
    }
})

app.get('/countPosts', (req, res) => {
    db.query(`SELECT COUNT(*) FROM posts`, (error, result) => {
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
    db.query(`DELETE FROM posts WHERE id = ${postId};`, (error, result) => {
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
    db.query(`UPDATE posts SET content = '${post.content}' WHERE id = ${postId};`, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).json('Post edited.');
        }
    })
})

app.get('/subscriptions', (req, res) => {
    db.query(`SELECT subtidders.name FROM users
        INNER JOIN subscriptions ON users.id = subscriptions.user_id
        INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
        WHERE users.id = ${req.query.id}
        ORDER BY subtidders.name;`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            subscriptions = result.rows.map(sub => sub.name);
            return res.status(200).send(subscriptions);
        }
    })
})

app.listen(PORT, () => {
    console.log('Server running on localhost:' + PORT);
})