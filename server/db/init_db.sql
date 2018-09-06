CREATE EXTENSION IF NOT EXISTS CITEXT;
CREATE EXTENSION IF NOT EXISTS PGCRYPTO;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username CITEXT UNIQUE NOT NULL
        CHECK (char_length(username) >= 4 AND char_length(username) <= 30),
    password VARCHAR(255) NOT NULL,
    join_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    biography VARCHAR(10000) DEFAULT NULL,
    image BYTEA DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS views(
    id SERIAL PRIMARY KEY,
    name CITEXT UNIQUE NOT NULL
        CONSTRAINT check_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 20)
        CONSTRAINT check_not_all CHECK (name != 'all'),
    description VARCHAR(500) NOT NULL,
    creator_id INTEGER REFERENCES users(id)
        ON DELETE SET NULL,
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
    view_id INTEGER REFERENCES views(id)
        ON DELETE SET NULL,
    pub_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_edited TIMESTAMPTZ DEFAULT NULL,
    tokens TSVECTOR
);

CREATE TABLE IF NOT EXISTS post_votes(
    post_id INTEGER REFERENCES posts(id)
        ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id)
        ON DELETE CASCADE,
    vote INTEGER NOT NULL
        CHECK(vote in (1, -1)),
    vote_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS subscriptions(
    user_id INTEGER REFERENCES users(id)
        ON DELETE CASCADE,
    view_id INTEGER REFERENCES views(id)
        ON DELETE CASCADE,
    subscription_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, view_id)
);

CREATE TABLE IF NOT EXISTS comments(
    id SERIAL PRIMARY KEY,
    body VARCHAR(10000) NOT NULL
        CHECK(char_length(body) >= 1),
    author_id INTEGER REFERENCES users(id)
        ON DELETE SET NULL,
    post_id INTEGER REFERENCES posts(id)
        ON DELETE CASCADE,
    pub_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_edited TIMESTAMPTZ DEFAULT NULL
);

CREATE OR REPLACE FUNCTION hash_password() RETURNS TRIGGER AS
$$
BEGIN
    IF ((SELECT LENGTH(NEW.password) < 4) OR (SELECT LENGTH(NEW.password) > 30))
    THEN RAISE EXCEPTION 'The password should be 4 to 30 characters long.';
    END IF;
    NEW.password := crypt(NEW.password, gen_salt('bf', 8));
    RETURN NEW;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_view_tokens() RETURNS TRIGGER AS
$$
BEGIN
    NEW.tokens := to_tsvector('english', NEW.name || ' ' || NEW.description);
    RETURN NEW;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_post_tokens() RETURNS TRIGGER AS
$$
BEGIN
    NEW.tokens := to_tsvector('english', NEW.title || ' ' || NEW.content);
    RETURN NEW;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_edited_date() RETURNS TRIGGER AS
$$
BEGIN
    NEW.last_edited := CURRENT_TIMESTAMP;
    RETURN NEW;
END
$$
LANGUAGE plpgsql;

CREATE TRIGGER hash_password
BEFORE INSERT ON users
    FOR EACH ROW EXECUTE PROCEDURE hash_password();

CREATE TRIGGER hash_updated_password
BEFORE UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.password IS DISTINCT FROM NEW.password)
    EXECUTE PROCEDURE hash_password();

CREATE TRIGGER set_view_tokens
BEFORE INSERT OR UPDATE ON views
    FOR EACH ROW EXECUTE PROCEDURE set_view_tokens();

CREATE TRIGGER set_post_tokens
BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE PROCEDURE set_post_tokens();

CREATE TRIGGER set_post_edited_date
BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE PROCEDURE set_edited_date();

CREATE TRIGGER set_comment_edited_date
BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE PROCEDURE set_edited_date();

INSERT INTO users (first_name, last_name, email, username, password) VALUES
    ('Vartan', 'Benohanian', 'vartabeno@gmail.com', 'vartanbeno', '1234'),
    ('Hello', 'World', 'hello@world.com', 'helloworld', 'hello'),
    ('Angular', 'Node', 'angular@node.com', 'angular', 'node'),
    ('Postgres', 'Root', 'postgres@root.com', 'postgres', 'root'),
    ('Test', 'Object', 'test@object.com', 'test', 'test');

INSERT INTO views (name, description, creator_id) VALUES
    ('nba', 'Discuss everything NBA related here. Game threads, trades, offseason news, and memes!', 1),
    ('AskViewHub', 'A place to ask insightful questions.', 3),
    ('CSCareerQuestions', 'We encourage good questions breeding discussion about careers in computer science and software engineering.', 1),
    ('programming', 'Discuss anything coding-related. If you ask for help, be sure to include some code in your post.', 4),
    ('EngineeringStudents', 'A common place for all engineering students to ask questions and give advice.', 1);

INSERT INTO posts (title, content, author_id, view_id) VALUES
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

INSERT INTO subscriptions (user_id, view_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 2), (2, 5),
    (3, 4), (3, 5),
    (4, 2), (4, 3), (4, 4), (4, 5),
    (5, 1), (5, 2), (5, 5);

INSERT INTO comments (body, author_id, post_id) VALUES
    ('This is great news!', 1, 3),
    ('Fake post comment', 3, 4),
    ('This is another test.', 5, 1),
    ('Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas molestiae fugiat maxime est officia. Reprehenderit excepturi id est, eius maxime aliquid minus modi alias et eaque quod ducimus dignissimos possimus.', 4, 7),
    ('He plays the Warriors 4 times this season.', 2, 3);