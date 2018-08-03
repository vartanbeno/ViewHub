const express = require('express'),
    db = require('../db'),
    subscriptions = express.Router();

subscriptions.get('/', (req, res) => {
    let userId = req.query.id;
    db.query(`
    SELECT subtidders.name FROM users
    INNER JOIN subscriptions ON users.id = subscriptions.user_id
    INNER JOIN subtidders ON subscriptions.subtidder_id = subtidders.id
    WHERE users.id = $1
    ORDER BY subtidders.name;`, [userId], (error, result) => {
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

module.exports = subscriptions;