import graph from "../assets/graph.svg";
import { useNavigate } from "react-router-dom";

const WatchList = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container pt-3 pb-5 mb-5 ">
        <div className="row pt-2">
          <div className="col-12 pt-2">
            <button className="back-btn" onClick={() => navigate(-1)}>
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
          <div className="col-12 pt-3">
            <p className="mb-1  para3">KO</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h3 className="heading mb-0">Coca Cola Co.</h3>
            <h3 className="heading mb-0 py-1">$125.65</h3>
            <p className="trends">
              $3.67 (2.37%) <span>past hour</span>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12 border_btm_dotted">
            <img src={graph} className="w-100"></img>
          </div>
          <div className="col-12 pt-3">
            <ul className="dayul d-flex align-items-center justify-content-between">
              <li>live</li>
              <li className="active">1h</li>
              <li>1d</li>
              <li>1w</li>
              <li>3m</li>
              <li>1y</li>
              <li>all</li>
            </ul>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-between">
            <button
              className="buybtns"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Buy
            </button>
            <button className="buybtns">Sell</button>

            <button
              className="buybtns"
              onClick={() => {
                navigate("/marketdetail");
              }}
            >
              Watchlist -
            </button>
          </div>
        </div>

        <div className="row mt-4 pt-2">
          <div className="col-12">
            <h3 className="subheading m-0">Your position</h3>
          </div>
        </div>

        <div className="row mt-3 ">
          <div className="col-4 mb-3">
            <p className="para5">Shares</p>
            <p className="para6">11,333</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">Market value</p>
            <p className="para6">$44,333,245</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">Average cost</p>
            <p className="para6">$127.41</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">ROI $</p>
            <p className="para6">+$11,112,741</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">ROI %</p>
            <p className="para6 color-green">127.41%</p>
          </div>
        </div>

        <div className="row  mt-4">
          <div className="col-12">
            <h3 className="subheading m-0">Summary</h3>
            <p className="sum_dis mt-2">
              Apple is the premier personal computing maker in the world. Their
              end-to-end production gives Apple the unique position of remaining
              insulated from supply chain issues, and the “apple ecosystem”
              provides customers with integration in watches, headphones, and
              phones.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <p className="desig">CEO</p>
          </div>
          <div className="col-7">
            <p className="valuess">Timothy Donald Cook</p>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <p className="desig">Founded</p>
          </div>
          <div className="col-7">
            <p className="valuess">1976</p>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <p className="desig">Employees</p>
          </div>
          <div className="col-7">
            <p className="valuess">154,000</p>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <p className="desig">Headquarters</p>
          </div>
          <div className="col-7">
            <p className="valuess">Cupertino, CA</p>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <h3 className="subheading m-0">Stats</h3>
          </div>
        </div>

        <div className="row mt-3 ">
          <div className="col-4 mb-3">
            <p className="para5">Open</p>
            <p className="para6">$128.51</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">High</p>
            <p className="para6">$128.51M</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">Low</p>
            <p className="para6">$2.56T</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">Mkt Cap</p>
            <p className="para6">131.bn</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">Volume</p>
            <p className="para6">$67.5M</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">Avg Volume</p>
            <p className="para6">$67.5M</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">52 Wk High</p>
            <p className="para6">$144.65</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">52 Wk Low</p>
            <p className="para6">28.31</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">Div/Yield</p>
            <p className="para6">$90.34</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">P/E Ratio</p>
            <p className="para6">$144T</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">EPS TTM</p>
            <p className="para6">$144.65</p>
          </div>
          <div className="col-4 mb-3">
            <p className="para5">1 yr est. price</p>
            <p className="para6">$144.65</p>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <p className="parane7 ">News about Coca-Cola ($KO)</p>
          </div>
          <div className="col-12 pt-2 pb-3">
            <p className="heading2 mb-0">Sources</p>
          </div>
          <div className="col-12 over-scrol">
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
            <div className="card_news">
              <h3>We are going to the moon</h3>
              <p>Yahoo Finance</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12  pt-3">
            <p className="para66 my-3">
              Q2 2024 Financial Results (August 6, 2024):
            </p>

            <p className="para6">
              Eos reported revenue of $0.9 million for Q2 2024, a 261% increase
              year-over-year but fell short of the estimated $3.8 million. The
              company also posted a GAAP EPS of -$0.25, which is an improvement
              from the -$1.12 reported in the same quarter last year. The
              company ended the quarter with a cash balance of $52.5 million,
              excluding $5.1 million in restricted cash. Additionally, they
              terminated a $100 million Senior Secured Term loan for $27
              million, resulting in a $73 million gain​
              (markets.businessinsider.com)​ (GuruFocus).
            </p>

            <p className="para66 my-3">
              Monetization of Production Tax Credits:
            </p>

            <p className="para6">
              During the second quarter, Eos entered into tax credit purchase
              agreements to monetize its 2023 and Q1 2024 production tax
              credits, receiving $3.4 million in cash. This move is part of
              their strategy to strengthen their balance sheet and fund ongoing
              operations​ (markets.businessinsider.com).
            </p>

            <p className="para66 my-3">
              Proxy Statement Filing (July 29, 2024):
            </p>

            <p className="para6">
              Eos filed a preliminary proxy statement with the SEC, seeking
              stockholder approval for the issuance of additional common stock
              under warrants and convertibility of preferred stock related to a
              financing transaction with Cerberus. This step is part of their
              ongoing financial strategy and could significantly impact the
              company’s capital structure​ (Eos Energy Enterprises, Inc.)​ (EIN
              Presswire).
            </p>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="container px-3">
                <div className="row">
                  <div className="col-12 pt-2 px-0">
                    <button
                      className="back-btn"
                      data-bs-dismiss="modal"
                      aria-label="Close"
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
                </div>
                <div className="row">
                  <div className="col-12 px-0">
                    <p className="stock_buy_head mb-0 mt-2">Buy $KO</p>
                    <p>You currently own 0 shares of $KO</p>
                  </div>
                </div>
                <div className="row border-bottom1 pb-3">
                  <div className="col-6 px-0 pt-1">
                    <p className="para7">Shares</p>
                  </div>
                  <div className="col-6 text-right px-0">
                    <input
                      type="text"
                      placeholder="0.00"
                      className="shares_qty"
                    ></input>
                  </div>
                </div>
                <div className="row border-bottom1 pb-3 pt-3">
                  <div className="col-6 px-0 pt-1">
                    <p className="para7">Share price</p>
                  </div>
                  <div className="col-6 text-right px-0">
                    <p className="para7">$334.44</p>
                  </div>
                </div>
                <div className="row  pb-3 pt-3">
                  <div className="col-6 px-0 pt-1">
                    <p className="para7">Total</p>
                  </div>
                  <div className="col-6 text-right px-0">
                    <p className="para8">$223,334.44</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 px-0 mt-5 mb-5">
                    <button
                      className="buy_shares_btn"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop2"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="container px-3">
                <div className="row">
                  <div className="col-12 pt-2 px-0">
                    <button
                      className="back-btn"
                      data-bs-dismiss="modal"
                      aria-label="Close"
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
                </div>
                <div className="row">
                  <div className="col-12 px-0">
                    <p className="stock_buy_head mb-0 mt-2">Buy $KO</p>
                    <p>You currently own 0 shares of $KO</p>
                  </div>
                </div>
                <div className="row border-bottom pb-3">
                  <div className="col-6 px-0 pt-1">
                    <p className="para7">Shares</p>
                  </div>
                  <div className="col-6 text-right px-0">
                    <input
                      type="text"
                      placeholder="0.00"
                      className="shares_qty"
                    ></input>
                  </div>
                </div>
                <div className="row border-bottom pb-3 pt-3">
                  <div className="col-6 px-0 pt-1">
                    <p className="para7">Share price</p>
                  </div>
                  <div className="col-6 text-right px-0">
                    <p className="para7">$334.44</p>
                  </div>
                </div>
                <div className="row  pb-3 pt-3">
                  <div className="col-6 px-0 pt-1">
                    <p className="para7">Total</p>
                  </div>
                  <div className="col-6 text-right px-0">
                    <p className="para8">$223,334.44</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 px-0 mt-5 mb-5">
                    <button className="buy_shares_btn2">Confirm</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WatchList;
