const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    subscriptions = express.Router();

// get posts from subscriptions
subscriptions.get('/:user_id/posts', (req, res) => {
    let { user_id } = req.params;
    let page = +req.query.page;
    page = (page > 0) ? (page - 1) : 0;

    db.query(`
    SELECT posts.id, title, content,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
    author_id, subtidders.name AS subtidder, pub_date
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    WHERE subtidders.name IN (
        SELECT subtidders.name
	    FROM users
	    INNER JOIN subscriptions ON users.id = subscriptions.user_id
	    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
	    WHERE users.id = $1
    )
    ORDER BY pub_date DESC
    LIMIT 10
    OFFSET 10 * $2;
    `, [user_id, page], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let posts = result.rows;
            if (posts.length) {
                posts.forEach((post) => {
                    post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
                })
                db.query(`
                SELECT COUNT(*)
                FROM posts
                INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
                WHERE subtidders.name IN (
                    SELECT subtidders.name
                    FROM users
                    INNER JOIN subscriptions ON users.id = subscriptions.user_id
                    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
                    WHERE users.id = $1
                );
                `, [user_id], (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({ error: 'Something went wrong.' });
                    }
                    else {
                        let numberOfPosts = result.rows[0].count;
                        return res.status(200).send({ numberOfPosts, posts });
                    }
                })
            }
            else {
                return res.status(200).send({ message: 'There are no posts in user\'s subscriptions.' });
            }
        }
    })
})

subscriptions.get('/:user_id', (req, res) => {
    let { user_id } = req.params;

    db.query(`
    SELECT subtidders.name
    FROM users
    INNER JOIN subscriptions ON users.id = subscriptions.user_id
    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
    WHERE users.id = $1
    ORDER BY subtidders.name;
    `, [user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let subscriptions = result.rows;
            return res.status(200).send({ subscriptions });
        }
    })
})

/**
 * We don't use this anywhere [yet].
 * It's used to count the user's subcriptions.
 */
subscriptions.get('/:user_id/count', (req, res) => {
    let { user_id } = req.params;

    db.query(`
    SELECT COUNT(*)
    FROM users
    INNER JOIN subscriptions ON users.id = subscriptions.user_id
    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
    WHERE users.id = $1;
    `, [user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let numberOfSubscriptions = result.rows[0].count;
            return res.status(200).send({ numberOfSubscriptions });
        }
    })
})

// check if user is subscribed to subtidder
subscriptions.get('/:user_id/:subtidder', (req, res) => {
    let { user_id, subtidder } = req.params;

    db.query(`
    SELECT COUNT(1) FROM subtidders
    WHERE name = $1
    AND NAME IN (
        SELECT subtidders.name FROM users
        INNER JOIN subscriptions ON users.id = subscriptions.user_id
        INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
        WHERE users.id = $2
    );
    `, [subtidder, user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let isSubscribed = (+(result.rows[0].count)) ? true : false;
            return res.status(200).send({ isSubscribed });
        }
    })
})

subscriptions.post('/:user_id/:subtidder', (req, res) => {
    let { user_id, subtidder } = req.params;

    db.query(`
    INSERT INTO subscriptions
    (user_id, subtidder_id)
    SELECT $1, subtidders.id FROM subtidders
    WHERE subtidders.name = $2;
    `, [user_id, subtidder], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (!result.rowCount) {
                return res.status(404).send({ error: 'Subtidder does not exist.' });
            }
            else {
                return res.status(200).send({ message: 'Subscribed to ' + subtidder + '.' });
            }
        }
    })
})

subscriptions.delete('/:user_id/:subtidder', (req, res) => {
    let { user_id, subtidder } = req.params;

    db.query(`
    DELETE FROM subscriptions
    WHERE user_id = $1
    AND subtidder_id IN (
        SELECT id FROM subtidders
        WHERE name = $2
    );
    `, [user_id, subtidder], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (!result.rowCount) {
                return res.status(404).send({ error: 'Subtidder not found in subscriptions.' });
            }
            else {
                return res.status(200).send({ message: 'Unsubscribed from ' + subtidder + '.' });
            }
        }
    })
})

module.exports = subscriptions;
