const express = require('express'),
    db = require('../db'),
    subscriptions = express.Router();

subscriptions.get('/:id', (req, res) => {
    let { id } = req.params;
    db.query(`
    SELECT subtidders.name
    FROM users
    INNER JOIN subscriptions ON users.id = subscriptions.user_id
    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
    WHERE users.id = $1
    ORDER BY subtidders.name;`, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            subs = result.rows.map(sub => sub.name);
            return res.status(200).send(subs);
        }
    })
})

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

module.exports = subscriptions;
