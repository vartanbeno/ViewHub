const express = require('express'),
    db = require('../db'),
    jwt = require('jsonwebtoken'),
    moment = require('moment'),
    users = express.Router();

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ error: 'Unauthorized request' });
    }

    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send({ error: 'Unauthorized request' });
    }

    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
        return res.status(401).send({ error: 'Unauthorized request' });
    }

    req.userId = payload.subject;
    next();
}

users.get('/all', verifyToken, (req, res) => {
    db.query(`
        SELECT
        CONCAT(first_name, ' ', last_name) as full_name,
        email, username, join_date FROM users;`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else {
            let users = result.rows;
            for (i in users) {
                users[i].join_date = moment(users[i].join_date, 'MMMM DD YYYY').fromNow();
            }
            return res.status(200).send(users);
        }
    })
})

users.get('/u/:username', (req, res) => {
    
})

module.exports = users;
