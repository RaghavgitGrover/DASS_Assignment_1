import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar";
import { NavLink } from "react-router-dom";

const Sell = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
    });
    const currentUser = localStorage.getItem("currentUser");
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const itemData = {
            ...formData,
            seller: currentUser,
        };
        try {
            const response = await fetch("http://localhost:3000/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(itemData),
            });
            if (response.ok) {
                toast.success("Item added successfully!", { autoClose: 2000 });
                setFormData({
                    name: "",
                    price: "",
                    description: "",
                    category: "",
                });
            }
            else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to add the item.", { autoClose: 2000 });
            }
        }
        catch {
            toast.error("An error occurred. Please try again later.", { autoClose: 2000 });
        }
    };

    return (
        <div className="d-flex flex-column justify-content-between min-vh-100" style={{ minHeight: "100vh" }}>
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center">
                <div className="container">
                    <h1 className="text-center mb-4">Sell an Item</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-6">
                                <label htmlFor="name">Item Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter item name"
                                    required
                                />
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter item price"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-6">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter item description"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="col-lg-6">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="Enter item category"
                                    required
                                />
                            </div>
                        </div>
                        <div className="row justify-content-between mb-3 p-3">
                            <div className="col-lg-6">
                                <label htmlFor="seller">Seller</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="seller"
                                    value={currentUser || "N/A"}
                                    readOnly
                                />
                            </div>
                            <div className="col-lg-6 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="bg-dark text-white text-center p-3 pb-1 mt-auto">
                <p>
                    <NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}>
                        Go back to Home
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Sell