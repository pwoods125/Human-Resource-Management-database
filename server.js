const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql2');
const path = require('path');


const PORT = process.env.PORT || 3001;
const questions = [
  {
  type: 'list',
  message: 'What would you like to do?',
  name: 'taskOptions',
  choices: ['View all departments', 
              'View all roles', 
              'View all employees', 
              'Add a department', 
              'Add a role',
              'Add an employee',
              'Update and employee role'
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
    } else if(userChoice === 'Add a department'){
        addDepartment()
    } else if(userChoice === 'Add a role'){
      addRole()
    } else if(userChoice === 'Add an employee'){
      addEmployee()
    }else if(userChoice === 'Update an employee role'){

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
  const sql = `SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;`

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

function addRole(){
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
    type: 'input',
    message: 'What is the name of the department for the new role?',
    name: 'roleDepartmentName',
  }
]

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

function addEmployee(){
  const employeeQuestions = [{
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
    choices: ['Primary Care Practice Manager', 'Nurse Practioner', 'Medical Assistant', 'Receptionist', 'CEO', 'Director of Finance', 'Human Resource Representative', 'Director of Data Analytics', 'Director of Nursing', 'Dental Practice Manager', 'Dentist', 'Dental Assistant', 'Infrastructure Manager', 'Health Informatics Specialist', 'IT Coordinator', 'Help desk Associate', 'Call Center Manager', 'Lead Call Center Agent', 'Call Center Agent']
  },
  {
  type: 'list',
  message: 'Who is the manager of the new employee?',
  name: 'managerName',
  choices: ['None', 'Victoria Litas', 'Prince Charming', 'Johnathan Cena', 'Sable Lesnero', 'Sean Venis', 'Mohamad Hassan', 'Steven Austin', 'Dwayne Rock']
  }
]

  inquirer.prompt(employeeQuestions).then(answers => {
    
    let jobTitle = answers.jobTitle;
    if (jobTitle === 'Primary Care Practice Manager'){
        jobTitle = 1
    } else if (jobTitle === 'Nurse Practioner'){
        jobTitle = 2
    } else if (jobTitle === 'Medical Assistant'){
        jobTitle = 3
    } else if (jobTitle === 'Receptionist'){
        jobTitle = 4
    } else if (jobTitle === 'CEO'){
      jobTitle = 5
    } else if (jobTitle === 'Director of Finance'){
      jobTitle = 6
    } else if (jobTitle === 'Human Resource Representative'){
      jobTitle = 7
    } else if (jobTitle === 'Director of Data Analytics'){
      jobTitle = 8
    } else if (jobTitle === 'Director of Nursing'){
      jobTitle = 9
    } else if (jobTitle === 'Dental Practice Manager'){
      jobTitle = 10
    } else if (jobTitle === 'Dentist'){
      jobTitle = 11
    } else if (jobTitle === 'Dental Assistant'){
      jobTitle = 12
    } else if (jobTitle === 'Receptionist'){
      jobTitle = 13
    } else if (jobTitle === 'Infrastucture Manager'){
      jobTitle = 14
    } else if (jobTitle === 'Health Informatics Specialist'){
      jobTitle = 15
    } else if (jobTitle === 'IT Coordinator'){
      jobTitle = 16
    } else if (jobTitle === 'Help desk Associate'){
      jobTitle = 17
    } else if (jobTitle === 'Call Center Manager'){
      jobTitle = 18
    } else if (jobTitle === 'Lead Call Center Agent'){
      jobTitle = 19
    } else if (jobTitle === 'Call Center Agent'){
      jobTitle = 20
    }

    let manager = answers.managerName;
    if (manager === 'None'){
        manager = 0
    } else if (manager === 'Victoria Litas'){
        manager = 1
    } else if (manager === 'Prince Charming'){
        manager = 5
    } else if (manager === 'Johnathan Cena'){
        manager = 9
    } else if (manager === 'Sable Lesnero'){
        manager = 11
    } else if (manager === 'Sean Venis'){
        manager = 14
    } else if (manager === 'Mohamad Hassan'){
        manager = 16
    } else if (manager === 'Steven Austin'){
        manager = 18
    } else if (manager === 'Dwayne Rock'){
        manager = 19
    }

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', ${jobTitle}, ${manager});`

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
