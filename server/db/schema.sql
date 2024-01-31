CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  date_of_birth DATE,
  show_gender BOOLEAN,
  gender_identity VARCHAR(255),
  gender_interest VARCHAR(255),
  matches TEXT,
  biography TEXT,
  tags TEXT,
  image_0 TEXT,
  image_1 TEXT,
  image_2 TEXT,
  image_3 TEXT,
  image_4 TEXT,
  password VARCHAR(255) NOT NULL,
  initialized BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS swipes (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  swiped_id INT NOT NULL,
  swiped_right BOOLEAN NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (swiped_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS matches (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (match_id) REFERENCES users(id)
);
