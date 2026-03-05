import React, { useId } from "react";

const Brokerage = () => {
  const id = useId();

  const openLink = (url) => window.open(url, "_blank");

  return (
    <section className="container py-5">
      <div className="mb-4">
        <h2 className="fw-semibold mb-1">Charges Explained</h2>
        <p className="text-muted mb-0" style={{ maxWidth: 820 }}>
          Understand the statutory and platform charges that may apply to your trades.
        </p>
      </div>

      <div className="row g-4">
        {/* LEFT CARD */}
        <div className="col-12 col-md-6">
          <div className="p-4 rounded-4 border bg-white shadow-sm h-100">
            <h5 className="fw-semibold mb-3">Exchange & Transaction Charges</h5>

            <div className="accordion" id={`${id}-left`}>
              {/* STT/CTT */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-stt`}
                  >
                    Securities/Commodities Transaction Tax (STT/CTT)
                  </button>
                </h2>
                <div
                  id={`${id}-stt`}
                  className="accordion-collapse collapse show"
                  data-bs-parent={`#${id}-left`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    <p className="mb-2">
                      Tax by the government when transacting on the exchanges. Charged on both
                      buy and sell sides when trading equity delivery. Charged only on selling
                      side when trading intraday or on F&O.
                    </p>
                    <p className="mb-0">
                      STT/CTT can often be more than the brokerage, so it&apos;s important to keep
                      a tab.
                    </p>
                  </div>
                </div>
              </div>

              {/* Turnover */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-turnover`}
                  >
                    Transaction / Turnover Charges
                  </button>
                </h2>
                <div
                  id={`${id}-turnover`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-left`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    <ul className="mb-0">
                      <li>
                        Charged by exchanges (NSE, BSE, MCX) on the value of your transactions.
                      </li>
                      <li>
                        BSE revises charges for various groups (XC, XD, SS, ST, etc.) at flat rates.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Call & Trade */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-calltrade`}
                  >
                    Call & Trade
                  </button>
                </h2>
                <div
                  id={`${id}-calltrade`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-left`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    ₹50 per order for dealer-placed orders including auto square off.
                  </div>
                </div>
              </div>

              {/* Stamp */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-stamp`}
                  >
                    Stamp Charges
                  </button>
                </h2>
                <div
                  id={`${id}-stamp`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-left`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    Charged by Government of India as per Indian Stamp Act 1899.
                  </div>
                </div>
              </div>

              {/* NRI */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-nri`}
                  >
                    NRI Brokerage Charges
                  </button>
                </h2>
                <div
                  id={`${id}-nri`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-left`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    <ul className="mb-0">
                      <li>Non-PIS: 0.5% or ₹50 per order (whichever is lower)</li>
                      <li>PIS: 0.5% or ₹200 per order (whichever is lower)</li>
                      <li>₹500 + GST yearly AMC</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="col-12 col-md-6">
          <div className="p-4 rounded-4 border bg-white shadow-sm h-100">
            <h5 className="fw-semibold mb-3">Regulatory & Account Charges</h5>

            <div className="accordion" id={`${id}-right`}>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-gst`}
                  >
                    GST
                  </button>
                </h2>
                <div
                  id={`${id}-gst`}
                  className="accordion-collapse collapse show"
                  data-bs-parent={`#${id}-right`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    18% of (brokerage + SEBI charges + transaction charges)
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-sebi`}
                  >
                    SEBI Charges
                  </button>
                </h2>
                <div
                  id={`${id}-sebi`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-right`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    ₹10 per crore + GST by SEBI.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-dp`}
                  >
                    DP (Depository Participant) Charges
                  </button>
                </h2>
                <div
                  id={`${id}-dp`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-right`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    ₹15.34 per scrip (CDSL + Zerodha + GST)
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-pledge`}
                  >
                    Pledging Charges
                  </button>
                </h2>
                <div
                  id={`${id}-pledge`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-right`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    ₹30 + GST per pledge per ISIN.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${id}-amc`}
                  >
                    AMC (Account Maintenance Charges)
                  </button>
                </h2>
                <div
                  id={`${id}-amc`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#${id}-right`}
                >
                  <div className="accordion-body text-muted" style={{ lineHeight: 1.8 }}>
                    <p className="mb-2">
                      BSDA demat: Zero charges if holding ₹4,00,000.{" "}
                      <span
                        className="text-primary fw-semibold"
                        style={{ cursor: "pointer" }}
                        onClick={() => openLink("https://zerodha.com/z-connect/") }
                      >
                        Click here
                      </span>
                    </p>
                    <p className="mb-0">
                      Non-BSDA: ₹300/year + 18% GST, charged quarterly.{" "}
                      <span
                        className="text-primary fw-semibold"
                        style={{ cursor: "pointer" }}
                        onClick={() => openLink("https://zerodha.com/z-connect/")}
                      >
                        Click here
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="mt-5 p-4 rounded-4 border bg-light">
        <h5 className="fw-semibold mb-2">Disclaimer</h5>
        <p className="text-muted mb-0" style={{ lineHeight: 1.8, fontSize: 14 }}>
          For Delivery based trades, a minimum of ₹0.01 will be charged per contract note.
          Clients who opt for physical contract notes will be charged ₹20 + courier charges.
          Brokerage will not exceed SEBI rates. All statutory charges levied at actuals.
          Free investments only for retail clients. Companies, Trusts, HUFs pay 0.1% or ₹20
          (whichever is less). For physically settled contracts, 0.25% contract value brokerage.
        </p>
      </div>
    </section>
  );
};

export default Brokerage;