import Navbar from "./navbar"
import { NavLink } from "react-router-dom";

const Error = () => {
    return (
        <>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', height: '100%' }}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="error-template" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h1>404 Error</h1>
                                <div className="error-details"> The requested page was not found! </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-dark text-white text-center p-3 pb-1 mt-auto"> <p> <NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}> Go back to Home </NavLink> </p> </div>
            </div>
        </>
    )
}

export default Error