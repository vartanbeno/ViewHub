const { Client } = require('pg');

const client = new Client({
    host: 'pellefant.db.elephantsql.com',
    port: 5432,
    database: 'nxtvgtwn',
    user: 'nxtvgtwn',
    password: '2axOHwC_2dqLEqohrBE0H1gPJWYX2dZD'
})

client.connect();

module.exports = {
    query: (text, params, callback) => {
        return client.query(text, params, callback);
    }
}
