// import { useState } from "react";
// import { useNavigate, NavLink } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navbar from "./navbar";

// const Signup = () => {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         age: "",
//         contactNumber: "",
//         password: "",
//         confirmPassword: "",
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.id]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (formData.password !== formData.confirmPassword) {
//             toast.error("Passwords do not match!", { autoClose: 2000 });
//             return;
//         }
//         const userData = {
//             firstName: formData.firstName,
//             lastName: formData.lastName,
//             email: formData.email,
//             age: formData.age,
//             contactNo: formData.contactNumber,
//             password: formData.password,
//         };
//         try {
//             const response = await fetch("http://localhost:3000/api/signup", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json", },
//                 body: JSON.stringify(userData),
//             });
//             if (response.ok) navigate(`/login`);
//             else {
//                 const errorData = await response.json();
//                 toast.error(errorData.message || "Signup failed!", { autoClose: 2000 });
//             }
//         }
//         catch {
//             toast.error("An error occurred. Please try again later.", { autoClose: 2000 });
//         }
//     };
//     return (
//         <div className="d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
//             <Navbar />
//             <div className="flex-grow-1 d-flex align-items-center">
//                 <div className="container">
//                     <h1 className="text-center mb-4">Signup</h1>
//                     <form onSubmit={handleSubmit}>
//                         <div className="row justify-content-between mb-3 p-3">
//                             <div className="col-lg-4">
//                                 <label htmlFor="firstName">First Name</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="firstName"
//                                     value={formData.firstName}
//                                     onChange={handleChange}
//                                     placeholder="Enter first name"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-lg-4">
//                                 <label htmlFor="lastName">Last Name</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="lastName"
//                                     value={formData.lastName}
//                                     onChange={handleChange}
//                                     placeholder="Enter last name"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-lg-4">
//                                 <label htmlFor="email">Email</label>
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     id="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="Enter email"
//                                     required
//                                 />
//                             </div>
//                         </div>
//                         <div className="row justify-content-between mb-3 p-3">
//                             <div className="col-lg-4">
//                                 <label htmlFor="age">Age</label>
//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     id="age"
//                                     value={formData.age}
//                                     onChange={handleChange}
//                                     placeholder="Enter age"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-lg-4">
//                                 <label htmlFor="contactNumber">Contact Number</label>
//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     id="contactNumber"
//                                     value={formData.contactNumber}
//                                     onChange={handleChange}
//                                     placeholder="Enter contact number"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-lg-4">
//                                 <label htmlFor="password">Password</label>
//                                 <input
//                                     type="password"
//                                     className="form-control"
//                                     id="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     placeholder="Enter password"
//                                     required
//                                 />
//                             </div>
//                         </div>
//                         <div className="row justify-content-between mb-3 p-3">
//                             <div className="col-lg-4">
//                                 <label htmlFor="confirmPassword">Confirm Password</label>
//                                 <input
//                                     type="password"
//                                     className="form-control"
//                                     id="confirmPassword"
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     placeholder="Confirm password"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-lg-4 d-flex align-items-end">
//                                 <button type="submit" className="btn btn-primary w-100">
//                                     Submit
//                                 </button>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//             <div className="bg-dark text-white text-center p-3 pb-1">
//                 <p>
//                     Already have an account?{" "}
//                     <NavLink to="/login" style={{ color: "yellow" }}>
//                         Login
//                     </NavLink>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Signup

import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        age: "20", // Default age set to 20
        contactNumber: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === "contactNumber" && value < 0) return; // Prevent negative contact number

        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!", { autoClose: 2000 });
            return;
        }
        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            age: formData.age,
            contactNo: formData.contactNumber,
            password: formData.password,
        };
        try {
            const response = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            if (response.ok) navigate(`/login`);
            else {
                const errorData = await response.json();
                toast.error(errorData.message || "Signup failed!", { autoClose: 2000 });
            }
        } catch {
            toast.error("An error occurred. Please try again later.", { autoClose: 2000 });
        }
    };

    return (
        <div className="d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center">
                <div className="container">
                    <h1 className="text-center mb-4">Signup</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-4">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                        </div>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-4">
                                <label htmlFor="age">Age</label>
                                <select
                                    id="age"
                                    className="form-select"
                                    value={formData.age}
                                    onChange={handleChange}
                                    size="1" // Shows 10 elements at a time with scrolling
                                >
                                    {[...Array(150).keys()].map((num) => (
                                        <option key={num + 1} value={num + 1}>
                                            {num + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="contactNumber">Contact Number</label>
                                {/* <input
                                    type="number"
                                    className="form-control"
                                    id="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                    min="0"
                                    required
                                /> */}
                                <input
                                    type="text"
                                    className="form-control"
                                    id="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                    pattern="[0-9]*" // Allows only numbers
                                    inputMode="numeric" // Optimizes mobile keyboard for numbers
                                    required
                                />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-4">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>
                            <div className="col-lg-4 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="bg-dark text-white text-center p-3 pb-1">
                <p>
                    Already have an account?{" "}
                    <NavLink to="/login" style={{ color: "yellow" }}>
                        Login
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Signup;
