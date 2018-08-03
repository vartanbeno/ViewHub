const express = require('express'),
    jwt = require('jsonwebtoken'),
    db = require('../db'),
    auth = express.Router();

auth.post('/register/', (req, res) => {
    let user = req.body;
    user.firstName = user.firstName.replace(/'/g, "''");
    user.lastName = user.lastName.replace(/'/g, "''");
    
    db.query(`
    SELECT username FROM users WHERE username = $1;`,
    [user.username],
    (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else if (result.rows.length) {
            return res.status(401).send({ error: 'Username already taken.' });
        }
        else {
            db.query(`
            INSERT INTO users
            (first_name, last_name, email, username, password) VALUES
            ($1, $2, $3, $4, $5)
            RETURNING id, CONCAT(first_name, ' ', last_name) as full_name;`,
            [user.firstName, user.lastName, user.email, user.username, user.password],
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ error: 'Something went wrong.' });
                }
                else {
                    let payload = { subject: result.rows[0].id };
                    let token = jwt.sign(payload, 'secretKey');
                    return res.status(200).send({
                        token: token,
                        id: result.rows[0].id,
                        fullname: result.rows[0].full_name
                    });
                }
            })
        }
    });
})

auth.post('/login', (req, res) => {
    let user = req.body;
    db.query(`
    SELECT id, CONCAT(first_name, ' ', last_name) as full_name, username, password FROM users
    WHERE username = $1 AND password = $2;`,
    [user.username, user.password],
    (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({ error: 'Something went wrong.' });
        }
        else if (!result.rows.length) {
            return res.status(401).send({ error: 'Incorrect username and/or password.' });
        }
        else {
            let payload = { subject: result.rows[0].id };
            let token = jwt.sign(payload, 'secretKey');
            return res.status(200).send({
                token: token,
                id: result.rows[0].id,
                fullname: result.rows[0].full_name
            });
        }
    })
})

module.exports = auth;
