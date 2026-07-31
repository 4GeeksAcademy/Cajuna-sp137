import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export const MaterialEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [form, setForm] = useState({
        name: "",
        unit: "",
        quantity: 0,
        minimum_stock: 0,
    })

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/materials/" + id)
            .then(res => {
                if (!res.ok) throw new Error("Material not found")
                return res.json()
            })
            .then(data => setForm({
                name: data.name,
                unit: data.unit,
                quantity: data.quantity,
                minimum_stock: data.minimum_stock,
            }))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/materials/" + id, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    unit: form.unit,
                    quantity: Number(form.quantity),
                    minimum_stock: Number(form.minimum_stock),
                }),
            })
            if (res.ok) navigate("/materials")
            else {
                const err = await res.json()
                console.error("Error updating material:", err)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

    return (
        <div className="container mt-4">
            <h1>Edit Material</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Unit</label>
                    <input name="unit" value={form.unit} onChange={handleChange} className="form-control" required placeholder="e.g. kg, pcs, m" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Minimum Stock</label>
                    <input name="minimum_stock" type="number" min="0" value={form.minimum_stock} onChange={handleChange} className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Save</button>
                <Link to="/materials" className="btn btn-secondary ms-2">Cancel</Link>
            </form>
        </div>
    )
}
