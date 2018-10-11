const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    t = express.Router();

t.get('/', (req, res) => {
    db.query(`SELECT name FROM views ORDER BY name`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let views = result.rows;
            return res.status(200).send({ views });
        }
    })
})

t.post('/views/create', (req, res) => {
    let { name, description, creator_id } = req.body;

    db.query(`
    INSERT INTO views (name, description, creator_id) VALUES ($1, $2, $3)
    RETURNING name;
    `,
    [name, description, creator_id], (error, result) => {
        if (error) {
            console.log(error);
            if (error.constraint === 'views_name_key' || error.constraint === 'check_not_all') {
                return res.status(400).send({ error: 'View with this name already exists.' });
            }
            else {
                return res.status(500).send({ error: 'Something went wrong.' });
            }
        }
        else {
            let view = result.rows[0].name;
            return res.status(200).send({ message: 'View ' + view + ' created.' });
        }
    })
})

t.get('/:view', (req, res) => {
    let { view } = req.params;
    let page = +req.query.page;
    page = (page > 0) ? (page - 1) : 0;

    let isAll = (view === 'all');

    if (isAll) {
        db.query(`
        SELECT posts.id, title, content,
        CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
        (SELECT CASE WHEN SUM(vote) IS NULL THEN 0 ELSE SUM(vote) END AS score FROM post_votes WHERE post_id = posts.id),
        author_id, views.name AS view, pub_date FROM posts
        LEFT OUTER JOIN users ON (posts.author_id = users.id)
        INNER JOIN views ON (posts.view_id = views.id)
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

                db.query(`SELECT COUNT(*) FROM posts`, (error, result) => {
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
    }

    else {
        db.query(`
        SELECT COUNT(1) FROM views WHERE name = $1;
        `, [view], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ error: 'Something went wrong.' });
            }
            else if (result.rows[0].count === '0') {
                return res.status(404).send({ error: 'View not found.' });
            }
            else {
                db.query(`
                SELECT posts.id, title, content,
                (SELECT CASE WHEN SUM(vote::bigint) IS NULL THEN 0 ELSE SUM(vote::bigint) END AS score FROM post_votes WHERE post_id = posts.id),
                CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
                author_id, views.name AS view, pub_date FROM posts
                LEFT OUTER JOIN users ON (posts.author_id = users.id)
                INNER JOIN views ON (posts.view_id = views.id)
                WHERE views.name = $1
                ORDER BY pub_date DESC
                LIMIT 10
                OFFSET 10 * $2;
                `, [view, page], (error, result) => {
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
                        SELECT COUNT(*) FROM posts
                        INNER JOIN views ON (posts.view_id = views.id)
                        WHERE views.name = $1;
                        `, [view], (error, result) => {
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
            }
        })
    }
})

t.get('/all/countViews', (req, res) => {
    db.query(`SELECT COUNT(*) FROM views`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let numberOfViews = result.rows[0].count;
            return res.status(200).send({ numberOfViews });
        }
    })
})

t.get('/:view/info', (req, res) => {
    let { view } = req.params;

    db.query(`
    SELECT name, description,
    CASE WHEN users.username IS NULL THEN '[deleted]' ELSE users.username END AS creator,
    creation_date
    FROM views LEFT OUTER JOIN users ON
    (views.creator_id = users.id)
    WHERE name = $1
    `, [view], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (result.rowCount) {
                let viewData = result.rows[0];
                viewData.creation_date = moment(viewData.creation_date, 'MMMM DD YYYY').fromNow();
                return res.status(200).send({ viewData });
            }
            else {
                return res.status(404).send({ error: 'View does not exist.' });
            }
        }
    })
})



/**
 * Adding, editing, and deleting posts below.
 */

t.post('/:view/add', (req, res) => {
    let { title, content, author_id } = req.body;
    let { view } = req.params;

    db.query(`
    INSERT INTO posts (title, content, author_id, view_id)
    SELECT $1, $2, $3, s.id
    FROM (SELECT id FROM views WHERE name = $4) s;`,
    [title, content, author_id, view],
    (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send({ message: 'Post added to ' + view + '.' });
        }
    })
})

t.route('/:view/:post_id')

    .put((req, res) => {
        let { content } = req.body;
        let { view, post_id } = req.params;

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
            FROM posts INNER JOIN views
            ON posts.view_id = views.id
            WHERE views.name = $3)
        `, [content, post_id, view], (error, result) => {
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
        let { view, post_id } = req.params;
    
        db.query(`
        DELETE FROM posts
        WHERE id = $1
        AND id IN
            (SELECT posts.id AS id
            FROM posts INNER JOIN views
            ON posts.view_id = views.id
            WHERE views.name = $2)
        `, [post_id, view], (error, result) => {
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
