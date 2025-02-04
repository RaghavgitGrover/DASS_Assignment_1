import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar";

const Profile = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        contactNo: "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const currentUser = localStorage.getItem("currentUser");
            if (!currentUser) {
                toast.error("You must be logged in to view this page", { autoClose: 2000 });
                navigate("/login");
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/api/profile?currentUser=${currentUser}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        age: data.age,
                        contactNo: data.contactNo,
                    });
                }
                else {
                    toast.error("Failed to fetch profile data", { autoClose: 2000 });
                    navigate("/login");
                }
            }
            catch {
                toast.error("An error occurred while fetching profile data", { autoClose: 2000 });
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.id]: e.target.value }); };
    const handlePasswordChange = (e) => { setPasswordData({ ...passwordData, [e.target.id]: e.target.value }); };

    const validatePasswordData = () => {
        if (passwordData.newPassword || passwordData.confirmPassword || passwordData.oldPassword) {
            if (!passwordData.oldPassword) {
                toast.error("Old password is required to change password", { autoClose: 2000 });
                return false;
            }
            if (!passwordData.newPassword) {
                toast.error("New password is required", { autoClose: 2000 });
                return false;
            }
            if (!passwordData.confirmPassword) {
                toast.error("Please confirm your new password", { autoClose: 2000 });
                return false;
            }
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error("New passwords do not match", { autoClose: 2000 });
                return false;
            }
            return true;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswordData()) return;
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            toast.error("Unauthorized action", { autoClose: 2000 });
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/profile?currentUser=${currentUser}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    ...(passwordData.newPassword && {
                        oldPassword: passwordData.oldPassword,
                        newPassword: passwordData.newPassword,
                    }),
                }),
            });

            if (response.ok) {
                toast.success("Profile updated successfully!", { autoClose: 2000 });
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
            else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update profile", { autoClose: 2000 });
            }
        }
        catch {
            toast.error("An error occurred while updating your profile", { autoClose: 2000 });
        }
    };

    return (
        <div className="d-flex flex-column justify-content-between min-vh-100" style={{ minHeight: "100vh" }}>
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center">
                <div className="container">
                    <h1 className="text-center mb-4">Your Profile</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-4">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" value={formData.email} readOnly />
                            </div>
                        </div>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-4">
                                <label htmlFor="age">Age</label>
                                <input type="number" className="form-control" id="age" value={formData.age} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="contactNo">Contact Number</label>
                                <input type="text" className="form-control" id="contactNo" value={formData.contactNo} onChange={handleChange} pattern="[0-9]*" inputMode="numeric" required />
                            </div>
                        </div>
                        <h3 className="text-center mt-4">Change Password</h3>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-4">
                                <label htmlFor="oldPassword">Old Password</label>
                                <input type="password" className="form-control" id="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} placeholder="Enter Old Password" />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="newPassword">New Password</label>
                                <input type="password" className="form-control" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Enter New Password" />
                            </div>
                            <div className="col-lg-4">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input type="password" className="form-control" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Enter New Password" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                    </form>
                </div>
            </div>
            <div className="bg-dark text-white text-center p-3 pb-1 mt-auto"> <p> <NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}>Go back to Home</NavLink> </p> </div>
        </div>
    );
};

export default Profile;