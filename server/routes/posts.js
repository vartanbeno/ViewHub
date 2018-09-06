const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    posts = express.Router();

posts.get('/:post_id', (req, res) => {
    let { post_id } = req.params;

    db.query(`
    SELECT posts.id, title, content,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
    author_id, views.name AS view, pub_date, last_edited
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN views ON (posts.view_id = views.id)
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

// upvote or downvote
posts.post('/:post_id/:user_id/:vote', (req, res) => {
    let { post_id, user_id, vote } = req.params;
    vote = (vote === 'up') ? 1 : (vote === 'down') ? -1 : 0;

    if (vote === 0) {
        return res.status(404).send({ error: `The 'vote' parameter should either be 'up' or 'down'.` });
    }

    db.query(`
    INSERT INTO post_votes VALUES ($1, $2, $3)
    ON CONFLICT (post_id, user_id)
    DO UPDATE SET vote = excluded.vote;
    `, [post_id, user_id, vote], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let message = (vote === 1) ? 'Successfully upvoted.' : 'Succesfully downvoted.';
            return res.status(200).send({ message });
        }
    })
})

// remove upvote or downvote
posts.delete('/:post_id/:user_id', (req, res) => {
    let { post_id, user_id } = req.params;

    db.query(`
    DELETE FROM post_votes WHERE
    post_id = $1 AND user_id = $2
    RETURNING vote;
    `, [post_id, user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (result.rowCount) {
                let message = (result.rows[0].vote === 1) ? 'Successfully removed upvote.' : 'Successfully removed downvote.';
                return res.status(200).send({ message })
            }
            else {
                return res.status(400).send({ error: `Vote doesn't exist.` });
            }
        }
    })
})

module.exports = posts;
