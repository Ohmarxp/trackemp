DROP DATABASE  IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;
CREATE TABLE department (
    id INT NOt NULL AUTO INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    deparment INT,
    FOREIGN KEY (deparment)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INt NOT NULL AUTOINCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30)NOt NULL,
    role INT,
    FOREIGN KEY (role)
    REFERENCES role(id)
    ON DELET SET NULL

)