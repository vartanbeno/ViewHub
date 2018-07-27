CREATE EXTENSION IF NOT EXISTS CITEXT;

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username CITEXT UNIQUE NOT NULL
        CHECK (char_length(username) >= 4 AND char_length(username) <= 30),
    password VARCHAR(30) NOT NULL
        CHECK (char_length(password) >= 4)
);

CREATE TABLE IF NOT EXISTS posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    content VARCHAR(40000) NOT NULL,
    author_id INTEGER REFERENCES users(id)
        ON DELETE SET NULL,
    pub_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
