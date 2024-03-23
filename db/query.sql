SELECT * FROM employee INNER JOIN role ON employee.role = role.id INNER JOIN department ON role.department = department.id;

SELECT * FROM employee RIGHT JOIN role ON employee.role_id = role.id RIGHT JOIN department ON role.department_id = department.id;

SELECT a.id, a.first_name, a.last_name, CONCAT (b.first_name, " ", b.last_name) AS "manager", role.title, role.salary, department.name AS department FROM employee AS a INNER JOIN employee AS b ON a.manager_id = b.id CROSS JOIN role ON a.role_id = role.id CROSS JOIN department ON role.department_id = department.id;

SELECT CONCAT (first_name, " ", last_name) AS "active_employees" FROM employee;

SELECT title FROM role;

UPDATE employee SET role_id =  WHERE id = ;

SELECT department.name AS department, CONCAT(first_name, " ", last_name) AS employee FROM employee CROSS JOIN role ON role_id = role.id CROSS JOIN department ON role.department_id = department.id;

SELECT CONCAT (b.first_name, " ", b.last_name) AS "manager", CONCAT(a.first_name, " ", a.last_name) AS employee FROM employee AS a INNER JOIN employee AS b ON a.manager_id = b.id ORDER BY manager;