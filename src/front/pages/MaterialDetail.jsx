import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export const MaterialDetail = () => {
    const { id } = useParams()
    const [material, setMaterial] = useState(null)
    const [loading, setLoading] = useState(true)

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

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>
    if (!material) return <div className="container mt-4"><h2>Material not found</h2><Link to="/materials">Back to list</Link></div>

    return (
        <div className="container mt-4">
            <h1>Material Detail</h1>
            <div className="card">
                <div className="card-body">
                    <dl className="row">
                        <dt className="col-sm-3">ID</dt>
                        <dd className="col-sm-9">{material.id}</dd>

                        <dt className="col-sm-3">Name</dt>
                        <dd className="col-sm-9">{material.name}</dd>

                        <dt className="col-sm-3">Unit</dt>
                        <dd className="col-sm-9">{material.unit}</dd>

                        <dt className="col-sm-3">Quantity</dt>
                        <dd className="col-sm-9">{material.quantity}</dd>

                        <dt className="col-sm-3">Minimum Stock</dt>
                        <dd className="col-sm-9">{material.minimum_stock}</dd>

                        <dt className="col-sm-3">Created At</dt>
                        <dd className="col-sm-9">{new Date(material.created_at).toLocaleString()}</dd>

                        <dt className="col-sm-3">Updated At</dt>
                        <dd className="col-sm-9">{new Date(material.updated_at).toLocaleString()}</dd>
                    </dl>
                </div>
            </div>
            <div className="mt-3">
                <Link to="/materials" className="btn btn-secondary">Back to list</Link>
                <Link to={`/materials/${material.id}/edit`} className="btn btn-warning ms-2">Edit</Link>
                <Link to={`/materials/${material.id}/delete`} className="btn btn-danger ms-2">Delete</Link>
            </div>
        </div>
    )
}
