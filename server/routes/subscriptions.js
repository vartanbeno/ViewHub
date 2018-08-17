const express = require('express'),
    db = require('../db'),
    moment = require('moment'),
    subscriptions = express.Router();

// get posts from subscribed subtidders
subscriptions.get('/', (req, res) => {
    let { subscriptions, offset } = req.query;
    offset = Number(offset);
    offset = (offset) ? offset : 0;
    
    // if you only have 1 subscription it parses it as a string for some reason
    if (typeof(subscriptions) === 'string') subscriptions = subscriptions.split(' ');
    let placeholders = subscriptions.map((sub, i) => `$${i + 1}`).join(',');

    subscriptions.push(offset);

    db.query(`
    SELECT posts.id, title, content,
    CASE WHEN username IS NULL THEN '[deleted]' ELSE username END AS author,
    author_id, subtidders.name AS subtidder, pub_date
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    WHERE subtidders.name IN (${placeholders})
    ORDER BY pub_date DESC
    LIMIT 10
    OFFSET 10 * $${subscriptions.length};
    `, subscriptions, (error, result) => {
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

subscriptions.get('/count', (req, res) => {
    let { subscriptions } = req.query;

    if (typeof (subscriptions) === 'string') subscriptions = subscriptions.split(' ');
    let placeholders = subscriptions.map((sub, i) => `$${i + 1}`).join(',');

    db.query(`
    SELECT COUNT(*)
    FROM posts
    LEFT OUTER JOIN users ON (posts.author_id = users.id)
    INNER JOIN subtidders ON (posts.subtidder_id = subtidders.id)
    WHERE subtidders.name IN (${placeholders})
    `, subscriptions, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                return res.status(200).send(result.rows[0].count);
            }
        })
})

subscriptions.get('/:id', (req, res) => {
    let { id } = req.params;

    db.query(`
    SELECT subtidders.name
    FROM users
    INNER JOIN subscriptions ON users.id = subscriptions.user_id
    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
    WHERE users.id = $1
    ORDER BY subtidders.name;
    `, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let subs = result.rows.map(sub => sub.name);
            return res.status(200).send(subs);
        }
    })
})

// We don't user this anywhere [yet].
subscriptions.get('/:id/count', (req, res) => {
    let { id } = req.params;

    db.query(`
    SELECT COUNT(*)
    FROM users
    INNER JOIN subscriptions ON users.id = subscriptions.user_id
    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
    WHERE users.id = $1;
    `, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send(result.rows[0].count);
        }
    })
})

// check if user is subscribed to subtidder
subscriptions.get('/:id/:subtidder', (req, res) => {
    let { id, subtidder } = req.params;

    db.query(`
    SELECT COUNT(1) FROM subtidders
    WHERE name = $1
    AND NAME IN (
        SELECT subtidders.name FROM users
        INNER JOIN subscriptions ON users.id = subscriptions.user_id
        INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
        WHERE users.id = $2
    );
    `, [subtidder, id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            return res.status(200).send(result.rows[0]);
        }
    })
})

subscriptions.post('/:id/:subtidder', (req, res) => {
    let { id, subtidder } = req.params;

    db.query(`
    INSERT INTO subscriptions
    (user_id, subtidder_id)
    SELECT $1, subtidders.id FROM subtidders
    WHERE subtidders.name = $2;
    `, [id, subtidder], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send({ error: 'Something went wrong.' });
            }
            else {
                if (!result.rowCount) {
                    return res.status(404).json('Subtidder does not exist.');
                }
                else {
                    return res.status(200).json('Subscribed to ' + subtidder + '.');
                }
            }
        })
})

subscriptions.delete('/:id/:subtidder', (req, res) => {
    let { id, subtidder } = req.params;

    db.query(`
    DELETE FROM subscriptions
    WHERE user_id = $1
    AND subtidder_id IN (
        SELECT id FROM subtidders
        WHERE name = $2
    );
    `, [id, subtidder], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            if (!result.rowCount) {
                return res.status(404).json('Subtidder not found in subscriptions.');
            }
            else {
                return res.status(200).json('Unsubscribed from ' + subtidder + '.');
            }
        }
    })
})

module.exports = subscriptions;
