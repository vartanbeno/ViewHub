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
            let all = result.rows.map(sub => sub.name);
            return res.status(200).send(all);
        }
    })
})

t.post('/subtidders/create', (req, res) => {
    let { name, description, creator_id } = req.body;

    db.query(
    `INSERT INTO subtidders (name, description, creator_id) VALUES ($1, $2, $3);`,
    [name, description, creator_id], (error, result) => {
        if (error) {
            console.log(error);
            if (error.detail.includes('already exists') || error.constraint === 'check_not_all') {
                return res.status(400).send({ error: 'Subtidder with this name already exists.' });
            }
            else {
                return res.status(500).send({ error: 'Something went wrong.' });
            }
        }
        else {
            return res.status(200).json('Subtidder created.');
        }
    })
})

t.get('/all', (req, res) => {
    let offset = Number(req.query.offset);
    offset = (offset) ? offset : 0;

    db.query(`
    SELECT posts.id, title, content,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
    author_id, subtidders.name AS subtidder, pub_date FROM posts
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

t.get('/all/countSubtidders', (req, res) => {
    db.query(`SELECT COUNT(*) FROM subtidders`, (error, result) => {
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
    SELECT COUNT(1) FROM subtidders WHERE name = $1;
    `, [subtidder], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else if (result.rows[0].count === '0') {
            return res.status(404).send({ error: 'Subtidder not found.' });
        }
        else {
            db.query(`
            SELECT posts.id, title, content,
            CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
            author_id, subtidders.name AS subtidder, pub_date FROM posts
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
                            post.pub_date = moment(post.pub_date, 'MMMM DD YYYY').fromNow();
                        })
                        return res.status(200).send(posts);
                    }
                })
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

t.get('/:subtidder/info', (req, res) => {
    let { subtidder } = req.params;

    db.query(`
    SELECT name, description,
    CASE WHEN users.username IS NULL THEN '[deleted]' ELSE users.username END AS creator,
    creation_date
    FROM subtidders LEFT OUTER JOIN users ON
    (subtidders.creator_id = users.id)
    WHERE name = $1
    `, [subtidder], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let subtidderInfo = result.rows[0];
            subtidderInfo.creation_date = moment(subtidderInfo.creation_date, 'MMMM DD YYYY').fromNow();
            return res.status(200).send(subtidderInfo);
        }
    })
})



/**
 * Adding, editing, and deleting posts below.
 */

t.post('/:subtidder/add', (req, res) => {
    let { title, content, userId } = req.body;
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
