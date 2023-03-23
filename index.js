const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require("console.table");


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',       
        password: 'password',
        database: 'employee_db'
    },   
);

// Connecting to database
db.connect((err) => {
    if (err) throw err;
  });
  
  // Prompt User for Choices
  function initPrompt() {
    inquirer.prompt({
    name: "choice",
    type: "list",
    message: "What would you like to do?",
    choices: [{ name: "View all departments", value: "View_Departments" },{ name: "View all roles", value: "View_Roles" },{ name: "View all employees", value: "View_Employees" },
                { name: "Add a new department", value: "Add_Department" },{ name: "Add a new role", value: "Add_Role" },{ name: "Add a new employee", value: "Add_Employee" },
                { name: "Update employee's role", value: "Update_Role" },{ name: "Exit", value: "Exit" },],
       })
      .then((answers) => {
        if(answers.choice === "View_Departments") {
            return departments();
        } if(answers.choice === "View_Roles") {
            return roles();
        } if(answers.choice === "View_Employees") {
            return employees();
        } if(answers.choice === "Add_Department") {
            return addDepa();
        } if(answers.choice === "Add_Role") {
            return addRole();
        } if(answers.choice === "Add_Employee") {
            return addEmployee();
        } if(answers.choice === "Update_Role") {
            return updateRole();
        } if(answers.choice === "Exit") {
            return Connection.end();
        };
    });
  }
  
  // Access to departments
  departments = () => {
    console.log("Showing all departments...\n");
    const query = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(query, (err, rows) => {
      if (err) throw err;
      //Shows result in tables
      console.table(rows);
      initPrompt();
    });
  };
  
  // Function to access roles
  roles = () => {
    console.log("Showing all roles...\n");
    const query = `SELECT role.id, role.title, department.name AS department 
    FROM role LEFT JOIN department ON role.department_id = department.id`;
  
    db.query(query, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      initPrompt();
    });
  };
  
  // Function to access employees
    employees = () => {
    console.log("Showing all employees...\n");
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
    department.name AS department,role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  
    db.query(query, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      initPrompt();
    });
  };
  
  // function to add department
  addDepa = () => {
    // Prompt user for name of department
    inquirer.prompt([{
    type: "input",
    name: "addDept",
    message: "What department would you like to add?",
    },
    ])
      // To add a department to table
    .then((answer) => {
    const query = `INSERT INTO department (name) VALUES (?)`;
    db.query(query, answer.addDept, (err, result) => {
      if (err) throw err;
       console.log("Added " + answer.addDept + " to departments!");  
       departments();
       });
    });
  };
  
  // function to add a role
  addRole = () => {
    inquirer.prompt([{
     type: "input",
     name: "role",
     message: "What new role would you like to add?",
   },
   {
    type: "input",
    name: "salary",
    message: "What is this role's salary?",
   },
   ])
    .then((answer) => {
    const params = [answer.role, answer.salary];
  
   // Select dept from department table
    const roleSql = `SELECT name, id FROM department`;
  
     db.query(roleSql, (err, data) => {
          if (err) throw err;
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
     inquirer.prompt([{
       type: "list",
       name: "dept",
       message: "What department is this role in?",
       choices: dept,
       },
     ])
      .then((deptChoice) => {
       const dept = deptChoice.dept;
        params.push(dept);
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`; 
      db.query(sql, params, (err, result) => {
         if (err) throw err;
         console.log("Added" + answer.role + " to roles!"); 
          roles();
         });
        });
      });
    });
  };
  
  // function to add a new employee
  addEmployee = () => {
    inquirer.prompt([
     {
       type: "input",
       name: "fistName",
       message: "What is the employee's first name?",
     },
     {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
     },
    ])
     .then((answer) => {
       const params = [answer.fistName, answer.lastName];
  
    // To select a role
     const roleSql = `SELECT role.id, role.title FROM role`;
  
      db.query(roleSql, (err, data) => {
        if (err) throw err;
  
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
         {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: roles,
         },
        ])
         .then((roleChoice) => {
           const role = roleChoice.role;
           params.push(role);
  
          const managerSql = `SELECT * FROM employee`;
  
        db.query(managerSql, (err, data) => {
             if (err) throw err;
             const managers = data.map(({ id, first_name, last_name }) => ({
             name: first_name + " " + last_name,
             value: id,
            }));
  
            inquirer.prompt([
            {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: managers,
            },
            ])
            .then((managerChoice) => {
             const manager = managerChoice.manager;
             params.push(manager);
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  
            db.query(sql, params, (err, result) => {
              if (err) throw err;
               console.log("Employee has been successfully added to the database!");
               employees();
              });
            });
          });
        });
      });
    });
  };
  
  // To update an employee's role
  updateRole = () => {
    const employeeSql = `SELECT * FROM employee`; 
    db.query(employeeSql, (err, data) => {
      if (err) throw err;
  
    const employees = data.map(({ id, first_name, last_name }) => ({
    name: first_name + " " + last_name,
    value: id,
     }));
  
      inquirer.prompt([
        {
        type: "list",
        name: "name",
        message: "Which employee would you like to update?",
        choices: employees,
       },
        ])
        .then((empChoice) => {
          const employee = empChoice.name;
          const params = [];
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
        db.promise().query(roleSql, (err, data) => {
         if (err) throw err;
            const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
            }));
  
        inquirer.prompt([
            {
            type: "list",
            name: "role",
            message: "What is the employee's new role?",
            choices: roles,
            },
            ])
        .then((roleChoice) => {
           const role = roleChoice.role;
            params.push(role);
            let employee = params[0];
            params[0] = role;
            params[1] = employee;   

           const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        db.query(sql, params, (err, result) => {
           if (err) throw err;
              console.log("Employee has been updated!"); 
              employees();
           });
         });
       });
     });
   });
 };
  
  initPrompt();
