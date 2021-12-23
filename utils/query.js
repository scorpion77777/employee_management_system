const queries = require('./queries.js')

module.exports = {
  all: function () {
    return queries.all + 'ORDER BY department.name'
  },

  by: function (column) {
    return queries.all + `WHERE ${column} = ? ORDER BY department.name`
  },

  create: function (table) {
    return `INSERT INTO ${table} SET ?`
  },

  delete: function (table) {
    return `DELETE FROM ${table} WHERE id = ?`
  },

  update: function(column) {
    return `UPDATE employee SET ${column} = ? WHERE id = ?`
  },

  deptBudget: function() {
    return queries.deptBudget
  },

  roles: function () {
    return `SELECT * FROM role WHERE department_id = ?`
  },

  employees: function () {
    return `SELECT * FROM employee WHERE role_id = ?`
  }
}
