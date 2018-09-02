const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    search = express.Router();

search.get('/views', (req, res) => {
    let q = req.query.q;
    q = q.split(' ').join(' & ');

    db.query(`
    SELECT name, description,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS creator,
    creation_date FROM views
    LEFT OUTER JOIN users ON (views.creator_id = users.id)
    WHERE views.tokens @@ to_tsquery('english', $1);
    `, [q], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let views = result.rows;
            views.forEach((view) => {
                view.creation_date = moment(view.creation_date, 'MMMM DD YYYY').fromNow();
            })
            return res.status(200).send({ views });
        }
    })
})

search.get('/posts', (req, res) => {
    let q = req.query.q;
    q = q.split(' ').join(' & ');

    db.query(`
    SELECT posts.id,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
    title, content, views.name as view, pub_date FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN views ON (posts.view_id = views.id)
    WHERE posts.tokens @@ to_tsquery('english', $1);
    `, [q], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let posts = result.rows;
            posts.forEach((post) => {
                post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
            })
            return res.status(200).send({ posts });
        }
    })
})

module.exports = search;
