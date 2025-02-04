import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Navbar from "./navbar";

const Delivery = () => {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});
    const currentUser = localStorage.getItem("currentUser");
    const fetchOrders = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/orders");
            if (response.ok) {
                const data = await response.json();
                const incompleteOrders = data.filter(order => order.items.some(item => item.seller === currentUser && item.status !== "Delivered"));
                setOrders(incompleteOrders);
            }
            else toast.error("Failed to fetch orders, pls try again", { autoClose: 2000 });
        }
        catch {
            toast.error("An error occurred while fetching orders, pls try again", { autoClose: 2000 });
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentUser]);

    const handleOtpVerification = async (orderNumber, itemIndex, orderOtp) => {
        if (otpInputs[itemIndex] === orderOtp) {
            const updatedOrders = [...orders];
            const orderIndex = updatedOrders.findIndex(order => order.orderNumber === orderNumber);
            if (orderIndex !== -1) {
                const order = updatedOrders[orderIndex];
                const item = order.items[itemIndex];
                item.status = "Delivered";
                setOrders(updatedOrders);
                await updateOrderStatus(orderNumber, "Delivered", itemIndex);
                toast.success(`Item ${item.name} marked as Delivered!`, { autoClose: 2000 });
                const sellerItems = order.items.filter(item => item.seller === currentUser);
                const allDelivered = sellerItems.every(item => item.status === "Delivered");
                if (allDelivered) {
                    await updateOrderStatus(orderNumber, "Delivered", null);
                    toast.success(`Order ${orderNumber} marked as Delivered!`, { autoClose: 2000 });
                    await fetchOrders();
                }
            }
        }
        else toast.error("Incorrect OTP, pls try again", { autoClose: 2000 });
    };

    const updateOrderStatus = async (orderNumber, status, itemIndex) => {
        try {
            const response = await fetch("http://localhost:3000/api/updateOrderStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderNumber,
                    status,
                    itemIndex
                })
            });
            if (!response.ok) throw new Error("Failed to update order status.");
        }
        catch (error) {
            toast.error(error.message, { autoClose: 2000 });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "bg-success text-white";
            case "pending": return "bg-warning text-dark";
            default: return "bg-secondary text-white";
        }
    };

    const handleOtpChange = (index, value) => { setOtpInputs(prev => ({ ...prev, [index]: value })) };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container mt-4 flex-grow-1">
                <h1 className="mb-4">Delivery</h1>
                {orders.length === 0 ? (<p>No orders to deliver.</p>) : (
                    <div className="row">
                        {orders.map(order => (
                            <div className="col-md-12 mb-4" key={order.orderNumber}>
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-3">
                                            <h5 className="card-title">Order Number: {order.orderNumber}</h5>
                                        </div>
                                        <div className="order-details">
                                            {order.items.map((item, index) =>
                                                item.seller === currentUser && item.status !== "Delivered" && (
                                                    <div key={index} className="mb-2">
                                                        <strong>Item Name:</strong> {item.name} <br />
                                                        <strong>Buyer:</strong> {item.buyer} <br />
                                                        <strong>Price:</strong> ${item.price} <br />
                                                        <strong>Status:</strong>
                                                        <span className={`badge ${getStatusColor(item.status)} p-2`}> {item.status} </span> <br />
                                                        <strong>Order Number:</strong> {order.orderNumber} <br />
                                                        {item.status !== "Delivered" && (
                                                            <div className="mt-2">
                                                                <input type="text" className="form-control" placeholder="Enter OTP" value={otpInputs[index] || ""} onChange={(e) => handleOtpChange(index, e.target.value)} />
                                                                <button className="btn btn-primary mt-2" onClick={() => handleOtpVerification(order.orderNumber, index, order.otp)}> Check OTP </button>
                                                            </div>
                                                        )}
                                                        <hr />
                                                    </div>
                                                )
                                            )}
                                        </div>
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

export default Delivery;
