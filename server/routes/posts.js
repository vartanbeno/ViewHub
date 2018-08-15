const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    posts = express.Router();

posts.get('/:id', (req, res) => {
    let { id } = req.params;

    db.query(`
    SELECT title, content,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
    author_id, subtidders.name AS subtidder, pub_date
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    WHERE posts.id = $1;
    `, [id], (error, result) => {
        let post = result.rows[0];
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else if (post) {
            post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
            return res.status(200).send(post);
        }
        else {
            return res.status(404).send({ error: "Post not found." });
        }
    })
})

module.exports = posts;
