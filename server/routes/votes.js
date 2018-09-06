const express = require('express'),
    db = require('../db'),
    votes = express.Router();

// get all posts upvoted/downvoted by a user
votes.get('/:user_id/:vote', (req, res) => {
    let { user_id, vote } = req.params;
    vote = (vote === 'up') ? 1 : (vote === 'down') ? -1 : 0;

    if (vote === 0) {
        return res.status(404).send({ error: `The 'vote' parameter should either be 'up' or 'down'.` });
    }

    db.query(`
    SELECT post_id
    FROM post_votes WHERE user_id = $1 AND vote = $2;
    `, [user_id, vote], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let posts = result.rows.map(post => post.post_id);
            return res.status(200).send({ posts });
        }
    })
})

// upvote or downvote
votes.post('/:post_id/:user_id/:vote', (req, res) => {
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
votes.delete('/:post_id/:user_id', (req, res) => {
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

module.exports = votes;
