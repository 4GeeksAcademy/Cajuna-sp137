import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

const STATUS_BADGE = {
  pendiente: "bg-warning",
  aprobado: "bg-success",
  rechazado: "bg-danger",
}

export const MaterialRequestList = () => {
    const { store } = useGlobalReducer()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRequests() {
            setLoading(true)
            try {
                const params = store.selectedCompany
                    ? `?company_id=${store.selectedCompany.id}`
                    : ""
                const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/material-requests" + params)
                const data = await res.json()
                setRequests(data)
            } catch (err) {
                console.error("Error fetching material requests:", err)
            } finally {
                setLoading(false)
            }
        }
        loadRequests()
    }, [store.selectedCompany?.id])

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Material Requests</h1>
                <Link to="/material-requests/new" className="btn btn-success">+ New Request</Link>
            </div>
            <table className="table table-striped table-hover d-none d-md-table">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Employee</th>
                        <th>Items</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...requests].sort((a, b) => a.id - b.id).map(req => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td><span className={`badge ${STATUS_BADGE[req.status] || "bg-secondary"}`}>{req.status}</span></td>
                            <td>{req.employee_name || req.employee_id}</td>
                            <td>{req.items?.length || 0}</td>
                            <td>{new Date(req.created_at).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/material-requests/${req.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/material-requests/${req.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/material-requests/${req.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-md-none">
                {[...requests].sort((a, b) => a.id - b.id).map(req => (
                    <div key={req.id} className="card mb-2">
                        <div className="card-body py-2">
                            <div className="d-flex justify-content-between">
                                <strong>#{req.id}</strong>
                                <span className={`badge ${STATUS_BADGE[req.status] || "bg-secondary"}`}>{req.status}</span>
                            </div>
                            <small className="text-muted">{req.employee_name || req.employee_id}</small><br />
                            <small className="text-muted">{req.items?.length || 0} item(s) · {new Date(req.created_at).toLocaleDateString()}</small>
                            <div className="mt-2">
                                <Link to={`/material-requests/${req.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/material-requests/${req.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/material-requests/${req.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
