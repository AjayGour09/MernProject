import React from "react";
import { Bs0Circle, BsAndroid2, BsAlipay } from "react-icons/bs";
import { RiExchangeFundsFill } from "react-icons/ri";
import { VscDebugConsole } from "react-icons/vsc";
import { CiBitcoin } from "react-icons/ci";

const CreateTicket = () => {
  const ticketTopics = [
    {
      icon: <Bs0Circle className="me-2 mb-1" />,
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
      icon: <BsAndroid2 className="me-2 mb-1" />,
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
      icon: <BsAlipay className="me-2 mb-1" />,
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
      icon: <RiExchangeFundsFill className="me-2 mb-1" />,
      title: "Funds",
      items: ["Adding Funds", "Funds Withdrawal", "eMandates", "Adding Bank Account"],
    },
    {
      icon: <VscDebugConsole className="me-2 mb-1" />,
      title: "Reports",
      items: ["Ledger", "Portfolio", "60 Day Challenge", "IPO", "Referral Program"],
    },
    {
      icon: <CiBitcoin className="me-2 mb-1" />,
      title: "Coin",
      items: ["Understanding Mutual Funds", "About Coin", "Trading FAQs", "Buying & Selling", "Starting SIP", "Coin App"],
    },
  ];

  return (
    <div className="container mt-5">
      <h4 className="mb-4">To create a Ticket, select a relevant topic</h4>
      <div className="row">
        {ticketTopics.map((topic, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-md-4 mt-3">
            <h5>
              {topic.icon} {topic.title}
            </h5>
            {topic.items.map((item, i) => (
              <p key={i} className="text-primary mb-1 hover-text cursor-pointer">
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateTicket;
