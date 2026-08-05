import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export const TimeEntryDelete = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [entry, setEntry] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

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

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries/" + id, {
                method: "DELETE",
            })
            if (res.ok) navigate("/time-entries")
            else {
                const err = await res.json()
                console.error("Error deleting time entry:", err)
                setDeleting(false)
            }
        } catch (error) {
            console.error("Error:", error)
            setDeleting(false)
        }
    }

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>
    if (!entry) return <div className="container mt-4"><h2>Time entry not found</h2><Link to="/time-entries">Back to list</Link></div>

    return (
        <div className="container mt-4">
            <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                    <h2 className="mb-0">Confirm Deletion</h2>
                </div>
                <div className="card-body">
                    <p className="lead">Are you sure you want to delete this time entry?</p>
                    <p><strong>ID:</strong> {entry.id}</p>
                    <p><strong>Employee:</strong> {entry.employee_name}</p>
                    <p><strong>Check-in:</strong> {new Date(entry.check_in).toLocaleString()}</p>
                    <p><strong>Check-out:</strong> {entry.check_out ? new Date(entry.check_out).toLocaleString() : "—"}</p>
                    <p className="text-danger small">This action cannot be undone.</p>
                    <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
                        {deleting ? "Deleting..." : "Yes, delete"}
                    </button>
                    <Link to="/time-entries" className="btn btn-secondary ms-2">Cancel</Link>
                </div>
            </div>
        </div>
    )
}
