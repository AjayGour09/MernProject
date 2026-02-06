import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3002/allOrders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuyAgain = async (order) => {
    try {
      await axios.post("http://localhost:3002/newOrder", {
        name: order.name,
        qty: order.qty,
        price: order.price,
        mode: "BUY",
      });

      alert("Order placed again");
      fetchOrders(); // refresh orders
    } catch (err) {
      alert("Buy failed");
    }
  };

  if (orders.length === 0) {
    return <p>You haven't placed any orders</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order._id}>
          <p>
            <b>{order.name}</b> | Qty: {order.qty} | ₹{order.price} |{" "}
            {order.mode}
          </p>

          {/* ✅ BUY NOW BUTTON */}
          <button onClick={() => handleBuyAgain(order)}>
            Buy Now
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default Orders;
