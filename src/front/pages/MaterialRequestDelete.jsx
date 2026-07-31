import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export const MaterialRequestDelete = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [req, setReq] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/material-requests/" + id)
            .then(res => {
                if (!res.ok) throw new Error("Material request not found")
                return res.json()
            })
            .then(data => setReq(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/material-requests/" + id, {
                method: "DELETE",
            })
            if (res.ok) navigate("/material-requests")
            else {
                const err = await res.json()
                console.error("Error deleting material request:", err)
                setDeleting(false)
            }
        } catch (error) {
            console.error("Error:", error)
            setDeleting(false)
        }
    }

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>
    if (!req) return <div className="container mt-4"><h2>Material request not found</h2><Link to="/material-requests">Back to list</Link></div>

    return (
        <div className="container mt-4">
            <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                    <h2 className="mb-0">Confirm Deletion</h2>
                </div>
                <div className="card-body">
                    <p className="lead">Are you sure you want to delete this material request?</p>
                    <p><strong>ID:</strong> {req.id}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    <p><strong>Items:</strong> {req.items?.length || 0}</p>
                    <p className="text-danger small">This action cannot be undone.</p>
                    <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
                        {deleting ? "Deleting..." : "Yes, delete"}
                    </button>
                    <Link to="/material-requests" className="btn btn-secondary ms-2">Cancel</Link>
                </div>
            </div>
        </div>
    )
}
