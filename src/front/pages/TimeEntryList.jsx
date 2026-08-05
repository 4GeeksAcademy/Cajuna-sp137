import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const TimeEntryList = () => {
    const { store } = useGlobalReducer()
    const [employees, setEmployees] = useState([])
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState(null)

    const loadEntries = async () => {
        const params = store.selectedCompany
            ? `?company_id=${store.selectedCompany.id}`
            : ""
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries" + params)
        const data = await res.json()
        setEntries(data)
    }

    useEffect(() => {
        async function loadAll() {
            setLoading(true)
            try {
                const params = store.selectedCompany
                    ? `?company_id=${store.selectedCompany.id}`
                    : ""
                const [empRes, entriesRes] = await Promise.all([
                    fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees" + params),
                    fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries" + params),
                ])
                const [empData, entriesData] = await Promise.all([empRes.json(), entriesRes.json()])
                setEmployees(empData)
                setEntries(entriesData)
            } catch (err) {
                console.error("Error fetching time entries:", err)
            } finally {
                setLoading(false)
            }
        }
        loadAll()
    }, [store.selectedCompany?.id])

    const openEntryFor = (employeeId) =>
        entries.find(e => e.employee_id === employeeId && e.check_out === null) || null

    const handleCheckIn = async (employeeId) => {
        setBusyId(employeeId)
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employee_id: employeeId }),
            })
            if (res.ok) await loadEntries()
            else console.error("Error checking in:", await res.json())
        } catch (err) {
            console.error("Error:", err)
        } finally {
            setBusyId(null)
        }
    }

    const handleCheckOut = async (entryId, employeeId) => {
        setBusyId(employeeId)
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/time_entries/${entryId}/check-out`, {
                method: "POST",
            })
            if (res.ok) await loadEntries()
            else console.error("Error checking out:", await res.json())
        } catch (err) {
            console.error("Error:", err)
        } finally {
            setBusyId(null)
        }
    }

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Time Entries</h1>
                <Link to="/time-entries/new" className="btn btn-success">+ New Entry</Link>
            </div>

            {store.selectedCompany && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Jornada de hoy</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Employee</th>
                                    <th>Check-in</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => {
                                    const open = openEntryFor(emp.id)
                                    return (
                                        <tr key={emp.id}>
                                            <td>{emp.first_name} {emp.last_name}</td>
                                            <td>{open ? new Date(open.check_in).toLocaleString() : "—"}</td>
                                            <td>
                                                <span className={`badge ${open ? "bg-success" : "bg-secondary"}`}>
                                                    {open ? "En jornada" : "Sin iniciar"}
                                                </span>
                                            </td>
                                            <td>
                                                {open ? (
                                                    <button
                                                        className="btn btn-sm btn-warning"
                                                        onClick={() => handleCheckOut(open.id, emp.id)}
                                                        disabled={busyId === emp.id}
                                                    >
                                                        {busyId === emp.id ? "..." : "Fin de jornada"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleCheckIn(emp.id)}
                                                        disabled={busyId === emp.id}
                                                    >
                                                        {busyId === emp.id ? "..." : "Inicio de jornada"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <h5>Historial</h5>
            <table className="table table-striped table-hover d-none d-md-table">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...entries].sort((a, b) => b.id - a.id).map(entry => (
                        <tr key={entry.id}>
                            <td>{entry.id}</td>
                            <td>{entry.employee_name}</td>
                            <td>{new Date(entry.check_in).toLocaleString()}</td>
                            <td>{entry.check_out ? new Date(entry.check_out).toLocaleString() : "—"}</td>
                            <td>
                                <span className={`badge ${entry.check_out ? "bg-secondary" : "bg-success"}`}>
                                    {entry.check_out ? "Cerrado" : "Abierto"}
                                </span>
                            </td>
                            <td>
                                <Link to={`/time-entries/${entry.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/time-entries/${entry.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/time-entries/${entry.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-md-none">
                {[...entries].sort((a, b) => b.id - a.id).map(entry => (
                    <div key={entry.id} className="card mb-2">
                        <div className="card-body py-2">
                            <div className="d-flex justify-content-between">
                                <strong>#{entry.id} {entry.employee_name}</strong>
                                <span className={`badge ${entry.check_out ? "bg-secondary" : "bg-success"}`}>
                                    {entry.check_out ? "Cerrado" : "Abierto"}
                                </span>
                            </div>
                            <small className="text-muted">In: {new Date(entry.check_in).toLocaleString()}</small><br />
                            <small className="text-muted">Out: {entry.check_out ? new Date(entry.check_out).toLocaleString() : "—"}</small>
                            <div className="mt-2">
                                <Link to={`/time-entries/${entry.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/time-entries/${entry.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/time-entries/${entry.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
