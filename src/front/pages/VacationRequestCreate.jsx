import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const VacationRequestCreate = () => {
  const navigate = useNavigate()
  const { store } = useGlobalReducer()
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    employee_id: "",
    start_date: "",
    end_date: "",
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
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/vacation-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: Number(form.employee_id),
          start_date: form.start_date,
          end_date: form.end_date,
        }),
      })
      if (res.ok) navigate("/vacation-requests")
      else {
        const err = await res.json()
        console.error("Error creating vacation request:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="container mt-4">
      <h1>New Vacation Request</h1>
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
          <label className="form-label">Start Date</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="form-control" required />
        </div>
        <div>
          <button type="submit" className="btn btn-primary" disabled={!store.selectedCompany}>
            {store.selectedCompany ? "Create" : "Select a company first"}
          </button>
          <Link to="/vacation-requests" className="btn btn-secondary ms-2">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
