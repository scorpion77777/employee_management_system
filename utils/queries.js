require('dotenv').config();

module.exports = {
  all: "SELECT e.id, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, CONCAT(m.first_name,' ',m.last_name) AS Manager, role.salary AS Salary " +
        "FROM employee e " +
        "INNER JOIN role ON e.role_id = role.id " +
        "INNER JOIN department ON role.department_id = department.id " +
        "LEFT JOIN employee m ON e.manager_id = m.id ",
  deptBudget: "SELECT department.name, SUM(role.salary) AS utilizedBudget " +
        "FROM employee " +
        "INNER JOIN role ON employee.role_id = role.id " +
        "INNER JOIN department ON role.department_id = department.id " +
        "WHERE department.name = ? ",
  createdepartmentTable: `
    CREATE TABLE department (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(30) NOT NULL UNIQUE,
        PRIMARY KEY (id)
    );`,
  createroleTable: `
  CREATE TABLE role (
      id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(30) NOT NULL UNIQUE,
      salary DECIMAL(10,2) NOT NULL,
      department_id INT NOT NULL,
      PRIMARY KEY (id)
  );`,
  createemployeeTable: `
  CREATE TABLE employee (
      id INT NOT NULL AUTO_INCREMENT,
      first_name VARCHAR(30) NOT NULL,
      last_name VARCHAR(30) NOT NULL,
      role_id INT NOT NULL,
      manager_id INT,
      PRIMARY KEY (id)
  );`,
  checkTable: function (table) {
    return `SELECT *
      FROM information_schema.tables
      WHERE table_schema = '${process.env.DB_NAME}'
      AND table_name = '${table}'`
  }
}
