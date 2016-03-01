DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS classes_assignments CASCADE;
DROP TABLE IF EXISTS users_assignments CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255),
  password_digest TEXT,
  img_url VARCHAR(255),
  class_code VARCHAR(255),
  role VARCHAR(255)
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY UNIQUE,
  type VARCHAR(255)
);

CREATE TABLE classes (
  id SERIAL PRIMARY KEY UNIQUE,
  code VARCHAR(255),
  isactive BOOLEAN DEFAULT TRUE
);

CREATE TABLE assignments (
  id SERIAL PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  grade VARCHAR(3)
);

CREATE TABLE classes_assignments (
  class_id INTEGER REFERENCES classes (id) ON DELETE CASCADE,
  assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, assignment_id)
);

CREATE TABLE users_assignments (
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  assignment_id INTEGER REFERENCES assignments (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, assignment_id)
);
