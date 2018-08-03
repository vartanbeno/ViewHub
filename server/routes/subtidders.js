const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    t = express.Router();

t.get('/', (req, res) => {
    db.query(`SELECT name FROM subtidders ORDER BY name`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            all = result.rows.map(sub => sub.name);
            return res.status(200).send(all);
        }
    })
})

t.get('/all', (req, res) => {
    let offset = Number(req.query.offset);
    offset = (offset) ? offset : 0;

    db.query(`
    SELECT posts.id, title, content, username AS author, author_id, subtidders.name as subtidder, pub_date FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    ORDER BY pub_date DESC
    LIMIT 10
    OFFSET 10 * $1;
    `, [offset], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let posts = result.rows;
            posts.forEach((post) => {
                post.author = post.author || '[deleted]';
                post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
            })
            return res.status(200).send(posts);
        }
    })
})

t.get('/:subtidder', (req, res) => {

})

module.exports = t;
