import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  const { closeBuyWindow } = useContext(GeneralContext);

  const handleBuy = async () => {
    try {
      await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: Number(qty),
        price: Number(price),
        mode: "BUY",
      });

      alert("Order placed successfully");
      closeBuyWindow();
    } catch (err) {
      console.log(err);
      alert("Order failed");
    }
  };

  return (
    <div className="container" id="buy-window">
      {/* HEADER */}
      <div className="header">
        <h3>
          Buy {uid} <span>NSE</span>
        </h3>
        <div className="market-options">
          <label>
            <input type="radio" defaultChecked /> Regular
          </label>
        </div>
      </div>

      {/* TAB */}
      <div className="tab">
        <button>Regular</button>
      </div>

      {/* BODY */}
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <button className="btn btn-blue" onClick={handleBuy}>
            Buy
          </button>
          <button className="btn btn-grey" onClick={closeBuyWindow}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
