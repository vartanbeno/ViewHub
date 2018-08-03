const express = require('express'),
    db = require('../db'),
    jwt = require('jsonwebtoken'),
    moment = require('moment'),
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

module.exports = posts;
