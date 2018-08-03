const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    search = express.Router();

search.get('/subtidders', (req, res) => {
    let s = req.query.s;
    s = s.split(' ').join(' & ').replace(/'/g, "''");

    db.query(`
    SELECT name, description, creation_date FROM subtidders
    WHERE to_tsvector('english', name || ' ' || description)
    @@ to_tsquery('english', $1);
    `, [s], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let subtidders = result.rows;
            subtidders.forEach((subtidder) => {
                subtidder.creation_date = moment(subtidder.creation_date, 'MMMM DD YYYY').fromNow();
            })
            return res.status(200).send(subtidders);
        }
    })
})

search.get('/posts', (req, res) => {
    let s = req.query.s;
    s = s.split(' ').join(' & ').replace(/'/g, "''");

    db.query(`
    SELECT title, content, pub_date FROM posts
    WHERE to_tsvector('english', title || ' ' || content)
    @@ to_tsquery('english', $1);
    `, [s], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let posts = result.rows;
            posts.forEach((post) => {
                post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
            })
            return res.status(200).send(posts);
        }
    })
})

module.exports = search;
