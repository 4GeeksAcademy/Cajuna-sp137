import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const CompanyCreate = () => {
    const navigate = useNavigate()
    const { dispatch } = useGlobalReducer()
    const [form, setForm] = useState({
        name: "",
        tax_id: "",
        phone: "",
        address: "",
        city: "",
        country: "Venezuela",
        admin_first_name: "",
        admin_last_name: "",
        admin_email: "",
        admin_password: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)
        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                const data = await res.json()
                dispatch({ type: "add_company", payload: data.company })
                dispatch({ type: "set_company", payload: data.company })
                navigate("/")
            } else {
                const err = await res.json()
                setError(err.errors?.[0]?.msg || err.message || "Error creating company")
            }
        } catch (error) {
            setError("Network error. Is the server running?")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container mt-4">
            <h1>New Company</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <h5 className="mt-3">Company Details</h5>
                <hr />
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Tax ID</label>
                        <input name="tax_id" value={form.tax_id} onChange={handleChange} className="form-control" required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Country</label>
                        <input name="country" value={form.country} onChange={handleChange} className="form-control" required />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input name="address" value={form.address} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input name="city" value={form.city} onChange={handleChange} className="form-control" />
                </div>

                <h5 className="mt-4">Admin Employee</h5>
                <hr />
                <p className="text-muted small">The first employee is the company admin.</p>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">First Name</label>
                        <input name="admin_first_name" value={form.admin_first_name} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input name="admin_last_name" value={form.admin_last_name} onChange={handleChange} className="form-control" required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input name="admin_email" type="email" value={form.admin_email} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Password</label>
                        <input name="admin_password" type="password" value={form.admin_password} onChange={handleChange} className="form-control" required />
                    </div>
                </div>

                <button type="submit" className="btn btn-success" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Company"}
                </button>
            </form>
        </div>
    )
}
