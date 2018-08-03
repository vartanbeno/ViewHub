const express = require('express'),
    db = require('../db'),
    posts = express.Router();

posts.post('/add', (req, res) => {
    let { title, content, userId, subtidder } = req.body;
    title = title.replace(/'/g, "''");
    content = content.replace(/'/g, "''");

    db.query(`
        INSERT INTO posts (title, content, author_id, subtidder_id)
        SELECT $1, $2, $3, s.id
        FROM (SELECT id FROM subtidders WHERE name = $4) s;`,
        [title, content, userId, subtidder],
        (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ error: 'Something went wrong.' });
            }
            else {
                return res.status(200).json('OK');
            }
    })
})

posts.post('/edit/', (req, res) => {
    let { id, content } = req.body;
    db.query(`UPDATE posts SET content = $1 WHERE id = $2;`, [content, id], (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).json('Post edited.');
        }
    })
})

posts.delete('/delete/:id', (req, res) => {
    let postId = req.params.id;
    db.query(`DELETE FROM posts WHERE id = $1;`, [postId], (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).json('Post deleted.');
        }
    })
})

posts.get('/count', (req, res) => {
    db.query(`SELECT COUNT(*) FROM posts`, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).send(result.rows[0].count);
        }
    })
})

module.exports = posts;
