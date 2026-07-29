import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export const EmployeeDetail = () => {
    const { id } = useParams()
    const [employee, setEmployee] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees/" + id)
            .then(res => {
                if (!res.ok) throw new Error("Employee not found")
                return res.json()
            })
            .then(data => setEmployee(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>
    if (!employee) return <div className="container mt-4"><h2>Employee not found</h2><Link to="/employees">Back to list</Link></div>

    return (
        <div className="container mt-4">
            <h1>Employee Detail</h1>
            <div className="card">
                <div className="card-body">
                    <dl className="row">
                        <dt className="col-sm-3">ID</dt>
                        <dd className="col-sm-9">{employee.id}</dd>

                        <dt className="col-sm-3">First Name</dt>
                        <dd className="col-sm-9">{employee.first_name}</dd>

                        <dt className="col-sm-3">Last Name</dt>
                        <dd className="col-sm-9">{employee.last_name}</dd>

                        <dt className="col-sm-3">Email</dt>
                        <dd className="col-sm-9">{employee.email}</dd>

                        <dt className="col-sm-3">Phone</dt>
                        <dd className="col-sm-9">{employee.phone || "—"}</dd>

                        <dt className="col-sm-3">Created At</dt>
                        <dd className="col-sm-9">{new Date(employee.created_at).toLocaleString()}</dd>

                        <dt className="col-sm-3">Updated At</dt>
                        <dd className="col-sm-9">{new Date(employee.updated_at).toLocaleString()}</dd>
                    </dl>
                </div>
            </div>
            <div className="mt-3">
                <Link to="/employees" className="btn btn-secondary">Back to list</Link>
                <Link to={`/employees/${employee.id}/edit`} className="btn btn-warning ms-2">Edit</Link>
                <Link to={`/employees/${employee.id}/delete`} className="btn btn-danger ms-2">Delete</Link>
            </div>
        </div>
    )
}
