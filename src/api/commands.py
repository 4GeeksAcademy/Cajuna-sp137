from api.models import (
    Company,
    Employee,
    Material,
    MaterialRequest,
    MaterialRequestItem,
    db,
)


def setup_commands(app):

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Creating test data...")

        # ── Constructora del Sur (Caracas) ──────────────────────────
        c1 = Company(
            name="Constructora del Sur",
            tax_id="J-12345678-9",
            email="admin.sur@constructora-sur.com",
            password="12345678",
            phone="+58 212-555-0101",
            address="Av. Principal, Edif. Sur, Piso 3",
            city="Caracas",
            country="Venezuela",
        )
        c1.employees.append(
            Employee(
                first_name="Admin",
                last_name="Sur",
                email="admin.sur@constructora-sur.com",
                password="12345",
            )
        )
        db.session.add(c1)
        db.session.flush()

        for first, last, email in [
            ("Carlos", "Mendoza", "carlos.mendoza@constructora-sur.com"),
            ("Maria", "Lopez", "maria.lopez@constructora-sur.com"),
            ("Jose", "Perez", "jose.perez@constructora-sur.com"),
            ("Ana", "Garcia", "ana.garcia@constructora-sur.com"),
            ("Luis", "Martinez", "luis.martinez@constructora-sur.com"),
            ("Sofia", "Rodriguez", "sofia.rodriguez@constructora-sur.com"),
            ("Pedro", "Sanchez", "pedro.sanchez@constructora-sur.com"),
        ]:
            db.session.add(
                Employee(
                    first_name=first,
                    last_name=last,
                    email=email,
                    password="12345",
                    company_id=c1.id,
                )
            )
        db.session.flush()

        c1_materials = []
        for name, qty, unit, min_stock in [
            ("Cemento Portland", 5000, "kg", 1000),
            ("Arena lavada", 8000, "kg", 2000),
            ("Bloques de concreto", 1500, "unidades", 300),
            ("Cabillas de acero", 600, "unidades", 100),
            ("Pintura blanca", 80, "litros", 15),
            ('Tuberia PVC 4"', 200, "unidades", 40),
            ("Cable electrico", 500, "metros", 100),
            ("Ceramica piso", 400, "cajas", 80),
            ("Yeso", 300, "kg", 60),
        ]:
            m = Material(
                name=name,
                quantity=qty,
                unit=unit,
                minimum_stock=min_stock,
                company_id=c1.id,
            )
            db.session.add(m)
            c1_materials.append(m)
        db.session.flush()

        c1_emps = list(
            db.session.scalars(
                db.select(Employee).where(
                    Employee.company_id == c1.id).offset(1)
            ).all()
        )

        c1_reqs = [
            (
                c1_emps[0],
                "pendiente",
                "Urgente para obra en El Hatillo",
                [(c1_materials[0], 200), (c1_materials[1], 500)],
            ),
            (
                c1_emps[0],
                "aprobado",
                "Reabastecimiento mensual",
                [(c1_materials[2], 100), (c1_materials[3], 50), (c1_materials[4], 10)],
            ),
            (
                c1_emps[1],
                "pendiente",
                "Material faltante en inventario",
                [(c1_materials[5], 30), (c1_materials[6], 100)],
            ),
            (
                c1_emps[2],
                "aprobado",
                "Pedido semanal de obra",
                [(c1_materials[0], 100), (c1_materials[2], 50), (c1_materials[7], 20)],
            ),
            (
                c1_emps[3],
                "pendiente",
                "Reparaciones en edificio central",
                [(c1_materials[4], 5), (c1_materials[6], 50), (c1_materials[8], 30)],
            ),
        ]
        for emp, status, notes, items in c1_reqs:
            req = MaterialRequest(
                employee_id=emp.id, company_id=c1.id, status=status, notes=notes
            )
            db.session.add(req)
            db.session.flush()
            for mat, qty in items:
                db.session.add(
                    MaterialRequestItem(
                        request_id=req.id, material_id=mat.id, quantity_requested=qty
                    )
                )

        # ── Ferremateriales Norte (Maracaibo) ───────────────────────
        c2 = Company(
            name="Ferremateriales Norte",
            tax_id="J-87654321-0",
            email="admin.norte@ferremateriales-norte.com",
            password="12345678",
            phone="+58 261-555-0202",
            address="Calle 5, Local 12",
            city="Maracaibo",
            country="Venezuela",
        )
        c2.employees.append(
            Employee(
                first_name="Admin",
                last_name="Norte",
                email="admin.norte@ferremateriales-norte.com",
                password="12345",
            )
        )
        db.session.add(c2)
        db.session.flush()

        for first, last, email in [
            ("Ana", "Rivas", "ana.rivas@ferremateriales-norte.com"),
            ("Luis", "Torres", "luis.torres@ferremateriales-norte.com"),
            ("Carmen", "Diaz", "carmen.diaz@ferremateriales-norte.com"),
            ("Miguel", "Castillo", "miguel.castillo@ferremateriales-norte.com"),
            ("Rosa", "Fernandez", "rosa.fernandez@ferremateriales-norte.com"),
            ("Jorge", "Alvarado", "jorge.alvarado@ferremateriales-norte.com"),
        ]:
            db.session.add(
                Employee(
                    first_name=first,
                    last_name=last,
                    email=email,
                    password="12345",
                    company_id=c2.id,
                )
            )
        db.session.flush()

        c2_materials = []
        for name, qty, unit, min_stock in [
            ('Clavos 2"', 2000, "kg", 400),
            ("Martillos", 120, "unidades", 20),
            ("Lija para madera", 500, "unidades", 100),
            ('Tornillos 1/2"', 2000, "unidades", 400),
            ("Barniz marino", 40, "litros", 8),
            ("Pegamento blanco", 100, "litros", 20),
            ('Brochas 3"', 80, "unidades", 16),
            ("Rodillos para pintar", 60, "unidades", 12),
            ("Disco de corte", 150, "unidades", 30),
        ]:
            m = Material(
                name=name,
                quantity=qty,
                unit=unit,
                minimum_stock=min_stock,
                company_id=c2.id,
            )
            db.session.add(m)
            c2_materials.append(m)
        db.session.flush()

        c2_emps = list(
            db.session.scalars(
                db.select(Employee).where(
                    Employee.company_id == c2.id).offset(1)
            ).all()
        )

        c2_reqs = [
            (
                c2_emps[0],
                "pendiente",
                "Taller de carpinteria",
                [(c2_materials[0], 50), (c2_materials[2], 100), (c2_materials[4], 10)],
            ),
            (
                c2_emps[0],
                "rechazado",
                "Fuera de presupuesto mensual",
                [(c2_materials[0], 500)],
            ),
            (
                c2_emps[1],
                "aprobado",
                "Mantenimiento de herramientas",
                [(c2_materials[1], 10), (c2_materials[6], 20), (c2_materials[8], 30)],
            ),
            (
                c2_emps[2],
                "pendiente",
                "Pedido de pintura y accesorios",
                [(c2_materials[4], 5), (c2_materials[5], 15), (c2_materials[7], 10)],
            ),
            (
                c2_emps[3],
                "aprobado",
                "Reposicion de inventario basico",
                [(c2_materials[0], 100), (c2_materials[3], 300),
                 (c2_materials[2], 50)],
            ),
        ]
        for emp, status, notes, items in c2_reqs:
            req = MaterialRequest(
                employee_id=emp.id, company_id=c2.id, status=status, notes=notes
            )
            db.session.add(req)
            db.session.flush()
            for mat, qty in items:
                db.session.add(
                    MaterialRequestItem(
                        request_id=req.id, material_id=mat.id, quantity_requested=qty
                    )
                )

        # ── Inversiones Oriente (Barcelona) ─────────────────────────
        c3 = Company(
            name="Inversiones Oriente",
            tax_id="J-55667788-1",
            email="admin.orienten@inversiones-oriente.com",
            password="12345678",
            phone="+58 281-555-0303",
            address="Av. Bolivar, Centro Comercial Oriente, Local 5",
            city="Barcelona",
            country="Venezuela",
        )
        c3.employees.append(
            Employee(
                first_name="Admin",
                last_name="Oriente",
                email="admin.orienten@inversiones-oriente.com",
                password="12345",
            )
        )
        db.session.add(c3)
        db.session.flush()

        for first, last, email in [
            ("Daniel", "Gutierrez", "daniel.gutierrez@inversiones-oriente.com"),
            ("Laura", "Jimenez", "laura.jimenez@inversiones-oriente.com"),
            ("Andres", "Mora", "andres.mora@inversiones-oriente.com"),
            ("Natalia", "Paredes", "natalia.paredes@inversiones-oriente.com"),
            ("Ricardo", "Contreras", "ricardo.contreras@inversiones-oriente.com"),
            ("Valentina", "Reyes", "valentina.reyes@inversiones-oriente.com"),
            ("Fernando", "Vargas", "fernando.vargas@inversiones-oriente.com"),
        ]:
            db.session.add(
                Employee(
                    first_name=first,
                    last_name=last,
                    email=email,
                    password="12345",
                    company_id=c3.id,
                )
            )
        db.session.flush()

        c3_materials = []
        for name, qty, unit, min_stock in [
            ("Placas de yeso", 500, "unidades", 100),
            ("Perfiles metalicos", 400, "unidades", 80),
            ("Aislante termico", 200, "rollos", 40),
            ("Pintura impermeable", 60, "litros", 12),
            ("Malla de acero", 300, "unidades", 60),
            ("Adhesivo para ceramica", 150, "kg", 30),
            ("Molduras de poliuretano", 200, "unidades", 40),
            ("Silicona", 100, "tubos", 20),
            ("Lijas de agua", 400, "unidades", 80),
        ]:
            m = Material(
                name=name,
                quantity=qty,
                unit=unit,
                minimum_stock=min_stock,
                company_id=c3.id,
            )
            db.session.add(m)
            c3_materials.append(m)
        db.session.flush()

        c3_emps = list(
            db.session.scalars(
                db.select(Employee).where(
                    Employee.company_id == c3.id).offset(1)
            ).all()
        )

        c3_reqs = [
            (
                c3_emps[0],
                "aprobado",
                "Remodelacion oficinas piso 2",
                [(c3_materials[0], 50), (c3_materials[1], 40), (c3_materials[4], 20)],
            ),
            (
                c3_emps[0],
                "pendiente",
                "Impermeabilizacion terraza",
                [(c3_materials[3], 10), (c3_materials[2], 15), (c3_materials[7], 30)],
            ),
            (
                c3_emps[1],
                "pendiente",
                "Material para baños",
                [(c3_materials[5], 40), (c3_materials[6], 30), (c3_materials[0], 20)],
            ),
            (
                c3_emps[2],
                "rechazado",
                "Solicitud sin autorizacion",
                [(c3_materials[4], 100)],
            ),
            (
                c3_emps[3],
                "aprobado",
                "Acabados areas comunes",
                [
                    (c3_materials[0], 30),
                    (c3_materials[6], 50),
                    (c3_materials[8], 80),
                    (c3_materials[3], 5),
                ],
            ),
        ]
        for emp, status, notes, items in c3_reqs:
            req = MaterialRequest(
                employee_id=emp.id, company_id=c3.id, status=status, notes=notes
            )
            db.session.add(req)
            db.session.flush()
            for mat, qty in items:
                db.session.add(
                    MaterialRequestItem(
                        request_id=req.id, material_id=mat.id, quantity_requested=qty
                    )
                )

        db.session.commit()

        print("Test data created successfully!")
        print("  3 companies")
        print("  27 employees (3 admins + 24 regular)")
        print("  27 materials")
        print("  15 material requests")
