import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

export const EmployeeEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    companyName: "",
  })

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees/" + id)
      .then(res => {
        if (!res.ok) throw new Error("Employee not found")
        return res.json()
      })
      .then(data => setForm({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || "",
        companyName: data.company_name,
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
      const { companyName, ...payload } = form
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) navigate("/employees")
      else {
        const err = await res.json()
        console.error("Error updating employee:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

  return (
    <div className="container mt-4">
      <h1>Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Company</label>
          <input className="form-control" value={form.companyName} disabled />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <Link to="/employees" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  )
}
