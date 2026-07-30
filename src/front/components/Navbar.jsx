import { Link } from "react-router-dom"
import { CompanySelector } from "./CompanySelector"

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<Link to="/employees">
					<button type="button" className="btn btn-primary">Employees</button>
				</Link>

				<CompanySelector />

				{/* <div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div> */}
			</div>
		</nav>
	)
}