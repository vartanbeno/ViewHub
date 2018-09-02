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
    author_id, views.name AS view, pub_date
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN views ON (posts.view_id = views.id)
    WHERE views.name IN (
        SELECT views.name
	    FROM users
	    INNER JOIN subscriptions ON users.id = subscriptions.user_id
	    INNER JOIN views ON subscriptions.view_id = views.id
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

            posts.forEach((post) => {
                post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
            })
            
            db.query(`
            SELECT COUNT(*)
            FROM posts
            INNER JOIN views ON (posts.view_id = views.id)
            WHERE views.name IN (
                SELECT views.name
                FROM users
                INNER JOIN subscriptions ON users.id = subscriptions.user_id
                INNER JOIN views ON subscriptions.view_id = views.id
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
    })
})

subscriptions.get('/:user_id', (req, res) => {
    let { user_id } = req.params;

    db.query(`
    SELECT views.name
    FROM users
    INNER JOIN subscriptions ON users.id = subscriptions.user_id
    INNER JOIN views ON subscriptions.view_id = views.id
    WHERE users.id = $1
    ORDER BY views.name;
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
    INNER JOIN views ON subscriptions.view_id = views.id
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

// check if user is subscribed to view
subscriptions.get('/:user_id/:view', (req, res) => {
    let { user_id, view } = req.params;

    db.query(`
    SELECT COUNT(1) FROM views
    WHERE name = $1
    AND NAME IN (
        SELECT views.name FROM users
        INNER JOIN subscriptions ON users.id = subscriptions.user_id
        INNER JOIN views ON subscriptions.view_id = views.id
        WHERE users.id = $2
    );
    `, [view, user_id], (error, result) => {
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

subscriptions.post('/:user_id/:view', (req, res) => {
    let { user_id, view } = req.params;

    db.query(`
    INSERT INTO subscriptions
    (user_id, view_id)
    SELECT $1, views.id FROM views
    WHERE views.name = $2;
    `, [user_id, view], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (!result.rowCount) {
                return res.status(404).send({ error: 'View does not exist.' });
            }
            else {
                return res.status(200).send({ message: 'Subscribed to ' + view + '.' });
            }
        }
    })
})

subscriptions.delete('/:user_id/:view', (req, res) => {
    let { user_id, view } = req.params;

    db.query(`
    DELETE FROM subscriptions
    WHERE user_id = $1
    AND view_id IN (
        SELECT id FROM views
        WHERE name = $2
    );
    `, [user_id, view], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (!result.rowCount) {
                return res.status(404).send({ error: 'View not found in subscriptions.' });
            }
            else {
                return res.status(200).send({ message: 'Unsubscribed from ' + view + '.' });
            }
        }
    })
})

module.exports = subscriptions;
