const connection = require("../config/connection.js")

module.exports = {
  employees: function () {
    return new Promise((resolve, reject) => {
      connection.query(
      "SELECT CONCAT(first_name,' ',last_name) AS employee, id FROM employee;",
      (err, res) => {
        if (err) throw err
        resolve(res)
      })
    })
  },

  departments: function () {
    return new Promise((resolve, reject) => {
      connection.query(
      "SELECT name AS department, id FROM department;",
      (err, res) => {
        if (err) throw err
        resolve(res)
      })
    })
  },

  roles: function () {
    return new Promise((resolve, reject) => {
      connection.query(
      "SELECT title AS role, id FROM role;",
      (err, res) => {
        if (err) throw err
        resolve(res)
      })
    })
  }
}
