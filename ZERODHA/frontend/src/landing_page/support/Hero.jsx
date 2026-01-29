import React from "react";

const Hero = () => {
  return (
    <div className="container bg-primary p-5 text-white mt-5">
      <div className="row">
        <div className="col-6">
          <h5 className="ms-3 mb-3">Support Portal</h5>
          <h4 className="ms-3 mt-2 mb-3" style={{fontSize:"16px"}}>
            Search for an answer or browse help topics to create a ticket{" "}
          </h4>
          <input
            type="text"
            name=""
            id=""
            placeholder="Eg:How do i activate F&Q, why is my order getting rejected."
            className="w-75 h-25 p-4 m-2 border rounded border-rounded-xl mb-3"
          />
          <div className="d-flex gap-3 ms-3 mt-3">
            <a href="" className="text-white text-muted" style={{fontSize:"14px"}}>
              Track account opening
            </a>
            <a href="" className="text-white text-muted" style={{fontSize:"14px"}}>
              Track segment activation{" "}
            </a>
            <a href="" className="text-white text-muted" style={{fontSize:"14px"}}>
              Intraday
            </a>
          </div>
          <div className="d-flex gap-3 ms-3">
            <a href="" className="text-white text-muted" style={{fontSize:"14px"}}>
              margins
            </a>
            <a href="" className="text-white text-muted" style={{fontSize:"14px"}}>
              Kite user manual
            </a>
          </div>
        </div>
        <div className="col-6 mt-2">
          <a href="" className="text-white text-muted" style={{fontSize:"14px",marginLeft:"490px"}}>
            Track Ticket
          </a>
          <h4 className="fs-5 " style={{fontsize:"12px"}}>Featured</h4>
          <ol>
            <li>
              <a href="" className="text-white text-muted" style={{fontSize:"14px"}}>
                Current Takeovers and Delisting - January 2024
              </a>
            </li>
            <li>
              <a href="" className="text-white text-muted" style={{fontSize:"14px"}}>
                Latest intradey laverges -MIS & CO
              </a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Hero;
