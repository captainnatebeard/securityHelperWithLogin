-- Nathan Johnson
-- 11/29/18
-- CSE154
-- This is the SQL file for setting up the users database for the login page on my
-- Pentester's notes website

-- creates a database called "Users", deleting it if it already exits and then select said
-- database for use
DROP DATABASE IF EXISTS users;
CREATE DATABASE users;
USE Users;

-- Creates a table called login, deleting it if it already exists.  This table should have three
-- columns, id, username, and hash
DROP TABLE IF EXISTS Login;
CREATE TABLE Login (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

-- Inserts 3 users into the database, root, nate, and connor, along with their passwords
-- NOTE: the root password is "root", but the other two are a secret... sorry.
INSERT INTO Login (username, hash) VALUES
    ("root", "$2y$10$ZmTtUzE54Wyh/q.CJ1wAAuiea/LKwijRBElFIHoe5OUA5w9JSlMJi"),
    ("nate", "$2y$10$6MMh2FpvRxgsSQ.QZt5RnOB5vjkTSWKhDJuhzMMuNvYqt.3JH.MfW"),
    ("connor", "$2y$10$kAvm6fSSyzy21IA2R5Ij6ep5MvgV7dodHV.y1VKswV6OTO.szNON2");
