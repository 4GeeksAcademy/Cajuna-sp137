import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export const MaterialDelete = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [material, setMaterial] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/materials/" + id)
            .then(res => {
                if (!res.ok) throw new Error("Material not found")
                return res.json()
            })
            .then(data => setMaterial(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/materials/" + id, {
                method: "DELETE",
            })
            if (res.ok) navigate("/materials")
            else {
                const err = await res.json()
                console.error("Error deleting material:", err)
                setDeleting(false)
            }
        } catch (error) {
            console.error("Error:", error)
            setDeleting(false)
        }
    }

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>
    if (!material) return <div className="container mt-4"><h2>Material not found</h2><Link to="/materials">Back to list</Link></div>

    return (
        <div className="container mt-4">
            <div className="card border-danger">
                <div className="card-header bg-danger text-white">
                    <h2 className="mb-0">Confirm Deletion</h2>
                </div>
                <div className="card-body">
                    <p className="lead">Are you sure you want to delete this material?</p>
                    <p><strong>Name:</strong> {material.name}</p>
                    <p><strong>Unit:</strong> {material.unit}</p>
                    <p><strong>Quantity:</strong> {material.quantity}</p>
                    <p><strong>Min. Stock:</strong> {material.minimum_stock}</p>
                    <p className="text-danger small">This action cannot be undone.</p>
                    <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
                        {deleting ? "Deleting..." : "Yes, delete"}
                    </button>
                    <Link to="/materials" className="btn btn-secondary ms-2">Cancel</Link>
                </div>
            </div>
        </div>
    )
}
