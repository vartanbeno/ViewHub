const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    comments = express.Router();

comments.get('/:post_id', (req, res) => {
    let { post_id } = req.params;

    db.query(`
    SELECT comments.id, body, CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author, author_id, post_id, pub_date
    FROM comments
    LEFT OUTER JOIN users ON (comments.author_id = users.id)
    WHERE post_id = $1
    ORDER BY pub_date DESC;
    `, [post_id], (error, result) => {
        let comments = result.rows;
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            comments.forEach((comment) => comment.pub_date = moment(comment.pub_date, 'MMMM DD YYYY').fromNow());
            return res.status(200).send(comments);
        }
    })
})

// add comment
comments.put('/', (req, res) => {
    let { body, author_id, post_id } = req.body;

    db.query(`
    INSERT INTO comments (body, author_id, post_id)
    VALUES ($1, $2, $3);
    `, [body, author_id, post_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send({ message: 'Comment successfully posted.' });
        }
    })
})

comments.delete('/:comment_id', (req, res) => {
    let { comment_id } = req.params;

    db.query(`
    DELETE FROM comments WHERE id = $1;
    `, [comment_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (result.rowCount) {
                return res.status(200).send({ message: 'Comment successfully deleted.' });
            }
            else {
                return res.status(404).send({ error: 'Comment not found.' });
            }
        }
    })
})

module.exports = comments;
