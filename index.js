const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

init();

function init() {
    const logoContent = logo({ name: "Employee Manager"}).render();
    console.log(logoContent);
    MainMenu();
}

function MainMenu() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "Please select an option",
            choices: [
                {
                    name: "View ALL Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View ALL Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View ALL Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View ALL Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View ALL Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "View Total Utilized Budget By Department",
                    value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ]).then(res => {
        let choice = res.choice;

        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewAllEmployees();
            break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                departmentEmployees();
            break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
            break;
            case "ADD_EMPLOYEE":
                addEmployee();
            break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
            break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
            break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
            break;
            case "VIEW_ROLES":
                viewRoles();
            break;
            case "ADD_ROLE":
                addRole();
            break;
            case "REMOVE_ROLE":
                removeRole();
            break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
            break;
            case "ADD_DEPARTMENT":
                addDepartment();
            break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
            break;
            case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
                viewUtilizedBudgetByDepartment();
            break;
            default:
                quit();
        }
    })

    function viewAllEmployees() {
        db.searchEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => MainMenu());
    }

    function departmentEmployees(){
        db.searchDepartments()
        .then(([rows]) => {
            let departments = rows;
            const chooseDepartment = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Please select a department.",
                    choices: chooseDepartment
                }
            ])
            .then(res => db.searchEmployeesByDepartment(res.departmentId))
            .then(([rows]) => {
                let employees = rows;
                console.log("\n");
                console.table(employees);
            })
            .then(() => MainMenu())
        });
    }

    function viewEmployeesByManager() {
        db.searchEmployees()
        .then(([rows]) => {
            let managers = rows;
            const chooseManager = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "managerId",
                    message: "Which employee do you want to find based on the manager?",
                    choices: chooseManager
                }
            ])
            .then(res => db.searchEmployeesByManager(res.managerId))
            .then(([rows]) => {
                let employees = rows;
                console.log("\n");
                if (employees.length === 0) {
                    console.log("No direct reports");
                } else {
                    console.table(employees);
                }
            })
            .then(() => MainMenu())
        });
    }

    function removeEmployee() {
        db.searchEmployees()
        .then(([rows]) => {
            let employees = rows;
            const chooseEmployee = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Choose an employee to remove",
                    choices: chooseEmployee
                }
            ])
            .then(res => db.deleteEmployee(res.employeeId))
            .then(() => console.log("Removed employee"))
            .then(() => MainMenu())
        })
    }

    function updateEmployeeRole() {
        db.searchEmployees()
        .then(([rows]) => {
            let employees = rows;
            const chooseEmployee = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Choose an employee to update their role",
                choices: chooseEmployee
            }
            ])
            .then(res => {
                let employeeId = res.employeeId;
                db.searchRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const chooseRole = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    prompt([
                        {
                            type: "list",
                            name: "roleId",
                            message: "Choose a role to assign to the selected employee",
                            choices: chooseRole
                        }
                    ])
                    .then(res => db.updateRole(employeeId, res.roleId))
                    .then(() => console.log("Updated Role"))
                    .then(() => MainMenu())
                });
            });
        })
    }

    function updateEmployeeManager() {
        db.searchEmployees()
        .then(([rows]) => {
            let employees = rows;
            const chooseEmployee = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Choose an employee's manager to update",
                    choices: chooseEmployee
                }
            ])
            .then(res => {
                let employeeId = res.employeeId
                db.searchManagers(employeeId)
                .then(([rows]) => {
                    let managers = rows;
                    const chooseManager = managers.map(({ id, first_name, last_name }) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    prompt([
                        {
                            type: "list",
                            name: "managerId",
                            message: "Choose a manager for the selected employee",
                            choices: chooseManager
                        }
                    ])
                    .then(res => db.updateManager(employeeId, res.managerId))
                    .then(() => console.log("Updated employee's manager"))
                    .then(() => MainMenu())
                })
            })
        })
    }

    function viewRoles() {
        db.searchRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => MainMenu());
    }

    function addRole() {
        db.searchDepartments()
        .then(([rows]) => {
            let departments = rows;
            const chooseDepartment = departments.map(({ id, name}) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "title",
                    message: "Choose a name for the role"
                },
                {
                    name: "Salary",
                    message: "Select a salary for the role"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Select a department for this role",
                    choices: chooseDepartment
                }
            ])
            .then(role => {
                db.newRole(role)
                .then(() => console.log(`added ${role.title}`))
                .then(() => MainMenu())
            })
        })
    }

    function removeRole() {
        db.searchRoles()
        .then(([rows]) => {
            let roles = rows;
            const chooseRole = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "roleId",
                    message: "Select a role to remove",
                    choices: chooseRole
                }
            ])
            .then(res => db.deleteRole(res.roleId))
            .then(() => console.log("Removed Role"))
            .then(() => MainMenu())
        })
    }

    function viewDepartments() {
        db.searchDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => MainMenu());
    }

    function addDepartment() {
        prompt([
            {
                name: "name",
                message: "Choose a Department Name"
            }
        ])
        .then(res => {
            let name = res;
            db.NewDepartment(name)
            .then(() => console.log(`Department ${name.name} created`))
            .then(() => MainMenu())
        })
    }

    function removeDepartment() {
        db.searchDepartments()
        .then(([rows]) => {
            let departments = rows;
            const chooseDepartment = departments.map(({ id, name}) => ({
                name: name,
                value: id
            }));

            prompt({
                type: "list",
                name: "departmentId",
                message: "Choose a department to remove",
                choices: chooseDepartment
            })
            .then(res => db.deleteDepartment(res.departmentId))
            .then(() => console.log(`Removed Department`))
            .then(() => MainMenu())
        })
    }

    function viewUtilizedBudgetByDepartment() {
        db.viewDepartmentBudgets()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => MainMenu());
    }

    function addEmployee() {
        prompt([
            {
                name: "first_name",
                message: "Please insert their first name"
            },
            {
                name: "last_name",
                message: "Please insert their last name"
            }
        ])
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.searchRoles()
            .then(([rows]) => {
                let roles = rows;
                const chooseRole = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                prompt({
                    type: "list",
                    name: "roleId",
                    message: "Select a role",
                    choices: chooseRole
                })
                .then(res => {
                    let roleId = res.roleId;

                    db.searchEmployees()
                    .then(([rows]) => {
                        let employees = rows;
                        const chooseManager = employees.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                        }));

                        chooseManager.unshift({ name: "None", value: null });

                        prompt({
                            type: "list",
                            name: "managerId",
                            message: "Choose a manager for the employee",
                            choices: chooseManager
                        })
                        .then(res => {
                            let employee = {
                                manager_id: res.managerId,
                                role_id: roleId,
                                first_name: firstName,
                                last_name: lastName
                            }

                            db.newEmployee(employee);
                        })
                        .then(() => console.log(`Added ${firstName} ${lastName}`))
                        .then(() => MainMenu())
                    })
                })
            })
        })
    }
}

function quit() {
    console.log("Closing Program");
    process.exit();
}