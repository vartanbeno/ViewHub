const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    db = require('./db'),
    fs = require('fs'),
    path = require('path'),
    port = process.env.PORT || 3000,
    app = express();

const sql = fs.readFileSync(path.resolve(__dirname, './db/init_db.sql')).toString();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/authenticate', require('./routes/authenticate'));
app.use('/v', require('./routes/views'));
app.use('/users', require('./routes/users'));
app.use('/search', require('./routes/search'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/subscriptions', require('./routes/subscriptions'));
app.use('/votes', require('./routes/votes'));

db.query(sql, (err, res) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Tables created.');
    }
})

app.listen(port)
