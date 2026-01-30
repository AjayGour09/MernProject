import React from "react";
import { Bs0Circle } from "react-icons/bs";
import { BsAndroid2 } from "react-icons/bs";
import { BsAlipay } from "react-icons/bs";
import { RiExchangeFundsFill } from "react-icons/ri";
import { VscDebugConsole } from "react-icons/vsc";
import { CiBitcoin } from "react-icons/ci";

const CreateTicket = () => {
  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <h4 style={{ marginBottom: "30px" }}>
        To create a Ticket, select a relevent topic{" "}
      </h4>
      <div className="row">
        <div className="col-4 mt-3">
          <h5>
            {" "}
            <Bs0Circle className="me-2 mb-1" />
            Account Opening
          </h5>
          <p className="text-primary mt-3">Online account opening</p>
          <p className="text-primary">Ofline account opening</p>
          <p className="text-primary">
            Company Partnerships and HUF account opening{" "}
          </p>
          <p className="text-primary">NRI account opening</p>
          <p className="text-primary">Charges at Zerodha</p>
          <p className="text-primary">
            Zerodha IDFC FIRST Bank 3-in-1 Account{" "}
          </p>
          <p className="text-primary">Getting Started</p>
        </div>
        <div className="col-4 mt-3">
          <h5>
            <BsAndroid2 className="me-2 mb-1"/>Your Zerodha Account
          </h5>
          <p className="text-primary mt-3">Login Credentials</p>
          <p className="text-primary">
            Account modification and segment addition{" "}
          </p>
          <p className="text-primary">DP ID and Bank deatails </p>
          <p className="text-primary">Your Profile</p>
          <p className="text-primary">Transfer and conversation of shares</p>
          <p className="text-primary">
            Zerodha IDFC FIRST Bank 3-in-1 Account{" "}
          </p>
          <p className="text-primary">Getting Started</p>
        </div>
        <div className="col-4 mt-3">
          <h5> <BsAlipay className="me-2 mb-1"/>Your Zerodha account </h5>
          <p className="text-primary mt-3">
            margins/laverges, Product and order types
          </p>
          <p className="text-primary">Kite web and application </p>
          <p className="text-primary">Trading FAQs </p>
          <p className="text-primary">Corporate actions</p>
          <p className="text-primary">Sentinel</p>
          <p className="text-primary">Kite Api</p>
          <p className="text-primary">pi and other platform </p>
          <p className="text-primary">stokereports+</p>
          <p className="text-primary">GTT</p>
        </div>
        <div className="col-4 mt-3">
          <h5> <RiExchangeFundsFill className="me-2 mb-1" />
Funds</h5>
          <p className="text-primary mt-3">Adding funds</p>
          <p className="text-primary">Funds Withdrawal</p>
          <p className="text-primary">
           eMandates
          </p>
          <p className="text-primary">adding bank account</p>
        </div>
        <div className="col-4 mt-3">
          <h5><VscDebugConsole className="me-2 mb-1"/>Reports</h5>
          <p className="text-primary mt-3">Ladger</p>
          <p className="text-primary">
            Portofolio
          </p>
          <p className="text-primary">60 Day challenge </p>
          <p className="text-primary">IPO</p>
          <p className="text-primary">Refferal program</p>
        
        </div>
        <div className="col-4 mt-3">
          <h5><CiBitcoin className="me-2 mb-1"/>Coin</h5>
          <p className="text-primary mt-3">
            Understanding mutual funds 
          </p>
          <p className="text-primary">About coin </p>
          <p className="text-primary">Trading FAQs </p>
          <p className="text-primary">Buying and selling</p>
          <p className="text-primary">Starting sip</p>
          <p className="text-primary">coin app</p>
          
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
