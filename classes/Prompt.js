const prompts = require('../utils/prompts.js')

class Prompt {
  constructor (employees, departments, roles) {
    this.employees = employees,
    this.departments = departments,
    this.roles = roles
  }

  main() {
    return prompts.main
  }

  confirm (message) {
    return [{
      name: "proceed",
      type: "confirm",
      message
    }]
  }

  readDepartments() {
    return prompts.departments(this.departments)
  }

  readEmployees() {
    return prompts.employees(this.employees)
  }

  readRoles() {
    return prompts.roles(this.roles)
  }

  readManagers() {
    return prompts.managers(this.employees)
  }

  createEmployee() {
    let createEmployeePrompt = prompts.createEmployee
    createEmployeePrompt.push(this.readRoles()[0])
    if (this.employees.length > 0) {
      createEmployeePrompt.push(this.readManagers()[0])
    }
    return createEmployeePrompt
  }

  createRole() {
    let createRolePrompt = prompts.createRole
    createRolePrompt.push(this.readDepartments()[0])
    return createRolePrompt
  }

  createDepartment() {
    return prompts.createDepartment
  }

  updateRole() {
    return [
      this.readEmployees()[0],
      this.readRoles()[0]
    ]
  }

  updateManager() {
    return [
      this.readEmployees()[0],
      this.readManagers()[0]
    ]
  }
}

module.exports = Prompt
