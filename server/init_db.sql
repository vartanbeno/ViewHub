CREATE EXTENSION IF NOT EXISTS CITEXT;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username CITEXT UNIQUE NOT NULL
        CHECK (char_length(username) >= 4 AND char_length(username) <= 30),
    password VARCHAR(30) NOT NULL
        CHECK (char_length(password) >= 4),
    join_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subtidders(
    id SERIAL PRIMARY KEY,
    name CITEXT UNIQUE NOT NULL
        CHECK (char_length(name) >= 3 AND char_length(name) <= 20),
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    content VARCHAR(40000) NOT NULL,
    author_id INTEGER REFERENCES users(id)
        ON DELETE SET NULL,
    subtidder_id INTEGER REFERENCES subtidders(id)
        ON DELETE SET NULL,
    pub_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions(
    user_id INTEGER REFERENCES users(id)
        ON DELETE CASCADE,
    subtidder_id INTEGER REFERENCES subtidders(id)
        ON DELETE CASCADE,
    PRIMARY KEY (user_id, subtidder_id)
);

INSERT INTO users (first_name, last_name, email, username, password) VALUES
    ('Vartan', 'Benohanian', 'vartabeno@gmail.com', 'vartanbeno', '1234'),
    ('Hello', 'World', 'hello@world.com', 'helloworld', 'hello'),
    ('Angular', 'Node', 'angular@node.com', 'angular', 'node'),
    ('Postgres', 'Root', 'postgres@root.com', 'postgres', 'root'),
    ('Test', 'Object', 'test@object.com', 'test', 'test');

INSERT INTO subtidders (name) VALUES
    ('nba'), ('AskTidder'), ('CSCareerQuestions'), ('programming'), ('EngineeringStudents');

INSERT INTO posts (title, content, author_id, subtidder_id) VALUES
    ('Test', 'This is a test.', 4, 2),
    ('Hello world', 'Postgres is really cool', 3, 4),
    ('LeBron James has agreed to a $154M/4-year deal with the Los Angeles Lakers.', 'Lonzo finally gets some help!', 1, 1),
    ('Fake post title', 'Fake post content', 5, 2),
    ('Why does user 2 never post anything?', 'They''re just a lurker.', 5, 5);

INSERT INTO subscriptions (user_id, subtidder_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 2), (2, 5),
    (3, 4), (3, 5),
    (4, 2), (4, 3), (4, 4), (4, 5),
    (5, 1), (5, 2), (5, 5);
