import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export const TimeEntryDetail = () => {
    const { id } = useParams()
    const [entry, setEntry] = useState(null)
    const [loading, setLoading] = useState(true)
    const [checkingOut, setCheckingOut] = useState(false)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries/" + id)
            .then(res => {
                if (!res.ok) throw new Error("Time entry not found")
                return res.json()
            })
            .then(data => setEntry(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    const handleCheckOut = async () => {
        setCheckingOut(true)
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/time_entries/${entry.id}/check-out`, {
                method: "POST",
            })
            if (res.ok) {
                const data = await res.json()
                setEntry(data)
            } else {
                console.error("Error checking out:", await res.json())
                setCheckingOut(false)
            }
        } catch (err) {
            console.error("Error:", err)
            setCheckingOut(false)
        }
    }

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>
    if (!entry) return <div className="container mt-4"><h2>Time entry not found</h2><Link to="/time-entries">Back to list</Link></div>

    return (
        <div className="container mt-4">
            <h1>Time Entry #{entry.id}</h1>
            <div className="card mb-3">
                <div className="card-body">
                    <dl className="row">
                        <dt className="col-sm-3">ID</dt>
                        <dd className="col-sm-9">{entry.id}</dd>

                        <dt className="col-sm-3">Employee</dt>
                        <dd className="col-sm-9">{entry.employee_name}</dd>

                        <dt className="col-sm-3">Check-in</dt>
                        <dd className="col-sm-9">{new Date(entry.check_in).toLocaleString()}</dd>

                        <dt className="col-sm-3">Check-out</dt>
                        <dd className="col-sm-9">
                            {entry.check_out
                                ? new Date(entry.check_out).toLocaleString()
                                : <span className="badge bg-success">En jornada</span>}
                        </dd>
                    </dl>
                    {!entry.check_out && (
                        <button
                            className="btn btn-warning"
                            onClick={handleCheckOut}
                            disabled={checkingOut}
                        >
                            {checkingOut ? "..." : "Fin de jornada"}
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-3">
                <Link to="/time-entries" className="btn btn-secondary">Back to list</Link>
                <Link to={`/time-entries/${entry.id}/edit`} className="btn btn-warning ms-2">Edit</Link>
                <Link to={`/time-entries/${entry.id}/delete`} className="btn btn-danger ms-2">Delete</Link>
            </div>
        </div>
    )
}
