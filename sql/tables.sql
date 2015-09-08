-- CREATE DATABASE `quizlet` CHARACTER SET utf8 COLLATE utf8_general_ci;
-- GRANT ALL ON `quizlet`.* TO `admin`@localhost IDENTIFIED BY 'sumome';

USE `quizlet`;

CREATE TABLE IF NOT EXISTS polls(
    id INT NOT NULL AUTO_INCREMENT,
    question TEXT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS poll_answers(
    id INT NOT NULL AUTO_INCREMENT,
    poll_id INT NOT NULL,
    answer TEXT NOT NULL,
    votes INT NOT NULL DEFAULT 0,
    PRIMARY KEY(id)
);

-- Store JSON array of seen poll ids for each unique IP/client
CREATE TABLE IF NOT EXISTS poll_trackings(
    id INT NOT NULL AUTO_INCREMENT,
    client TEXT NOT NULL,
    seen TEXT DEFAULT '[]',
    PRIMARY KEY(id)
);

-- Test Data
INSERT INTO `quizlet`.`polls` (id, question) VALUES(1, 'What is your favorite color?');
INSERT INTO `quizlet`.`polls` (id, question) VALUES(2, 'What is your quest?');

INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(1, 1, 'Blue');
INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(2, 1, 'Red');
INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(3, 1, 'Green');
INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(4, 1, 'I don\'t know!');
INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(5, 1, 'Blue');

INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(6, 2, 'To find the Holy Grail');
INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(7, 2, 'Discover the Meaning of Life');
INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(8, 2, 'Rescue those in Peril');
INSERT INTO `quizlet`.`poll_answers` (id, poll_id, answer) VALUES(9, 2, 'Attend the Flying Circus');

