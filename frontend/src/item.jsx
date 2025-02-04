import { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./navbar";

const Item = () => {
    const { name, seller } = useParams();
    const [item, setItem] = useState(null);
    const currentUser = localStorage.getItem("currentUser");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/item?name=${encodeURIComponent(name)}&seller=${encodeURIComponent(seller)}`);
                if (response.ok) {
                    const data = await response.json();
                    setItem(data);
                }
                else toast.error("Item not found, pls try again", { autoClose: 2000 });
            }
            catch {
                toast.error("Error fetching item details, pls try again", { autoClose: 2000 });
            }
        };
        fetchItem();
    }, [name, seller]);

    const addToCart = () => {
        if (!item) return;
        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        cart.push({ buyer: currentUser, name: item.name, seller: item.seller, price: item.price });
        localStorage.setItem("cartItems", JSON.stringify(cart));
        toast.success("Item added to cart!", { autoClose: 2000 });
    };

    if (!item) return <p>Loading...</p>;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container mt-4">
                <h1 className="mb-4">{item.name}</h1>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Seller:</strong> {item.seller}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <div className="mt-3">
                    <button className="btn btn-success" onClick={addToCart}>Add to Cart</button>
                    <button className="btn btn-secondary m-3" onClick={() => navigate("/shop")}>Go Back to Shop</button>
                </div>
            </div>
            <div className="bg-dark text-white text-center p-3 pb-1 mt-auto"> <p><NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}>Go back to Home </NavLink> </p> </div>
        </div>
    );
};

export default Item;
