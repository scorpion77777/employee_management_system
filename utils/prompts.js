module.exports = {
  main: [{
      name: "main",
      type: "list",
      message: "What do you need to do?",
      choices: [
        "View All Employees",
        "View Employees by Department",
        "View Employees by Role",
        "View Employees by Manager",
        "Add a Department",
        "Remove a Department",
        "Add a Role",
        "Remove a Role",
        "Add an Employee",
        "Remove an Employee",
        "Update an Employee's Role",
        "Update an Employee's Manager",
        "View Utilized Budget by Department",
        "^C (EXIT)"
      ]
    }],

  departments: function (departments) {
      return [{
        name: "department",
        type: "list",
        message: "Select a department.",
        choices: departments
      }]
  },

  employees: function (employees) {
      return [{
        name: "employee",
        type: "list",
        message: "Select an employee.",
        choices: employees
      }]
  },

  managers: function (employees) {
      return [{
        name: "manager",
        type: "list",
        message: "Select an manager.",
        choices: employees
    }]
  },

  roles: function (roles) {
    return [{
        name: "role",
        type: "list",
        message: "Select a role.",
        choices: roles
    }]
  },

  createEmployee: [
    {
      name: "first_name",
      type: "input",
      message: "Employee's first name:"
    },
    {
      name: "last_name",
      type: "input",
      message: "Employee's last name:"
    }
  ],

  createRole: [
    {
      name: "title",
      type: "input",
      message: "Role's title:"
    },
    {
      name: "salary",
      type: "number",
      message: "Role's salary:"
    }
  ],

  createDepartment: {
    name: "name",
    type: "input",
    message: "Department name:"
  }
}
