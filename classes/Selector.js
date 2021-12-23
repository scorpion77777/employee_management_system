class Selector {
  constructor (employees, departments, roles) {
    this.employees = employees,
    this.departments = departments,
    this.roles = roles
  }

  just (...selector) {
    return selector
  }

  createEmployee (creation) {
    const roleId = this.getRoleId(creation.role)
    let managerId;
    if (this.employees.length > 0) {
      managerId = this.getManagerId(creation.manager)
    } else {
      managerId = 0
    }
    return {
      first_name: creation.first_name,
      last_name: creation.last_name,
      role_id: roleId,
      manager_id: managerId,
    };
  }

  createRole (creation) {
    const deptId = this.getDeptId(creation.department)
    return {
      title: creation.title,
      salary: creation.salary,
      department_id: deptId
    };
  }

  updateEmployeeRole (update) {
    const employeeId = this.getEmployeeId(update.employee)
    const roleId = this.getRoleId(update.role)
    return this.just(roleId, employeeId)
  }

  updateEmployeeManager (update) {
    const employeeId = this.getEmployeeId(update.employee)
    const managerId = this.getManagerId(update.manager)
    return this.just(managerId, employeeId)
  }

  deleteEmployee (deletion) {
    const employeeId = this.getEmployeeId(deletion.employee)
    return this.just(employeeId)
  }

  deleteDepartment (deletion) {
    const departmentId = this.getDeptId(deletion.department)
    return this.just(departmentId)
  }

  deleteRole (deletion) {
    const roleId = this.getRoleId(deletion.role)
    return this.just(roleId)
  }

  getRoleId (role) {
    return this.roles.find(el => el.role === role).id
  }

  getEmployeeId (employee) {
    return this.employees.find(el => el.employee === employee).id
  }

  getManagerId (employee) {
    const manager = this.employees.find(el => el.employee === employee)
    return manager ? manager.id : null
  }

  getDeptId (department) {
    return this.departments.find(el => el.department === department).id;
  }
}

module.exports = Selector
