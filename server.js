const inquirer = require('inquirer');
const mysql = require('mysql2');

const questions = [
  {
  type: 'list',
  message: 'What would you like to do?',
  name: 'taskOptions',
  choices: ['View all departments', 
              'View all roles', 
              'View all employees',
              'View all employees by manager',
              'View all employees by department', 
              'Add a department', 
              'Add a role',
              'Add an employee',
              'Update an employee role',
              'Update an employee manager'
          ]
  }
];

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Spring2024',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);


function init() {
  inquirer.prompt(questions).then(answers => {
    console.info('Answers:', answers);
    let userChoice = answers.taskOptions;
    if (userChoice === 'View all departments'){
      viewAllDepartments()
    } else if(userChoice === 'View all roles'){
      viewAllRoles()
    }else if (userChoice === 'View all employees') {
      viewAllEmployees()
    }else if (userChoice === 'View all employees by manager') {
      viewAllEmployeesByManagers()
    } else if (userChoice === 'View all employees by department'){
      viewAllEmployeesByDepartment()
    } else if(userChoice === 'Add a department'){
      addDepartment()
    } else if(userChoice === 'Add a role'){
      addRole()
    } else if(userChoice === 'Add an employee'){
      addEmployee()
    }else if(userChoice === 'Update an employee role'){
      updateEmployee()
    } else if(userChoice === 'Update an employee manager'){
      updateEmployeeManager()
    }
  });
}

function viewAllDepartments(){
  const sql = `SELECT * FROM department;`
  
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
  });
}

function viewAllRoles(){
  const sql = `SELECT * FROM role;`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
  });
}

function viewAllEmployees(){
  const sql = `SELECT a.id, a.first_name, a.last_name, CONCAT (b.first_name, " ", b.last_name) AS "manager", role.title, role.salary, department.name AS department FROM employee AS a INNER JOIN employee AS b ON a.manager_id = b.id CROSS JOIN role ON a.role_id = role.id CROSS JOIN department ON role.department_id = department.id;`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
  });
}

function viewAllEmployeesByManagers(){
  const sql = `SELECT CONCAT (b.first_name, " ", b.last_name) AS "manager", CONCAT(a.first_name, " ", a.last_name) AS employee FROM employee AS a INNER JOIN employee AS b ON a.manager_id = b.id ORDER BY manager;`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
  });
}

function viewAllEmployeesByDepartment(){
  const sql = `SELECT department.name AS department, CONCAT(first_name, " ", last_name) AS employee FROM employee CROSS JOIN role ON role_id = role.id CROSS JOIN department ON role.department_id = department.id;`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
  });
}

function addDepartment(){
  const departmentQuestions = [{
  type: 'input',
  message: 'What is the name of the department?',
  name: 'departmentName',
  }]

  inquirer.prompt(departmentQuestions).then(answers => {
    const sql = `INSERT INTO department (name) VALUES ('${answers.departmentName}');`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
    });
  })
}

async function addRole(){
  const roleQuestions = [{
  type: 'input',
  message: 'What is the name of the new role?',
  name: 'roleName',
  },
  {
    type: 'input',
    message: 'What is the total salary of the new role?',
    name: 'roleSalary',
  },
  {
    type: 'list',
    message: 'Which department does the new role belong to?',
    name: 'roleDepartmentName',
    choices: await departmentList()
  }
]

async function departmentList(){
  const query =  'SELECT id AS value, department.name AS name FROM department;'

  let departmentList = await db.promise().query(query)
    return departmentList[0];
}

  inquirer.prompt(roleQuestions).then(answers => {
    const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${answers.roleName}', ${answers.roleSalary}, ${answers.roleDepartmentName});`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
    });
  })
}

async function addEmployee(){
  const employeeQuestions = [
    {
  type: 'input',
  message: 'What is the first name of the new employee?',
  name: 'firstName',
  },
  {
    type: 'input',
    message: 'What is the last name of the new employee?',
    name: 'lastName',
  },
  {
    type: 'list',
    message: 'What is the job title of the new employee?',
    name: 'jobTitle',
    choices:  await jobTitleList()
  },
  {
  type: 'list',
  message: 'Who is the manager of the new employee?',
  name: 'managerName',
  choices: await managerList()
  }
]
  async function jobTitleList(){
    const query =  'SELECT id AS value, title AS name FROM role;'

    let jobTitleList = await db.promise().query(query)
      return jobTitleList[0];
  }

  async function managerList(){
    const query =  'SELECT id AS value, CONCAT (first_name, " ", last_name) AS name FROM employee'

    let managerList = await db.promise().query(query)
      return managerList[0];
  }

  inquirer.prompt(employeeQuestions).then(answers => {
    
    console.log(answers)

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', ${answers.jobTitle}, ${answers.managerName});`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
    });
  })
}

async function updateEmployee(){
  const updateQuestions = [
  {
  type: 'list',
  message: 'Which employee`s role would you like to update?',
  name: 'employeeName',
  choices: await employeeList()
  },
  {
    type: 'list',
    message: 'What is the employee`s new role?',
    name: 'jobTitle',
    choices:  await jobTitleList()
  }
]

  async function employeeList(){
    const query =  'SELECT id AS value, CONCAT (first_name, " ", last_name) AS name FROM employee'

    let employeeList = await db.promise().query(query)
      return employeeList[0];
  }

  async function jobTitleList(){
    const query =  'SELECT id AS value, title AS name FROM role;'

    let jobTitleList = await db.promise().query(query)
      return jobTitleList[0];
  }
  inquirer.prompt(updateQuestions).then(answers => {
    
    console.log(answers)

    const sql = `UPDATE employee SET role_id = ${answers.jobTitle}  WHERE id = ${answers.employeeName};`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
    });
  })
}

async function updateEmployeeManager(){
  const updateManagerQuestions = [
  {
  type: 'list',
  message: 'Which employee`s manager would you like to update?',
  name: 'employeeName',
  choices: await employeeList()
  },
  {
    type: 'list',
    message: 'Who is the employee`s new manager?',
    name: 'managerName',
    choices: await employeeList()
  }
]

  async function employeeList(){
    const query =  'SELECT id AS value, CONCAT (first_name, " ", last_name) AS name FROM employee'

    let employeeList = await db.promise().query(query)
      return employeeList[0];
  }

  inquirer.prompt(updateManagerQuestions).then(answers => {
    
    console.log(answers)

    const sql = `UPDATE employee SET manager_id = ${answers.managerName}  WHERE id = ${answers.employeeName};`

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return
    }
    console.table(rows)
    init()
    });
  })
}

init();
