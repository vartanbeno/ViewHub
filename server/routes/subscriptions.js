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
    ORDER BY subtidders.name;
    `, [id], (error, result) => {
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
    WHERE subtidders.name = $2
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
