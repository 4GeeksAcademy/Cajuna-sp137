import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const TimeEntryCreate = () => {
  const navigate = useNavigate()
  const { store } = useGlobalReducer()
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    employee_id: "",
    check_in: "",
  })

  useEffect(() => {
    if (!store.selectedCompany) return
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/employees?company_id=" + store.selectedCompany.id)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Error loading employees:", err))
  }, [store.selectedCompany?.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: Number(form.employee_id),
          check_in: form.check_in ? new Date(form.check_in).toISOString() : null,
        }),
      })
      if (res.ok) navigate("/time-entries")
      else {
        const err = await res.json()
        console.error("Error creating time entry:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="container mt-4">
      <h1>New Time Entry</h1>
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
          <label className="form-label">Check-in (optional, defaults to now)</label>
          <input
            type="datetime-local"
            name="check_in"
            value={form.check_in}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary" disabled={!store.selectedCompany}>
            {store.selectedCompany ? "Create" : "Select a company first"}
          </button>
          <Link to="/time-entries" className="btn btn-secondary ms-2">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
