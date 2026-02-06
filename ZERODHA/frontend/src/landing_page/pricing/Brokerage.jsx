import React from "react";
 // For small-text & hover-text styles

const Brokerage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-muted fs-3 ms-2 mb-4">Charges Explained</h2>
      <div className="row">
        {/* LEFT COLUMN */}
        <div className="col-12 col-md-6 mb-4">
          <h4 className="fs-5 mb-3">Securities/Commodities transaction tax</h4>
          <p className="small-text">
            Tax by the government when transacting on the exchanges. Charged as above on both buy and sell sides when trading equity delivery. Charged only on selling side when trading intraday or on F&O.
          </p>
          <p className="small-text">
            When trading at Zerodha, STT/CTT can be a lot more than the brokerage we charge. Important to keep a tab.
          </p>

          <h4 className="fs-5 mt-4 mb-2">Transaction/Turnover Charges</h4>
          <ul className="small-text">
            <li>Charged by exchanges (NSE, BSE, MCX) on the value of your transactions.</li>
            <li>BSE revised charges for various groups (XC, XD, SS, ST, etc.) at flat rates.</li>
          </ul>

          <h4 className="fs-5 mt-4">Call & Trade</h4>
          <p className="small-text">₹50 per order for dealer-placed orders including auto square off.</p>

          <h4 className="fs-5 mt-4">Stamp Charges</h4>
          <p className="small-text">Charged by Government of India as per Indian Stamp Act 1899.</p>

          <h4 className="fs-5 mt-4">NRI Brokerage Charges</h4>
          <ul className="small-text">
            <li>Non-PIS: 0.5% or ₹50 per order (whichever is lower)</li>
            <li>PIS: 0.5% or ₹200 per order (whichever is lower)</li>
            <li>₹500 + GST yearly AMC</li>
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-12 col-md-6 mb-4">
          <h4 className="fs-5 mt-4 mb-2">GST</h4>
          <p className="small-text">18% of (brokerage + SEBI charges + transaction charges)</p>

          <h4 className="fs-5 mt-4 mb-2">SEBI Charges</h4>
          <p className="small-text">₹10 per crore + GST by SEBI.</p>

          <h4 className="fs-5 mt-4 mb-2">DP (Depository Participant) Charges</h4>
          <p className="small-text">₹15.34 per scrip (CDSL + Zerodha + GST)</p>

          <h4 className="fs-5 mt-4 mb-2">Pledging Charges</h4>
          <p className="small-text">₹30 + GST per pledge per ISIN.</p>

          <h4 className="fs-5 mt-4 mb-2">AMC (Account Maintenance Charges)</h4>
          <p className="small-text">
            BSDA demat: Zero charges if holding ₹4,00,000. <span className="text-primary hover-text cursor-pointer">Click here</span>
          </p>
          <p className="small-text">
            Non-BSDA: ₹300/year + 18% GST, charged quarterly. <span className="text-primary hover-text cursor-pointer">Click here</span>
          </p>
        </div>
      </div>

      {/* DISCLAIMER */}
      <h4 className="mt-5">Disclaimer</h4>
      <p className="small-text text-muted p-2">
        For Delivery based trades, a minimum of ₹0.01 will be charged per contract note. Clients who opt for physical contract notes will be charged ₹20 + courier charges. Brokerage will not exceed SEBI rates. All statutory charges levied at actuals. Free investments only for retail clients. Companies, Trusts, HUFs pay 0.1% or ₹20 (whichever is less). For physically settled contracts, 0.25% contract value brokerage.
      </p>
    </div>
  );
};

export default Brokerage;
