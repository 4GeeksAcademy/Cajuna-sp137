import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

const STATUS_BADGE = {
  pendiente: "bg-warning",
  aprobado: "bg-success",
  rechazado: "bg-danger"
}

export const PermitRequestDetail = () => {
    const { id } = useParams()
    const [req, setReq] = useState(null)
    const [loading, setLoading] = useState(true)
    const [draftStatus, setDraftStatus] = useState(null)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/permit-requests/" + id)
            .then(res => {
                if (!res.ok) throw new Error("Permit request not found")
                return res.json()
            })
            .then(data => setReq(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    const changed = draftStatus !== null && draftStatus !== req?.status

    const handleSave = async () => {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/permit-requests/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: draftStatus }),
      })
      if (!res.ok) return
      setReq(prev => ({ ...prev, status: draftStatus }))
      setDraftStatus(null)
    }

    const handleCancel = () => setDraftStatus(null)

    if (loading) return <div className="container mt-4"><div className="spinner-border" role="status" /></div>
    if (!req) return <div className="container mt-4"><h2>Permit request not found</h2><Link to="/permit-requests">Back to list</Link></div>

    return (
        <div className="container mt-4">
            <h1>Permit Request #{req.id}</h1>
            <div className="card mb-3">
                <div className="card-body">
                    <dl className="row">
                        <dt className="col-sm-3">ID</dt>
                        <dd className="col-sm-9">{req.id}</dd>

                        <dt className="col-sm-3">Status</dt>
                        <dd className="col-sm-9">
                          <div className="d-flex align-items-center gap-2">
                            <span className={`badge ${STATUS_BADGE[draftStatus ?? req.status] || "bg-secondary"}`}>
                              {draftStatus ?? req.status}
                            </span>
                            <select
                              className="form-select form-select-sm w-auto"
                              value={draftStatus ?? req.status}
                              onChange={e => setDraftStatus(e.target.value)}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="aprobado">Aprobado</option>
                              <option value="rechazado">Rechazado</option>
                            </select>
                            {changed && (
                              <>
                                <button className="btn btn-sm btn-primary" onClick={handleSave}>Save</button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                              </>
                            )}
                          </div>
                        </dd>

                        <dt className="col-sm-3">Employee</dt>
                        <dd className="col-sm-9">{req.employee_name}</dd>

                        <dt className="col-sm-3">Start Date</dt>
                        <dd className="col-sm-9">{new Date(req.start_date).toLocaleDateString()}</dd>

                        <dt className="col-sm-3">End Date</dt>
                        <dd className="col-sm-9">{new Date(req.end_date).toLocaleDateString()}</dd>

                        <dt className="col-sm-3">Reason</dt>
                        <dd className="col-sm-9">{req.reason || "—"}</dd>
                    </dl>
                </div>
            </div>

            <div className="mt-3">
                <Link to="/permit-requests" className="btn btn-secondary">Back to list</Link>
                <Link to={`/permit-requests/${req.id}/edit`} className="btn btn-warning ms-2">Edit</Link>
                <Link to={`/permit-requests/${req.id}/delete`} className="btn btn-danger ms-2">Delete</Link>
            </div>
        </div>
    )
}
