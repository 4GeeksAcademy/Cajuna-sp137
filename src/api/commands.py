import click

from api.models import Company, Employee, User, db

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""


def setup_commands(app):
    """
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """

    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-employees")
    @click.argument("count")
    def insert_test_employees(count):
        for x in range(1, int(count) + 1):
            employee = Employee()
            if x == 1:
                employee.first_name = "Admin"
                employee.last_name = "Sistema"
                employee.email = "admin@sistema.com"
            else:
                employee.first_name = f"Empleado {x}"
                employee.last_name = f"Apellido {x}"
                employee.email = f"empleado_{x}@test.com"
            employee.password = "12345"
            db.session.add(employee)

        db.session.commit()
        print(f"{count} test employees created")

    @app.cli.command("insert-test-companies")
    @click.argument("count")
    def insert_test_companies(count):
        for x in range(1, int(count) + 1):
            company = Company()
            company.name = f"Empresa {x}"
            company.tax_id = f"TAX-{x}-00000"
            company.phone = f"+1234567{x}"
            company.address = f"Calle {x} #{x}"
            company.city = f"Ciudad {x}"
            company.country = "Venezuela"
            db.session.add(company)
        db.session.commit()
        print(f"{count} test companies created")
