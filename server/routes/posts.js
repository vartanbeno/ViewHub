const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    posts = express.Router();

posts.get('/:post_id', (req, res) => {
    let { post_id } = req.params;

    db.query(`
    SELECT posts.id, title, content,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
    author_id, subtidders.name AS subtidder, pub_date, last_edited
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    WHERE posts.id = $1;
    `, [post_id], (error, result) => {
        let post = result.rows[0];
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else if (post) {
            post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
            post.last_edited = (post.last_edited) ? moment(post.last_edited, 'MMMM DD YYYY').fromNow() : post.last_edited;
            return res.status(200).send({ post });
        }
        else {
            return res.status(404).send({ error: "Post not found." });
        }
    })
})

module.exports = posts;
