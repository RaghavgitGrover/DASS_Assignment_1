import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from 'react-google-recaptcha';
import Navbar from "./navbar";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !captchaValue) {
            toast.error("Please enter both email, password, and complete the reCAPTCHA.", { autoClose: 2000 });
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.text();
            if (response.ok) {
                localStorage.setItem("currentUser", email);
                navigate("/profile");
                toast.success("Login successful!", { autoClose: 2000 });
            }
            else {
                const errorData = JSON.parse(data);
                toast.error(errorData.message || "Invalid credentials!", { autoClose: 2000 });
            }
        }
        catch {
            toast.error("An error occurred. Please try again later.", { autoClose: 2000 });
        }
    };


    const onCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    return (
        <>
            <Navbar />
            <div
                className="container"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}
            >
                <div className="row">
                    <div className="col-md-12">
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3 p-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Tab") {
                                            if (email.endsWith("@s")) {
                                                e.preventDefault();
                                                setEmail(email.replace(/@s$/, "@students.iiit.ac.in"));
                                            }
                                            else if (email.endsWith("@r")) {
                                                e.preventDefault();
                                                setEmail(email.replace(/@r$/, "@research.iiit.ac.in"));
                                            }
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 p-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <ReCAPTCHA
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={onCaptchaChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary m-3">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-dark text-white text-center p-3 pb-1 mt-4">
                <p>
                    Dont have an account?{" "}
                    <NavLink to="/signup" style={{ color: "ivory", borderRadius: "5px" }}>
                        Register
                    </NavLink>
                </p>
            </div>
        </>
    );
}

export default Login