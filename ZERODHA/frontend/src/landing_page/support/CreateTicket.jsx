import React from "react";
import { Bs0Circle, BsAndroid2, BsAlipay } from "react-icons/bs";
import { RiExchangeFundsFill } from "react-icons/ri";
import { VscDebugConsole } from "react-icons/vsc";
import { CiBitcoin } from "react-icons/ci";

const CreateTicket = () => {

  const ticketTopics = [
    {
      icon: <Bs0Circle size={22} />,
      title: "Account Opening",
      items: [
        "Online account opening",
        "Offline account opening",
        "Company Partnerships & HUF account opening",
        "NRI account opening",
        "Charges at Zerodha",
        "Zerodha IDFC FIRST Bank 3-in-1 Account",
        "Getting Started",
      ],
    },
    {
      icon: <BsAndroid2 size={22} />,
      title: "Your Zerodha Account",
      items: [
        "Login Credentials",
        "Account modification & segment addition",
        "DP ID and Bank details",
        "Your Profile",
        "Transfer & conversion of shares",
        "Zerodha IDFC FIRST Bank 3-in-1 Account",
        "Getting Started",
      ],
    },
    {
      icon: <BsAlipay size={22} />,
      title: "Trading Platforms",
      items: [
        "Margins/Leverages, Product & Order types",
        "Kite Web & Application",
        "Trading FAQs",
        "Corporate actions",
        "Sentinel",
        "Kite API",
        "Pi & other platforms",
        "StockReports+",
        "GTT",
      ],
    },
    {
      icon: <RiExchangeFundsFill size={22} />,
      title: "Funds",
      items: ["Adding Funds", "Funds Withdrawal", "eMandates", "Adding Bank Account"],
    },
    {
      icon: <VscDebugConsole size={22} />,
      title: "Reports",
      items: ["Ledger", "Portfolio", "60 Day Challenge", "IPO", "Referral Program"],
    },
    {
      icon: <CiBitcoin size={22} />,
      title: "Coin",
      items: [
        "Understanding Mutual Funds",
        "About Coin",
        "Trading FAQs",
        "Buying & Selling",
        "Starting SIP",
        "Coin App",
      ],
    },
  ];

  const handleClick = (topic, item) => {
    console.log("Ticket topic:", topic);
    console.log("Selected issue:", item);

    // future: open ticket form / navigate
  };

  return (
    <section className="container py-5">

      <div className="text-center mb-5">
        <h3 className="fw-semibold">Create a Support Ticket</h3>
        <p className="text-muted">
          Select a topic related to your issue and we will help you resolve it.
        </p>
      </div>

      <div className="row g-4">

        {ticketTopics.map((topic, idx) => (

          <div key={idx} className="col-12 col-sm-6 col-lg-4">

            <div
              className="p-4 border rounded-4 shadow-sm h-100"
              style={{ transition: "0.2s ease" }}
            >

              <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                <span className="text-primary">{topic.icon}</span>
                {topic.title}
              </h5>

              {topic.items.map((item, i) => (

                <div
                  key={i}
                  className="text-primary mb-2"
                  style={{ cursor: "pointer", fontSize: "14px" }}
                  onClick={() => handleClick(topic.title, item)}
                >
                  {item}
                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default CreateTicket;