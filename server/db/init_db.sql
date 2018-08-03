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
    description VARCHAR(500) NOT NULL,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tokens TSVECTOR
);

CREATE TABLE IF NOT EXISTS posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL
        CHECK(char_length(title) >= 1),
    content VARCHAR(40000) NOT NULL
        CHECK(char_length(content) >= 1),
    author_id INTEGER REFERENCES users(id)
        ON DELETE SET NULL,
    subtidder_id INTEGER REFERENCES subtidders(id)
        ON DELETE SET NULL,
    pub_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tokens TSVECTOR
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

INSERT INTO subtidders (name, description) VALUES
    ('nba', 'Discuss everything NBA related here. Game threads, trades, offseason news, and memes!'),
    ('AskTidder', 'A place to ask insightful questions.'),
    ('CSCareerQuestions', 'We encourage good questions breeding discussion about careers in computer science and software engineering.'),
    ('programming', 'Discuss anything coding-related. If you ask for help, be sure to include some code in your post.'),
    ('EngineeringStudents', 'A common place for all engineering students to ask questions and give advice.');

INSERT INTO posts (title, content, author_id, subtidder_id) VALUES
    ('Test', 'This is a test.', 4, 2),
    ('Hello world', 'Postgres is really cool', 3, 4),
    ('LeBron James has agreed to a $154M/4-year deal with the Los Angeles Lakers.', 'Lonzo finally gets some help!', 1, 1),
    ('Fake post title', 'Fake post content', 5, 2),
    ('Why does user 2 never post anything?', 'They''re just a lurker.', 5, 5),
    ('Some random stuff', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. In pariatur harum dolorem ipsa! Officia nostrum possimus provident quasi animi, cum quos minima, ipsum, amet facilis obcaecati. Laboriosam accusantium nemo ea.', 1, 3),
    ('Some other random stuff', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde libero nulla tempore suscipit maxime, earum, alias laboriosam optio natus soluta laborum, dolor quasi cum repudiandae dolore corporis laudantium odio perspiciatis.', 1, 3),
    ('Test adding post', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur eos excepturi, soluta esse magni numquam obcaecati totam! Modi possimus consectetur aperiam? Reiciendis quasi voluptate ad distinctio quis corrupti repellendus qui?', 3, 5),
    ('Test deleting post', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate nesciunt praesentium molestiae ad ipsa quaerat facilis, voluptatum similique laborum animi sint libero voluptate, accusantium quia sapiente reiciendis quam. Voluptates, dolores?', 4, 2),
    ('Test editing post', 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas molestiae fugiat maxime est officia. Reprehenderit excepturi id est, eius maxime aliquid minus modi alias et eaque quod ducimus dignissimos possimus.', 2, 1),
    ('Filler title', 'Filler content', 3, 3),
    ('Paginated', 'results', 1, 2);

INSERT INTO subscriptions (user_id, subtidder_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 2), (2, 5),
    (3, 4), (3, 5),
    (4, 2), (4, 3), (4, 4), (4, 5),
    (5, 1), (5, 2), (5, 5);

UPDATE subtidders s1
    SET tokens = to_tsvector(CONCAT(s1.name, ' ', s1.description))
    FROM subtidders s2;

UPDATE posts p1
    SET tokens = to_tsvector(CONCAT(p1.title, ' ', p1.content))
    FROM posts p2;