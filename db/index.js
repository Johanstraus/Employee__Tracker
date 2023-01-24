const connection = require("./connection");

class database {
    constructor(connection) {
        this.connection = connection;
    }

    NewDepartment(department) {
        return this.connection.promise().query("INSERT INTO department SET ?", department);
    }

    deleteDepartment(departmentId) {
        return this.connection.promise().query(
            "DELETE FROM department WHERE id = ?",
            departmentId
        );
    }

    searchDepartments() {
        return this.connection.promise().query(
            "SELECT department.id, department.name FROM department;"
        );
    }

    viewDepartmentBudgets() {
        return this.connection.promise().query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        );
    }

    newRole(role) {
        return this.connection.promise().query("INSERT INTO role SET ?", role);
    }

    deleteRole(roleId) {
        return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
    }

    updateRole(employeeId, roleId) {
        return this.connection.promise().query(
            "UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]
        );
    }

    searchRoles() {
        return this.connection.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }

    searchManagers(employeeId) {
        return this.connection.promise().query(
            "SELECT id, first_name, last_name FROM employee WHERE id != ?", employeeId
        );
    }

    updateManager(employeeId, managerId) {
        return this.connection.promise().query(
            "UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]
        );
    }

    newEmployee(employee){
        return this.connection.promise().query("INSERT INTO employee SET ?", employee);
    }

    deleteEmployee(employeeId){
        return this.connection.promise().query(
            "DELETE FROM employee WHERE id = ?", employeeId
        );
    }

    searchEmployees() {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        );
    }

    searchEmployeesByDepartment(departmentId) {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
            departmentId
        );
    }

    searchEmployeesByManager(managerId) {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
            managerId
        );
    }
}

module.exports = new database(connection);