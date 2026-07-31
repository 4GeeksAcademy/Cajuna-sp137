import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const MaterialRequestCreate = () => {
  const navigate = useNavigate()
  const { store } = useGlobalReducer()
  const [employees, setEmployees] = useState([])
  const [materials, setMaterials] = useState([])
  const [form, setForm] = useState({
    employee_id: "",
    notes: "",
  })
  const [items, setItems] = useState([{ material_id: "", quantity_requested: 1 }])

  useEffect(() => {
    if (!store.selectedCompany) return
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees?company_id=" + store.selectedCompany.id)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Error loading employees:", err))
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/materials?company_id=" + store.selectedCompany.id)
      .then(res => res.json())
      .then(data => setMaterials(data))
      .catch(err => console.error("Error loading materials:", err))
  }, [store.selectedCompany?.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index, field, value) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const addItem = () => setItems(prev => [...prev, { material_id: "", quantity_requested: 1 }])
  const removeItem = (index) => setItems(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/material-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: Number(form.employee_id),
          company_id: store.selectedCompany.id,
          notes: form.notes || null,
          items: items.map(item => ({
            material_id: Number(item.material_id),
            quantity_requested: Number(item.quantity_requested),
          })),
        }),
      })
      if (res.ok) navigate("/material-requests")
      else {
        const err = await res.json()
        console.error("Error creating material request:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="container mt-4">
      <h1>New Material Request</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Company</label>
          <input className="form-control" value={store.selectedCompany?.name || "No company selected"} disabled />
        </div>
        <div className="mb-3">
          <label className="form-label">Employee</label>
          <select name="employee_id" value={form.employee_id} onChange={handleChange} className="form-select" required disabled={!store.selectedCompany}>
            <option value="">Select employee...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="form-control" rows="2" />
        </div>

        <h5>Items</h5>
        {items.map((item, index) => (
          <div key={index} className="row g-2 mb-2 align-items-end">
            <div className="col-md-6">
              <select
                className="form-select"
                value={item.material_id}
                onChange={(e) => handleItemChange(index, "material_id", e.target.value)}
                required
                disabled={!store.selectedCompany}
              >
                <option value="">Select material...</option>
                {materials.map(mat => (
                  <option key={mat.id} value={mat.id}>{mat.name} ({mat.unit})</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="number" min="1" className="form-control"
                placeholder="Qty"
                value={item.quantity_requested}
                onChange={(e) => handleItemChange(index, "quantity_requested", e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              {items.length > 1 && (
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeItem(index)}>Remove</button>
              )}
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline-secondary btn-sm mb-3" onClick={addItem}>+ Add Item</button>

        <div>
          <button type="submit" className="btn btn-primary" disabled={!store.selectedCompany}>
            {store.selectedCompany ? "Create" : "Select a company first"}
          </button>
          <Link to="/material-requests" className="btn btn-secondary ms-2">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
