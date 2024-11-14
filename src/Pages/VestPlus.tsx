import { useNavigate } from "react-router-dom";

import profile from "../assets/silver.svg";

const VestPlus = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container  pt-3 px-4">
        <div className="row">
          <div className="col-12 mt-3 pt-1 px-0">
            <button
              className="back-btn"
              onClick={() => {
                navigate("/Markets");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              &nbsp;Back
            </button>
          </div>
          <div className="col-12 px-0 mt-3 pt-1">
            <h3 className="side_headings">Vestr+</h3>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 px-0">
            <div className="card_silver d-flex pb-4">
              <div className="prof_wrap">
                <img src={profile}></img>
              </div>
              <div className="flex-2">
                <button className="plan_btns">Silver</button>
                <button className="plan_btns">Free</button>
                <div className="pb-3">
                  <button className="current_btn mt-2 mb-3">Current</button>
                </div>
              </div>
            </div>
            <ul className="silver_class_ul">
              <li>Silver founder badge on profile</li>
              <li>No check mark next to name</li>
              <li>Access to Mr. Vestr</li>
              <li>10 Mr. Vestr prompts/mo</li>
              <li>5 years of financial data</li>
              <li>2 years of KPI data</li>
              <li>Global stocks, ETFs & Fund Coverage</li>
              <li>3 Events (calls, transcripts, and slides)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default VestPlus;
