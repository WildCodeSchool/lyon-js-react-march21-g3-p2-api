/* CREATE DATABASE Review_API;
USE Review_API;
DROP TABLE IF EXISTS Reviews;
CREATE TABLE Reviews (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    book_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
INSERT INTO Reviews (book_id, user_name, message) VALUES ('aTguAgAAQBAJ', 'Sasuke19', 'Naruto is a masterpiece, not gonna lie !');
*/
