import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const MaterialList = () => {
    const { store } = useGlobalReducer()
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadMaterials() {
            setLoading(true)
            try {
                const params = store.selectedCompany
                    ? `?company_id=${store.selectedCompany.id}`
                    : ""
                const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/materials" + params)
                const data = await res.json()
                setMaterials(data)
            } catch (err) {
                console.error("Error fetching materials:", err)
            } finally {
                setLoading(false)
            }
        }
        loadMaterials()
    }, [store.selectedCompany?.id])

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Materials</h1>
                <Link to="/materials/new" className="btn btn-success">+ New Material</Link>
            </div>
            <table className="table table-striped table-hover d-none d-md-table">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                        <th>Min. Stock</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...materials].sort((a, b) => a.id - b.id).map(mat => (
                        <tr key={mat.id}>
                            <td>{mat.id}</td>
                            <td>{mat.name}</td>
                            <td>{mat.unit}</td>
                            <td>{mat.quantity}</td>
                            <td>{mat.minimum_stock}</td>
                            <td>{new Date(mat.created_at).toLocaleDateString()}</td>
                            <td>{new Date(mat.updated_at).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/materials/${mat.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/materials/${mat.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/materials/${mat.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-md-none">
                {[...materials].sort((a, b) => a.id - b.id).map(mat => (
                    <div key={mat.id} className="card mb-2">
                        <div className="card-body py-2">
                            <div>
                                <strong>{mat.name}</strong><br />
                                <small className="text-muted">{mat.quantity} {mat.unit}</small><br />
                                <small className="text-muted">Min: {mat.minimum_stock}</small>
                            </div>
                            <div className="mt-2">
                                <Link to={`/materials/${mat.id}`} className="btn btn-sm btn-outline-primary me-1">Ver</Link>
                                <Link to={`/materials/${mat.id}/edit`} className="btn btn-sm btn-outline-warning me-1">Editar</Link>
                                <Link to={`/materials/${mat.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
