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
            let subtidders = result.rows.map(subtidder => subtidder.name);
            return res.status(200).send({ subtidders });
        }
    })
})

t.post('/subtidders/create', (req, res) => {
    let { name, description, creator_id } = req.body;

    db.query(`
    INSERT INTO subtidders (name, description, creator_id) VALUES ($1, $2, $3)
    RETURNING name;
    `,
    [name, description, creator_id], (error, result) => {
        if (error) {
            console.log(error);
            if (error.constraint === 'subtidders_name_key' || error.constraint === 'check_not_all') {
                return res.status(400).send({ error: 'Subtidder with this name already exists.' });
            }
            else {
                return res.status(500).send({ error: 'Something went wrong.' });
            }
        }
        else {
            let subtidder = result.rows[0].name;
            return res.status(200).send({ message: 'Subtidder ' + subtidder + ' created.' });
        }
    })
})

t.get('/:subtidder', (req, res) => {
    let { subtidder } = req.params;
    let page = Number(req.query.page);
    page = (page > 0) ? (page - 1) : 0;

    let isAll = (subtidder === 'all');

    if (isAll) {
        db.query(`
        SELECT posts.id, title, content,
        CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
        author_id, subtidders.name AS subtidder, pub_date FROM posts
        LEFT OUTER JOIN users ON (posts.author_id = users.id)
        INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
        ORDER BY pub_date DESC
        LIMIT 10
        OFFSET 10 * $1;
        `, [page], (error, result) => {
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
    }

    else {
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
                `, [subtidder, page], (error, result) => {
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
            }
        })
    }
})

t.get('/:subtidder/count', (req, res) => {
    let { subtidder } = req.params;
    let isAll = (subtidder === 'all');

    if (isAll) {
        db.query(`SELECT COUNT(*) FROM posts`, (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ error: 'Something went wrong.' });
            }
            else {
                let numberOfPosts = result.rows[0].count;
                return res.status(200).send({ numberOfPosts });
            }
        })
    }

    else {
        db.query(`
        SELECT COUNT(*) FROM posts
        INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
        WHERE subtidders.name = $1;
        `, [subtidder], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ error: 'Something went wrong.' });
            }
            else {
                let numberOfPosts = result.rows[0].count;
                return res.status(200).send({ numberOfPosts });
            }
        })
    }
})

t.get('/all/countSubtidders', (req, res) => {
    db.query(`SELECT COUNT(*) FROM subtidders`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let numberOfSubtidders = result.rows[0].count;
            return res.status(200).send({ numberOfSubtidders });
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
            let subtidderData = result.rows[0];
            subtidderData.creation_date = moment(subtidderData.creation_date, 'MMMM DD YYYY').fromNow();
            return res.status(200).send({ subtidderData });
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
            return res.status(200).send({ message: 'Post added to ' + subtidder + '.' });
        }
    })
})

t.route('/:subtidder/:post_id')

    .put((req, res) => {
        let { content } = req.body;
        let { subtidder, post_id } = req.params;

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
        `, [content, post_id, subtidder], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ error: 'Something went wrong.' });
            }
            else {
                if (!result.rowCount) {
                    return res.status(404).send({ error: 'Post not found.' });
                }
                else {
                    return res.status(200).send({ message: 'Post edited.' });
                }
            }
        })
    })

    .delete((req, res) => {
        let { subtidder, post_id } = req.params;
    
        db.query(`
        DELETE FROM posts
        WHERE id = $1
        AND id IN
            (SELECT posts.id AS id
            FROM posts INNER JOIN subtidders
            ON posts.subtidder_id = subtidders.id
            WHERE subtidders.name = $2)
        `, [post_id, subtidder], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ error: 'Something went wrong.' });
            }
            else {
                if (!result.rowCount) {
                    return res.status(404).send({ error: 'Post not found.' });
                }
                else {
                    return res.status(200).send({ message: 'Post deleted.' });
                }
            }
        })
    })

module.exports = t;
