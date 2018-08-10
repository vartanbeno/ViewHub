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
    SELECT posts.id, title, content, username AS author, author_id, subtidders.name AS subtidder, pub_date FROM posts
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

t.get('/all/count', (req, res) => {
    db.query(`SELECT COUNT(*) FROM posts`, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            return res.status(200).send(result.rows[0].count);
        }
    })
})

t.get('/:subtidder', (req, res) => {
    let { subtidder } = req.params;

    let offset = Number(req.query.offset);
    offset = (offset) ? offset : 0;

    db.query(`
    SELECT posts.id, title, content, username AS author, author_id, subtidders.name AS subtidder, pub_date FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    WHERE subtidders.name = $1
    ORDER BY pub_date DESC
    LIMIT 10
    OFFSET 10 * $2;
    `, [subtidder, offset], (error, result) => {
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

t.get('/:subtidder/count', (req, res) => {
    let { subtidder } = req.params;

    db.query(`
    SELECT COUNT(*) FROM
    posts INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    WHERE subtidders.name = $1;
    `, [subtidder], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send(result.rows[0].count);
        }
    })
})

t.post('/:subtidder/add', (req, res) => {
    let { title, content, userId } = req.body;
    title = title.replace(/'/g, "''");
    content = content.replace(/'/g, "''");

    let { subtidder } = req.params;

    db.query(`
    INSERT INTO posts (title, content, author_id, subtidder_id)
    SELECT $1, $2, $3, s.id
    FROM (SELECT id FROM subtidders WHERE name = $4) s;`,
    [title, content, userId, subtidder],
    (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).json('OK');
        }
    })
})

t.post('/:subtidder/:id/edit', (req, res) => {
    let { content } = req.body;
    let { subtidder, id } = req.params;

    /**
     * We could very well just do:
     * UPDATE posts SET content = 'test' WHERE id = 43
     * But I felt like going the more complicated route.
     */
    db.query(`
    UPDATE posts
    SET content = $1
    WHERE id = $2
    AND id IN
        (SELECT posts.id
        FROM posts INNER JOIN subtidders
        ON posts.subtidder_id = subtidders.id
        WHERE subtidders.name = $3)
    `, [content, id, subtidder], (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            if (!result.rowCount) {
                return res.status(404).json('Post not found.');
            }
            else {
                return res.status(200).json('Post edited.');
            }
        }
    })
})

t.delete('/:subtidder/:id/delete', (req, res) => {
    let { subtidder, id } = req.params;
    
    db.query(`
    DELETE FROM posts
    WHERE id = $1
    AND id IN
        (SELECT posts.id AS id
        FROM posts INNER JOIN subtidders
        ON posts.subtidder_id = subtidders.id
        WHERE subtidders.name = $2)
    `, [id, subtidder], (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            if (!result.rowCount) {
                return res.status(404).json('Post not found.');
            }
            else {
                return res.status(200).json('Post deleted.');
            }
        }
    })
})

module.exports = t;
