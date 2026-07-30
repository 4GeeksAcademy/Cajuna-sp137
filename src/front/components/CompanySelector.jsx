import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const CompanySelector = () => {
    const { store, dispatch } = useGlobalReducer()

    useEffect(() => {
        async function loadCompanies() {
            try {
                const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/companies")
                const data = await res.json()
                dispatch({ type: "set_companies", payload: data })
            } catch (err) {
                console.error("Error fetching companies:", err)
            }
        }
        loadCompanies()
    }, [])

    const handleChange = (e) => {
        const company = store.companies.find(c => c.id === Number(e.target.value))
        dispatch({ type: "set_company", payload: company || null })
    }

    return (
        <select
            className="form-select"
            style={{ width: "auto" }}
            value={store.selectedCompany?.id || ""}
            onChange={handleChange}
            disabled={store.companies.length === 0}
        >
            <option value="" disabled>
                {store.companies.length === 0 ? "No companies available" : "-- Select company --"}
            </option>
            {store.companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
    )
}
