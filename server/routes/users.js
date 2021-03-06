const express = require('express'),
    db = require('../db'),
    jwt = require('jsonwebtoken'),
    moment = require('moment'),
    users = express.Router();

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ error: 'Unauthorized request' });
    }

    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send({ error: 'Unauthorized request' });
    }

    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
        return res.status(401).send({ error: 'Unauthorized request' });
    }

    req.userId = payload.subject;
    next();
}

users.get('/all', verifyToken, (req, res) => {
    db.query(`
    SELECT
    CONCAT(first_name, ' ', last_name) as full_name, email, username, join_date, ENCODE(image, 'escape') as image
    FROM users;`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let users = result.rows;
            users.forEach((user) => {
                user.join_date = moment(user.join_date, 'MMMM DD YYYY').fromNow();
            })
            return res.status(200).send({ users });
        }
    })
})

users.get('/u/:username', (req, res) => {
    let { username } = req.params;
    db.query(`
    SELECT id, CONCAT(first_name, ' ', last_name) as full_name, email, username, join_date, biography,
    ENCODE(image, 'escape') as image
    FROM users WHERE username = $1;`, [username], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let user = result.rows[0];
            if (user) {
                user.join_date = moment(user.join_date, 'MMMM DD YYYY').fromNow();
                return res.status(200).send({ user });
            }
            else {
                return res.status(404).send({ error: 'User not found.' });
            }
        }
    })
})

users.get('/u/id/:user_id', (req, res) => {
    let { user_id } = req.params;
    db.query(`SELECT username FROM users WHERE id = $1;`, [user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let user = result.rows[0];
            if (user) {
                return res.status(200).send({ username: user.username });
            }
            else {
                return res.status(404).send({ error: 'User not found.' });
            }
        }
    })
})

users.put('/u/:username/pic', (req, res) => {
    let { username } = req.params;
    let { base64 } = req.body;
    db.query(`UPDATE users SET image = $1 WHERE username = $2;`, [base64, username], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send({ message: 'Successfully changed profile picture.' });
        }
    })
})

users.delete('/u/:username/pic', (req, res) => {
    let { username } = req.params;
    db.query(`UPDATE users SET image = NULL WHERE username = $1;`, [username], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send({ message: 'Successfully deleted profile picture.' });
        }
    })
})

users.get('/u/:username/posts', (req, res) => {
    let page = +req.query.page;
    page = (page > 0) ? (page - 1) : 0;

    let { username } = req.params;
    db.query(`
    SELECT posts.id, title, content,
    (SELECT CASE WHEN SUM(vote) IS NULL THEN 0 ELSE SUM(vote) END AS score FROM post_votes WHERE post_id = posts.id),
    author_id, username AS author, views.name AS view, pub_date
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN views ON (posts.view_id = views.id)
    WHERE username = $1
    ORDER BY pub_date DESC
    LIMIT 10
    OFFSET 10 * $2;
    `, [username, page], (error, result) => {
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
            LEFT OUTER JOIN users ON (posts.author_id = users.id)
            INNER JOIN views ON (posts.view_id = views.id)
            WHERE username = $1;
            `, [username], (error, result) => {
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

users.get('/u/:username/comments', (req, res) => {
    let { username } = req.params;

    db.query(`
    SELECT
    comments.id, post_id, posts.title AS post_title,
    comments.body AS body, comments.author_id AS author_id,
    username AS author, views.name AS view, comments.pub_date, comments.last_edited
    FROM comments
    LEFT OUTER JOIN users ON (comments.author_id = users.id)
    INNER JOIN posts ON (comments.post_id = posts.id)
    INNER JOIN views ON (posts.view_id = views.id)
    WHERE users.username = $1
    ORDER BY comments.pub_date DESC
    `, [username], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let comments = result.rows;
            comments.forEach((comment) => {
                comment.pub_date = moment(comment.pub_date, 'MMMM DD YYYY').fromNow();
                comment.last_edited = (comment.last_edited) ? moment(comment.last_edited, 'MMMM DD YYYY').fromNow() : comment.last_edited;
            })
            return res.status(200).send({ comments });
        }
    })
})

users.put('/u/:user_id/bio', (req, res) => {
    let { user_id } = req.params;
    let { biography } = req.body;

    db.query(`
    UPDATE users SET biography = $1 WHERE id = $2;
    `, [biography, user_id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send({ message: 'Successfully updated biography.' });
        }
    })
})

module.exports = users;
