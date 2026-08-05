import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

const toLocalInputValue = (iso) => {
    if (!iso) return ""
    const d = new Date(iso)
    const pad = (n) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const TimeEntryEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    check_out: "",
  })

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries/" + id)
      .then(res => {
        if (!res.ok) throw new Error("Time entry not found")
        return res.json()
      })
      .then(data => setForm({
        check_out: toLocalInputValue(data.check_out),
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
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/time_entries/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          check_out: form.check_out ? new Date(form.check_out).toISOString() : null,
        }),
      })
      if (res.ok) navigate("/time-entries")
      else {
        const err = await res.json()
        console.error("Error updating time entry:", err)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>

  return (
    <div className="container mt-4">
      <h1>Edit Time Entry #{id}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Check-out</label>
          <input
            type="datetime-local"
            name="check_out"
            value={form.check_out}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <Link to="/time-entries" className="btn btn-secondary ms-2">Cancel</Link>
      </form>
    </div>
  )
}
