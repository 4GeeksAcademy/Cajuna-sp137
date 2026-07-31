import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export const MaterialRequestEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    status: "",
    notes: "",
  })

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/material-requests/" + id)
      .then(res => {
        if (!res.ok) throw new Error("Material request not found")
        return res.json()
      })
      .then(data => setForm({
        status: data.status,
        notes: data.notes || "",
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
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/material-requests/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
          notes: form.notes || null,
        }),
      })
      if (res.ok) navigate("/material-requests")
      else {
        const err = await res.json()
        console.error("Error updating material request:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

  return (
    <div className="container mt-4">
      <h1>Edit Material Request #{id}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="form-select" required>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="form-control" rows="3" />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <Link to="/material-requests" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  )
}
