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
      
    } else if(userChoice === 'Add an employee'){
      
    }else if(userChoice === 'Update and employee role'){

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
  const sql = `SELECT * FROM employee;`

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
  name: 'departmenName',
  }]

  inquirer.prompt(departmentQuestions).then(answers => {
    const sql = `INSERT INTO department(name) VALUES();`

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
