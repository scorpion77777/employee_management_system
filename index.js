const inquirer = require("inquirer")
const figlet = require("figlet")
const connection = require("./config/connection")
const now = require("./utils/querier.js")
const get = require('./utils/getters.js')
const query = require("./utils/query.js")
const check = require('./utils/checker.js')
const error = require('./utils/error.js')
const Prompt = require("./classes/Prompt")
const selector = require('./classes/selector')
const $ = require('./utils/helpers.js')
const chalk = require('chalk')
let employees, departments, roles

connection.connect((err) => {
  figlet.text('EMS : )', {
    font: 'Ghost',
    width: 80
  }, (err, data) => {
      if (err) {
          console.log('Something went wrong...')
          return
      }
      console.log(data)
      check.tables().then(initApp)
  })
})

async function openMenu() {
  const show = new Prompt(
    employees.map(row => row.employee),
    departments.map(row => row.department),
    roles.map(row => row.role))
  const select = new selector(employees, departments, roles)
  const { main } = await inquirer.prompt(show.main())
  let creation, update, deletion, log
  switch (main) {
    case "View All Employees":
      if (employees.length < 1) {
        error.message('You don\'t have any employees!', 'yellow', openMenu)
      } else {
        now.run(query.all()).then((val) => openMenu())
      }
      return
    case "View Employees by Department":
      if (departments.length < 1) {
        error.message('You don\'t have any departments!', 'red', openMenu)
        return
      }
      const { department } = await inquirer.prompt(show.readDepartments())
      now.run(query.by('department.name'), select.just(department)).then((val) => openMenu())
      return
    case "View Employees by Role":
      if (roles.length < 1) {
        error.message('You don\'t have any roles!', 'red', openMenu)
        return
      }
      const { role } = await inquirer.prompt(show.readRoles())
      now.run(query.by('role.title'), select.just(role)).then((val) => openMenu())
      return
    case "View Employees by Manager":
      if (employees.length < 1) {
        error.message('You don\'t have any employees!', 'red', openMenu)
        return
      }
      const { manager } = await inquirer.prompt(show.readManagers())
      now.run(query.by("CONCAT(m.first_name,' ',m.last_name)"), select.just(manager)).then((val) => openMenu())
      return
    case "Add an Employee":
    if (roles.length < 1) {
      error.message('You don\'t have any roles yet! Create some before you create an employee!', 'red', openMenu)
      return
    }
      creation = await inquirer.prompt(show.createEmployee())
      log = `Sucessfully added ${creation.first_name} ${creation.last_name}!`
      now.run(query.create('employee'), select.createEmployee(creation), log, false).then((val) => initApp())
      return
    case "Add a Role":
      if (departments.length < 1) {
        error.message('You don\'t have any departments!', 'red', openMenu)
        return
      }
      creation = await inquirer.prompt(show.createRole())
      log = `Added new role: ${creation.title}!`
      now.run(query.create('role'), select.createRole(creation), log, false).then((val) => initApp())
      return
    case "Add a Department":
      creation = await inquirer.prompt(show.createDepartment())
      log = `Added new department: ${creation.name}!`
      now.run(query.create('department'), creation, log, false).then((val) => initApp())
      return
    case "Remove an Employee":
      if (employees.length < 1) {
        error.message('You don\'t have any employees!', 'red', openMenu)
        return
      }
      deletion = await inquirer.prompt(show.readEmployees())
      log = `Removed ${deletion.employee}!`
      now.run(query.delete('employee'), select.deleteEmployee(deletion), log, false).then((val) => initApp())
      return
    case "Remove a Department":
      if (departments.length < 1) {
        error.message('You don\'t have any departments!', 'red', openMenu)
        return
      }
      deletion = await inquirer.prompt(show.readDepartments())
      proceed = await confirm(show, 'Are you sure, employees and roles in this department will be lost!');
      if (!proceed) return openMenu();
      console.log(chalk.blue(`Finding all roles within ${deletion.department}...`))
      let cascadeRoles = await now.run(query.roles('department.name'), select.deleteDepartment(deletion), null, false)
      await $.asyncForEach(cascadeRoles, async function (role) {
        let cascadeEmployees = await now.run(query.employees('role.title'), select.deleteRole({role: role.title}), null, false)
        await $.asyncForEach(cascadeEmployees, async function (employee) {
          console.log(chalk.blue(`Finding all employees within ${role.title}...`))
          let cascadeEmployeeLog = `Removed ${employee.first_name} ${employee.last_name}`
          await now.run(query.delete('employee'),
          select.deleteEmployee({employee: employee.first_name + ' ' + employee.last_name}),
          cascadeEmployeeLog, false)
        })
        let cascadeLog = `Removed ${role.title}!`
        await now.run(query.delete('role'), select.deleteRole({role: role.title}), cascadeLog, false)
      })
      log = `Removed ${deletion.department}!`
      now.run(query.delete('department'), select.deleteDepartment(deletion), log, false).then((val) => initApp())
      return
    case "Remove a Role":
      if (roles.length < 1) {
        error.message('You don\'t have any roles!', 'red', openMenu)
        return
      }
      deletion = await inquirer.prompt(show.readRoles())
      proceed = await confirm(show, 'Are you sure, employees with this role will be lost!');
      if (!proceed) return openMenu();
      console.log(chalk.blue(`Finding all employees within ${deletion.role}...`))
      let cascadeEmployees = await now.run(query.employees('role.title'), select.deleteRole(deletion), null, false)
      await $.asyncForEach(cascadeEmployees, async function (employee) {
        let cascadeEmployeeLog = `Removed ${employee.first_name} ${employee.last_name}`
        await now.run(query.delete('employee'),
        select.deleteEmployee({employee: employee.first_name + ' ' + employee.last_name}),
        cascadeEmployeeLog, false)
      })
      log = `Removed ${deletion.role}!`
      now.run(query.delete('role'), select.deleteRole(deletion), log).then((val) => initApp())
      return
    case "Update an Employee's Role":
      if (employees.length < 1) {
        error.message('You don\'t have any employees!', 'red', openMenu)
        return
      }
      update = await inquirer.prompt(show.updateRole())
      log = `Updated ${update.employee} with role ${update.role}!`
      now.run(query.update("role_id"), select.updateEmployeeRole(update), log).then((val) => initApp())
      return
    case "Update an Employee's Manager":
      if (employees.length < 1) {
        error.message('You don\'t have any employees!', 'red', openMenu)
        return
      }
      update = await inquirer.prompt(show.updateManager())
      log = `Updated ${update.employee} with manager ${update.manager}!`
      now.run(query.update("manager_id"), select.updateEmployeeManager(update), log).then((val) => initApp())
      return
    case "View Utilized Budget by Department":
      if (departments.length < 1) {
        error.message('You don\'t have any departments!', 'red', openMenu)
        return
      }
      const { department: utilDepartment } = await inquirer.prompt(show.readDepartments());
      now.run(query.deptBudget(), select.just(utilDepartment)).then((val) => openMenu())
      return
    default:
    connection.end()
    return
  }
}

function confirm(show, message) {
  return inquirer.prompt(show.confirm(message)).then((res) => res.proceed);
};

async function initApp() {
  employees = await get.employees()
  departments = await get.departments()
  roles = await get.roles()
  openMenu()
}
