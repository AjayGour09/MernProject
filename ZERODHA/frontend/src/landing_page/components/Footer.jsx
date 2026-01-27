import React from "react";

const Footer = () => {
  return (
    <div className="container " style={{ marginTop: "120px" }}>
      <div className="row">
        <div className="col ms-5 mt-3">
          <img src="media/images/logo.svg" alt="" style={{ width: "50%" }} />
          <p className="mt-3">
            © 2010 - 2025, Zerodha Broking Ltd. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            <a href="" className="text-decoration-none">
              5
            </a>
            <a href="" className="text-decoration-none">
              4
            </a>
            <a href="" className="text-decoration-none">
              8
            </a>
            <a href="" className="text-decoration-none">
              7
            </a>
          </div>
          <div className="d-flex gap-3">
            <a href="" className="text-decoration-none">
              5
            </a>
            <a href="" className="text-decoration-none">
              4
            </a>
            <a href="" className="text-decoration-none">
              8
            </a>
          </div>
        </div>
        <div className="col ms-4">
          <h2 className="mb-4">Account</h2>
          <p>Open demat account</p>
          <p>Minor demat account</p>
          <p>NRI demat account</p>
          <p>Commodity</p>
          <p>Dematerialisation</p>
          <p>Fund transfer</p>
          <p>MTF</p>
          <p>Referral program</p>
        </div>
        <div className="col">
          <h2 className="mb-4">Support</h2>
          <p>Contact us</p>
          <p>Support portal</p>
          <p>How to file a complaint?</p>
          <p>Status of your complaints</p>
          <p>Bulletin</p>
          <p>Circular</p>
          <p>Z-Connect blog</p>
          <p>Downloads</p>
        </div>
        <div className="col">
          <h2 className="mb-3">Company</h2>
          <p>About</p>
          <p>Philosophy</p>
          <p>Press & media</p>
          <p>Careers</p>
          <p>Zerodha Cares (CSR)</p>
          <p>Zerodha.tech</p>
          <p>Open source</p>
        </div>
        <div className="col">
          <h2 className="mb-3">Quick links</h2>
          <p>Upcoming IPOs</p>
          <p>Brokerage charges</p>
          <p>Market holidays</p>
          <p>Economic calendar</p>
          <p>Calculators</p>
          <p>Markets</p>
          <p>Sectors</p>
        </div>
      </div>
      <div className=" mt-5">
        <p className=" text-muted" style={{fontSize:"12px"}}>
          Zerodha Broking Ltd.: Member of NSE, BSE​ &​ MCX – SEBI Registration
          no.: INZ000031633 CDSL/NSDL: Depository services through Zerodha
          Broking Ltd. – SEBI Registration no.: IN-DP-431-2019 Registered
          Address: Zerodha Broking Ltd., #153/154, 4th Cross, Dollars Colony,
          Opp. Clarence Public School, J.P Nagar 4th Phase, Bengaluru - 560078,
          Karnataka, India. For any complaints pertaining to securities broking
          please write to complaints@zerodha.com, for DP related to
          dp@zerodha.com. Please ensure you carefully read the Risk Disclosure
          Document as prescribed by SEBI | ICF
        </p>
        <p style={{fontSize:"12px"}}>
          complaints@zerodha.com, for DP related to dp@zerodha.com. Please
          ensure you carefully read the Risk Disclosure Document as prescribed
          by SEBI | ICF Procedure to file a complaint on SEBI SCORES: Register
          on SCORES portal. Mandatory details for filing complaints on SCORES:
          Name, PAN, Address, Mobile Number, E-mail ID. Benefits: Effective
          Communication, Speedy redressal of the grievances
        </p>
        <p style={{fontSize:"12px"}}>Smart Online Dispute Resolution | Grievances Redressal Mechanism</p>
        <p style={{fontSize:"12px"}}>Investments in securities market are subject to market risks; read all the related documents carefully before investing.</p>
        <p style={{fontSize:"12px"}}>Attention investors: 1) Stock brokers can accept securities as margins from clients only by way of pledge in the depository system w.e.f September 01, 2020. 2) Update your e-mail and phone number with your stock broker / depository participant and receive OTP directly from depository on your e-mail and/or mobile number to create pledge. 3) Check your securities / MF / bonds in the consolidated account statement issued by NSDL/CDSL every month.</p>
        <p style={{fontSize:"12px"}}>India's largest broker based on networth as per NSE. NSE broker factsheet</p>
        < p style={{fontSize:"12px"}}>"Prevent unauthorised transactions in your account. Update your mobile numbers/email IDs with your stock brokers. Receive information of your transactions directly from Exchange on your mobile/email at the end of the day. Issued in the interest of investors. KYC is one time exercise while dealing in securities markets - once KYC is done through a SEBI registered intermediary (broker, DP, Mutual Fund etc.), you need not undergo the same process again when you approach another intermediary." Dear Investor, if you are subscribing to an IPO, there is no need to issue a cheque. Please write the Bank account number and sign the IPO application form to authorize your bank to make payment in case of allotment. In case of non allotment the funds will remain in your bank account. As a business we don't give stock tips, and have not authorized anyone to trade on behalf of others. If you find anyone claiming to be part of Zerodha and offering such services, please create a ticket here.</p>
        <p style={{fontSize:"12px"}}>*Customers availing insurance advisory services offered by Ditto (Tacterial Consulting Private Limited | IRDAI Registered Corporate Agent (Composite) License No CA0738) will not have access to the exchange investor grievance redressal forum, SEBI SCORES/ODR, or arbitration mechanism for such products.</p>
      </div>
      <div className="d-flex gap-3 align-items-center justify-content-center  p-2 border-none shadow">
        <p>NSE </p>
        <p>BSE </p>
        <p>MCX </p>
        <p>Terms & conditions</p>
        <p>Policies & procedures </p>
        <p>Privacy policy</p>
        <p>Disclosure </p>
        <p>For investor's attention</p>
        <p>Investor charter</p>
      </div>
    </div>
  );
};

export default Footer;
