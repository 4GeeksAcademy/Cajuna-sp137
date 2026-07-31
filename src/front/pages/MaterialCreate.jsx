import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const MaterialCreate = () => {
    const navigate = useNavigate()
    const { store } = useGlobalReducer()
    const [form, setForm] = useState({
        name: "",
        unit: "",
        quantity: 0,
        minimum_stock: 0,
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/materials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, company_id: store.selectedCompany.id, quantity: Number(form.quantity), minimum_stock: Number(form.minimum_stock) }),
            })
            if (res.ok) navigate("/materials")
            else {
                const err = await res.json()
                console.error("Error creating material:", err)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    return (
        <div className="container mt-4">
            <h1>New Material</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                        className="form-control"
                        value={store.selectedCompany?.name || "No company selected"}
                        disabled
                    />
                </div>
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
                <button type="submit" className="btn btn-primary" disabled={!store.selectedCompany}>
                    {store.selectedCompany ? "Create" : "Select a company first"}
                </button>
                <Link to="/materials" className="btn btn-secondary ms-2">Cancel</Link>
            </form>
        </div>
    )
}
