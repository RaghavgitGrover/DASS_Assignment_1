import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar";

const RECAPTCHA_SITE_KEY = "6Ld6vMsqAAAAAAg-JzZ_UPHG9M6eaOtqRalcFvvX";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password", { autoClose: 2000 });
            return;
        }
        try {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'login' })
                    .then(async (token) => {
                        const response = await fetch("http://localhost:3000/api/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email,
                                password,
                                recaptchaToken: token
                            }),
                        });
                        const data = await response.json();
                        if (response.ok) {
                            localStorage.setItem("currentUser", email);
                            navigate("/profile");
                            toast.success("Login successful!", { autoClose: 2000 });
                        }
                        else toast.error(data.error || "Login failed, pls try again", { autoClose: 2000 });
                    });
            });
        }
        catch (error) {
            console.error("An error occured in login:", error);
            toast.error("An error occurred, pls try again", { autoClose: 2000 });
        }
    };
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="row w-100">
                    <div className="col-md-6 mx-auto">
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <h1 className="text-center mb-4">Login</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="d-grid"> <button type="submit" className="btn btn-primary">Submit</button> </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-dark text-white text-center py-3 mt-auto w-100"> <p className="mb-0"> Dont have an account?{" "} <NavLink to="/signup" className="text-light"> Register </NavLink> </p> </footer>
        </div>
    );

};

export default Login;