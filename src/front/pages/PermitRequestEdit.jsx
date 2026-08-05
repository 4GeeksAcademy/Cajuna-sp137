import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export const PermitRequestEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: "",
    status: "",
  })

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/permit-requests/" + id)
      .then(res => {
        if (!res.ok) throw new Error("Permit request not found")
        return res.json()
      })
      .then(data => setForm({
        start_date: data.start_date,
        end_date: data.end_date,
        reason: data.reason || "",
        status: data.status,
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
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/permit-requests/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: form.start_date,
          end_date: form.end_date,
          reason: form.reason,
          status: form.status,
        }),
      })
      if (res.ok) navigate("/permit-requests")
      else {
        const err = await res.json()
        console.error("Error updating permit request:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

  return (
    <div className="container mt-4">
      <h1>Edit Permit Request #{id}</h1>
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
          <label className="form-label">Start Date</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} className="form-control" rows="3" required />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <Link to="/permit-requests" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  )
}
