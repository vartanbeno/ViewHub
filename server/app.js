const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    db = require('./db'),
    fs = require('fs'),
    PORT = 3000,
    app = express();

const sql = fs.readFileSync('./db/init_db.sql').toString();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/authenticate', require('./routes/authenticate'));
app.use('/t', require('./routes/subtidders'));
app.use('/users', require('./routes/users'));
app.use('/search', require('./routes/search'));
app.use('/posts', require('./routes/posts'));
app.use('/subscriptions', require('./routes/subscriptions'));

db.query(sql, (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Tables created.');
    }
})

app.listen(PORT, () => {
    console.log('Server running on localhost:' + PORT);
})