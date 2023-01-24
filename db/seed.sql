USE company_db;

INSERT INTO department (name)
VALUES ("Sales"),
        ("Human Resources"),
        ("Management"),
        ("Warehouse"),
        ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Regional Manager", 100000, 1),
("HR Representative", 80000, 2),
("Truck Driver", 60000, 4),
("Financial Analyst", 80000, 5),
("Senior Sales Advisor",  90000, 1),
("Junior Sales Advisor", 75000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, 1),
("Toby", "Flenderson", 2, 1),
("Tuna", "Halpert", 5, 1),
("Dwight", "Schrute", 6, 1);