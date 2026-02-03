import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="container bg-light" style={{ marginTop: "120px" }}>
      <div className="row">
        <div className="col ms-5 mt-4">
          <img src="media/images/logo.svg" alt="" style={{ width: "50%" }} />
          <p className="mt-3">
            © 2010 - 2025, Zerodha Broking Ltd. All rights reserved.
          </p>
          <div className="d-flex gap-4 fs-4 mt-3">
            <a href="" className="text-decoration-none">
             <FaXTwitter />
            </a>
            <a href="" className="text-decoration-none">
             <FaFacebook />
            </a>
            <a href="" className="text-decoration-none">
              <FaInstagram />
            </a>
            <a href="" className="text-decoration-none">
             <FaLinkedinIn />
            </a>
          </div>
          <div className="d-flex gap-3 mt-3 fs-4">
            <a href="" className="text-decoration-none">
              <FaYoutube />
            </a>
            <a href="" className="text-decoration-none">
             <FaWhatsapp />
            </a>
            <a href="" className="text-decoration-none">
             <FaTelegram />
            </a>
          </div>
        </div>
        <div className="col ms-4">
          <h2 className="mb-4 hover-text cursor-pointer">Account</h2>
          <p className="hover-text cursor-pointer">Open demat account</p>
          <p className="hover-text cursor-pointer">Minor demat account</p>
          <p className="hover-text cursor-pointer">NRI demat account</p>
          <p className="hover-text cursor-pointer">Commodity</p>
          <p className="hover-text cursor-pointer">Dematerialisation</p>
          <p className="hover-text cursor-pointer">Fund transfer</p>
          <p className="hover-text cursor-pointer">MTF</p>
          <p className="hover-text cursor-pointer">Referral program</p>
        </div>
        <div className="col">
          <h2 className="mb-4 hover-text cursor-pointer">Support</h2>
          <p className="hover-text cursor-pointer">Contact us</p>
          <p className="hover-text cursor-pointer">Support portal</p>
          <p className="hover-text cursor-pointer">How to file a complaint?</p>
          <p className="hover-text cursor-pointer">Status of your complaints</p>
          <p className="hover-text cursor-pointer">Bulletin</p>
          <p className="hover-text cursor-pointer">Circular</p>
          <p className="hover-text cursor-pointer">Z-Connect blog</p>
          <p className="hover-text cursor-pointer">Downloads</p>
        </div>
        <div className="col">
          <h2 className="mb-4 hover-text cursor-pointer">Company</h2>
          <p className="hover-text cursor-pointer">About</p>
          <p className="hover-text cursor-pointer">Philosophy</p>
          <p className="hover-text cursor-pointer">Press & media</p>
          <p className="hover-text cursor-pointer">Careers</p>
          <p className="hover-text cursor-pointer">Zerodha Cares (CSR)</p>
          <p className="hover-text cursor-pointer">Zerodha.tech</p>
          <p className="hover-text cursor-pointer">Open source</p>
        </div>
        <div className="col">
          <h2 className="mb-3 hover-text cursor-pointer">Quick links</h2>

          <p className="hover-text cursor-pointer">Upcoming IPOs</p>
          <p className="hover-text cursor-pointer">Brokerage charges</p>
          <p className="hover-text cursor-pointer">Market holidays</p>
          <p className="hover-text cursor-pointer">Economic calendar</p>
          <p className="hover-text cursor-pointer">Calculators</p>
          <p className="hover-text cursor-pointer">Markets</p>
          <p className="hover-text cursor-pointer">Sectors</p>
        </div>
      </div>
      <div className=" mt-5">
        <p className=" text-muted" style={{ fontSize: "12px" }}>
          Zerodha Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration
          no.: INZ000031633 CDSL/NSDL: Depository services through Zerodha
          Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Registered
          Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony,
          Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078,
          Karnataka, India. For any complaints pertaining to securities broking
          please write to <span className="text-primary hover-text cursor-pointer">complaints@zerodha.com,</span> for DP related to
          <span className="text-primary hover-text cursor-pointer">dp@zerodha.com.</span> Please ensure you carefully read the Risk Disclosure
          Document as prescribed by SEBI | ICF
        </p>
        <p style={{ fontSize: "12px" }}>
          complaints@zerodha.com, for DP related to dp@zerodha.com. Please
          ensure you carefully read the Risk Disclosure Document as prescribed
          by SEBI | ICF Procedure to file a complaint on <span className="text-primary hover-text cursor-pointer">SEBI SCORES: </span> Register
          on SCORES portal. Mandatory details for filing complaints on SCORES:
          Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective
          Communication, Speedy redressal of the grievances
        </p>
        <p style={{ fontSize: "12px" }} className="text-primary hover-text cursor-pointer">
          Smart Online Dispute Resolution | Grievances Redressal Mechanism
        </p>
        <p style={{ fontSize: "12px" }}>
          Investments in securities market are subject to market risks; read all
          the related documents carefully before investing.
        </p>
        <p style={{ fontSize: "12px" }}>
          Attention investors: 1) Stock brokers can accept securities as margins
          from clients only by way of pledge in the depository system w.e.f
          September 01, 2020. 2) Update your e-mail and phone number with your
          stock broker / depository participant and receive OTP directly from
          depository on your e-mail and/or mobile number to create pledge. 3)
          Check your securities / MF / bonds in the consolidated account
          statement issued by NSDL/CDSL every month.
        </p>
        <p style={{ fontSize: "12px" }}>
          India's largest broker based on networth as per NSE. <span className="text-primary hover-text cursor-pointer">NSE broker
          factsheet</span>
        </p>
        <p style={{ fontSize: "12px" }}>
          "Prevent unauthorised transactions in your account. Update your mobile
          numbers/email IDs with your stock brokers. Receive information of your
          transactions directly from Exchange on your mobile/email at the end of
          the day. Issued in the interest of investors. KYC is one time exercise
          while dealing in securities markets - once KYC is done through a SEBI
          registered intermediary (broker, DP, Mutual Fund etc.), you need not
          undergo the same process again when you approach another
          intermediary." Dear Investor, if you are subscribing to an IPO, there
          is no need to issue a cheque. Please write the Bank account number and
          sign the IPO application form to authorize your bank to make payment
          in case of allotment. In case of non allotment the funds will remain
          in your bank account. As a business we don't give stock tips, and have
          not authorized anyone to trade on behalf of others. If you find anyone
          claiming to be part of Zerodha and offering such services, please
         <span className="text-primary hover-text cursor-pointer"> create a ticket here.</span>
        </p>
        <p style={{ fontSize: "12px" }}>
          *Customers availing insurance advisory services offered by Ditto
          (Tacterial Consulting Private Limited | IRDAI Registered Corporate
          Agent (Composite) License No CA0738) will not have access to the
          exchange investor grievance redressal forum, SEBI SCORES/ODR, or
          arbitration mechanism for such products.
        </p>
      </div>
      <div className="d-flex gap-3 align-items-center justify-content-center  p-2 border-none bg-light shadow-sm text-muted mt-2">
        <p className="hover-text cursor-pointer">NSE </p>
        <p className="hover-text cursor-pointer">BSE </p>
        <p className="hover-text cursor-pointer">MCX </p>
        <p className="hover-text cursor-pointer">Terms & conditions</p>
        <p className="hover-text cursor-pointer">Policies & procedures </p>
        <p className="hover-text cursor-pointer">Privacy policy</p>
        <p className="hover-text cursor-pointer">Disclosure </p>
        <p className="hover-text cursor-pointer">For investor's attention</p>
        <p className="hover-text cursor-pointer">Investor charter</p>
      </div>
    </div>
  );
};

export default Footer;
