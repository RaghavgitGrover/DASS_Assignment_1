import { useEffect, useState } from "react";
import Navbar from "./navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const currentUser = localStorage.getItem("currentUser");
        const cart = storedCartItems.filter(item => item.buyer === currentUser);
        setCartItems(cart);
        const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
        setTotalPrice(total);
    }, []);

    const handlePurchase = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty! Pls add some items before proceeding", { autoClose: 2000 });
            return;
        }
        const currentUser = localStorage.getItem("currentUser");
        const otp = Math.floor(1100000 + Math.random() * 900000).toString();
        const orderNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const orderDetails = {
            orderNumber,
            buyer: currentUser,
            items: cartItems.map(item => ({
                name: item.name,
                buyer: item.buyer,
                seller: item.seller,
                price: item.price,
                status: 'pending',
            })),
            otp,
            status: 'pending',
        };
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails),
            });
            if (!response.ok) throw new Error("Failed to place the order. Please try again.");

            localStorage.removeItem("cartItems");
            setCartItems([]);
            setTotalPrice(0);
            toast.success("Order placed successfully! Visit the orders page to see the generated OTP", { autoClose: 2000 });
        }
        catch (error) {
            toast.error(error.message, { autoClose: 2000 });
        }
    };

    const handleRemoveFromCart = (itemToRemove) => {
        const updatedCartItems = cartItems.filter(item => item !== itemToRemove);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
        const total = updatedCartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0), 0);
        setTotalPrice(total);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container mt-4 flex-grow-1">
                <h1 className="mb-4">Your Cart</h1>
                {cartItems.length === 0 ? (<div className="row"> <div className="col-12"> <p>No items in the cart yet</p> </div> </div>) : (
                    <div className="row">
                        {cartItems.map((item, index) => (
                            <div className="col-lg-4 col-md-6 mb-4" key={index}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text"> <strong>Seller:</strong> {item.seller} </p>
                                        <p className="card-text"> <strong>Price:</strong> ${item.price} </p>
                                    </div>
                                    <div className="card-footer"> <button className="btn btn-danger w-100" onClick={() => handleRemoveFromCart(item)}> Remove from Cart </button> </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4">
                    <h4>Total Price: ${totalPrice && !isNaN(totalPrice) ? totalPrice.toFixed(2) : "0.00"}</h4>
                    <button className="btn btn-primary w-100" onClick={handlePurchase}> Order Now </button>
                </div>
            </div>
            <div className="bg-dark text-white text-center p-3 pb-1 mt-4 mb-0"> <p> <NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}> Go back to Home </NavLink> </p> </div>
        </div>
    );
};

export default Cart