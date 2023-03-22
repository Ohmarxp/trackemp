
INSERT INTO department (name)
VALUES ('Finance'),
('Marketing'),
('Operations Management'),
('Human Resources'),
('Information and Technology');
   
INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 160000, 1),
('Sales Manager', 70000, 2),
('Sales Associate', 65000, 3),
('HR Manager', 78000, 4),
('Computer System Manager', 85000, 5);
      

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Florinda', 'Meza', 1, 4),
('Edgar', 'Vibar', 2, 1),
('Carlos', 'Villagran', 3, 2),
('Ramon', 'Valdez', 4, 1),
('Roberto', 'Gomez', 5, 3),
('Maria', 'Nieves', 6, 4);

       