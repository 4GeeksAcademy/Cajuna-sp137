import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const EmployeeList = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees")
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error("Error fetching employees:", err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Employees</h1>
                <Link to="/employees/new" className="btn btn-success">+ New Employee</Link>
            </div>
            <table className="table table-striped table-hover d-none d-md-table">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...employees].sort((a, b) => a.id - b.id).map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.first_name}</td>
                            <td>{emp.last_name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.phone || "—"}</td>
                            <td>{new Date(emp.created_at).toLocaleDateString()}</td>
                            <td>{new Date(emp.updated_at).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/employees/${emp.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/employees/${emp.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-md-none">
                {[...employees].sort((a, b) => a.id - b.id).map(emp => (
                    <div key={emp.id} className="card mb-2">
                        <div className="card-body py-2">
                            <div>
                                <strong>{emp.first_name} {emp.last_name}</strong><br />
                                <small className="text-muted">{emp.email}</small>
                            </div>
                            <div className="mt-2">
                                <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/employees/${emp.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/employees/${emp.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
