import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Navbar from "./navbar";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const currentUser = localStorage.getItem("currentUser");
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/orders");
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
                else toast.error("Failed to fetch orders, pls try again", { autoClose: 2000 });
            }
            catch {
                toast.error("An error occurred while fetching orders, pls try again", { autoClose: 2000 });
            }
        };
        fetchOrders();
    }, [currentUser]);

    const buyerOrders = orders.filter(order => order.buyer === currentUser);
    const soldItems = orders.flatMap(order => order.items.filter(item => item.seller === currentUser).map(item => ({
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        otp: order.otp,
        ...item
    }))
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-success text-white';
            case 'pending': return 'bg-warning text-dark';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container mt-4">
                <h1 className="mb-4">Your Orders</h1>
                {buyerOrders.length === 0 ? (<p>No orders found.</p>) : (
                    <div>
                        <h3>Orders as Buyer</h3>
                        {buyerOrders.map(order => (
                            <div className="card shadow-sm mb-4" key={order.orderNumber}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-3">
                                        <h5 className="card-title">Order Number: {order.orderNumber}</h5>
                                        <span className={`badge ${getStatusColor(order.status)} p-2`}>{order.status}</span>
                                    </div>
                                    <div className="order-details">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="mb-2">
                                                <strong>Item Name:</strong> {item.name}<br />
                                                <strong>Item Price:</strong> ${item.price}<br />
                                                <strong>Seller:</strong> {item.seller}<br />
                                                <strong>Status:</strong> {item.status}<br />
                                                <hr />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3"> <strong>OTP:</strong> {order.otp} </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <hr />
                <h3>Sold Items</h3>
                {soldItems.length === 0 ? (<p>No sold items.</p>) : (
                    <div>
                        {soldItems.map((item, index) => (
                            <div className="card shadow-sm mb-4" key={index}>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <h5 className="card-title">Order Number: {item.orderNumber}</h5>
                                        <h5 className="card-title">Item Name: {item.name}</h5>
                                        <span className={`badge ${getStatusColor(item.status)} p-2`}>{item.orderStatus}</span> <br />
                                        <strong>Item Price:</strong> ${item.price}<br />
                                        <strong>Buyer:</strong> {item.buyer}<br />
                                        <strong>Status:</strong> {item.status}<br />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bg-dark text-white text-center p-3 pb-1 mt-auto"> <p> <NavLink to="/" style={{ color: "ivory", borderRadius: "5px" }}> Go back to Home </NavLink> </p> </div>
        </div>
    );
};

export default Orders;
