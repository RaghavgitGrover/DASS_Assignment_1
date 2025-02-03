import { NavLink } from "react-router-dom";

const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
};

const Navbar = () => {
    const currentUser = localStorage.getItem('currentUser');
    const hideLoginSignup = currentUser;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    Rolx
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!hideLoginSignup && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">
                                        Login
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/signup">
                                        Signup
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {currentUser && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/profile">
                                        Profile
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/shop">
                                        Shop
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/cart">
                                        Cart
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="nav-link" to="/sell">
                                        Sell
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/orders">
                                        Orders
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/delivery">
                                        Delivery
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/support">
                                        Support
                                    </NavLink>
                                </li>
                                <li>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleLogout}
                                        style={{ padding: '4px', marginTop: '4px' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
