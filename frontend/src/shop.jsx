import { useEffect, useState } from "react";
import Navbar from "./navbar";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Shop = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const currentUser = localStorage.getItem("currentUser");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/items");
                if (response.ok) {
                    const data = await response.json();
                    const filteredItems = data.filter((item) => item.seller !== currentUser);
                    setItems(filteredItems);
                    const uniqueCategories = [...new Set(filteredItems.map((item) => item.category))];
                    setCategories(uniqueCategories);
                }
                else toast.error("Failed to fetch items.", { autoClose: 2000 });
            }
            catch {
                toast.error("An error occurred while fetching items.", { autoClose: 2000 });
            }
        };
        fetchItems();
    }, [currentUser]);

    const filteredItems = items.filter((item) => {
        const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        return matchesSearch && matchesCategory;
    });

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) => prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]);
    };

    const addToCart = (item) => {
        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        cart.push({ buyer: currentUser, name: item.name, seller: item.seller, price: item.price });
        localStorage.setItem("cartItems", JSON.stringify(cart));
        console.log(cart);
        toast.success("Item added to cart!", { autoClose: 2000 });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container mt-4">
                <h1 className="mb-4">Shop</h1>
                <div className="row mb-4">
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <h5>Filter by Category:</h5>
                        <div className="d-flex flex-wrap">
                            {categories.map((category) => (
                                <div key={category} className="form-check me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    <label className="form-check-label" htmlFor={category}> {category} </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row">
                    {filteredItems.length === 0 ? (
                        <div className="col-12"> <p>No items available to display.</p> </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div className="col-lg-4 col-md-6 mb-4" key={item.name}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text"> <strong>Price:</strong> ${item.price} </p>
                                        <p className="card-text"> <strong>Seller:</strong> {item.seller} </p>
                                        <p className="card-text"> <strong>Category:</strong> {item.category} </p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between">
                                        <NavLink to={`/item/${item.name}/${item.seller}`} className="btn btn-primary"> View Details </NavLink>
                                        <button className="btn btn-success" onClick={() => addToCart(item)}> Add to Cart </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
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

export default Shop