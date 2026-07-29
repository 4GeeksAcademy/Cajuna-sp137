import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const EmployeeCreate = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) navigate("/employees")
      else {
        const err = await res.json()
        console.error("Error creating employee:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="container mt-4">
      <h1>New Employee</h1>
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
          <label className="form-label">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Create</button>
        <Link to="/employees" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  )
}
