import graph from "../assets/graph.svg";
import { useNavigate } from "react-router-dom";
import set from "../assets/settings.svg";
import { useEffect, useState } from "react";
import { getRequest } from "../services/axiosService";
import { Sheet } from "react-modal-sheet";
// import MarketSearch from "../components/MarketSearch";
import FullScreenLoader from "../components/FullScreenLoader";

const Markets = () => {
  const [listView, setlistView] = useState(true);
  const [namelistView, setnamelistView] = useState<any>([]);
  const [ticket_list, setticket_list] = useState<any>([]);
  const [isOpen, setOpen] = useState(false);
  // const [stockData, setstockData] = useState<any>("");
  const [watchName, setwatchName] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getRecentSearch();
    getStockWatchList();
    getTrending();
  }, []);
  useEffect(() => {
    if (!isOpen) {
      localStorage.setItem("isAPI", JSON.stringify(true));
    }
  }, [isOpen]);
  useEffect(() => {
    const Interval = setInterval(() => {
      const isAPI = JSON.parse(localStorage.getItem("isAPI")!);
      const newsChanges = JSON.parse(localStorage.getItem("newsChanges1")!);
      if (isAPI && newsChanges) {
        getRecentSearch();
        getStockWatchList();
        localStorage.removeItem("isAPI");
        localStorage.removeItem("newsChanges1");
      }
    }, 1000);
    return () => {
      clearInterval(Interval);
    };
  }, []);
  const getRecentSearch = async () => {
    try {
      const response: any = await getRequest(
        "/api/app/market/recent-search-list"
      );
      // setnamelistView(response.data.data.list.name_list);
      setticket_list(response.data.data.list.ticket_list);
    } catch (error) {
      console.error(error);
    }
  };
  const getTrending = async () => {
    try {
      const response: any = await getRequest("/api/app/market/trending-stocks");
      setnamelistView(response.data.data.list);
    } catch (error) {
      console.error(error);
    }
  };
  const getStockWatchList = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest<any>("/api/polygon/stocklists/", {});
      setIsLoading(false);
      if (response.status == 200) {
        console.log(response.data);
        setwatchName(response.data);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  return (
    <>
      <div className="container pt-3 pb-5  mb-8 ">
        <FullScreenLoader isLoading={isLoading} message="Please wait..." />
        <div className="row pt-3">
          <div className="col-9 ">
            <h3 className="heading">Markets</h3>
          </div>
          <div className="col-3 text-right">
            <button
              className="menu-btn"
              onClick={() => {
                navigate("/settings");
              }}
            >
              <img src={set}></img>
            </button>
          </div>
        </div>
        <div className="row mb-3 mt-2">
          <div className="col-12 ">
            <h3 className="subheading">Trending</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12 wrap_stk ">
            {namelistView.length == 0 && <p>No records found.</p>}
            {namelistView.map(
              (item: any, key: any) =>
                key <= 7 && (
                  <span
                    key={key}
                    className="stock_tags"
                    onClick={() => {
                      // setOpen(true);
                      // setstockData(item);
                      localStorage.setItem(
                        "currentTicker",
                        JSON.stringify(item)
                      );
                      navigate("/marketdetail");
                    }}
                  >
                    {item.name}
                  </span>
                )
            )}
          </div>
        </div>
        <div className="row  mt-3 mb-3">
          <div className="col-6 pt-2">
            <h3 className="subheading m-0">Watchlist</h3>
          </div>
          <div className="col-6 text-right">
            <button
              className="btn_gridlist d-none"
              onClick={() => {
                setlistView(!listView);
              }}
            >
              {listView ? "Grid" : "List"} view
            </button>
          </div>
        </div>

        {listView &&
          watchName.map((item: any, key: any) => (
            <div className="row" key={key}>
              <div className="col-12">
                {/* <h2 style={{ color: "#fff" }}>{item.name}</h2> */}
                {item.stocks.map((it: any, key1: any) => (
                  <div
                    className="row py-3 border-bottom1"
                    key={"1a" + key1}
                    onClick={() => {
                      // setOpen(true);
                      localStorage.setItem("currentTicker", JSON.stringify(it));
                      navigate("/marketdetail");
                      // setstockData(item);
                    }}
                  >
                    <div className="col-8 ">
                      <p className="company_name">{it.ticker}</p>
                      <p className="stockname">{it.ticker}</p>
                    </div>
                    <div className="col-4 text-right">
                      <p className="company_name">
                        {formatCurrency(it.currentPrice)}
                      </p>
                      <p
                        className={
                          it.todaysPercentChange >= 0 ? "uptrend" : "downtrend"
                        }
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
                          className="feather feather-arrow-up"
                        >
                          <line x1="12" y1="19" x2="12" y2="5"></line>
                          <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                        {it.todaysPercentChange.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        {!listView && (
          <div className="row px-1 mb-5 pb-5">
            {!listView &&
              ticket_list.map((item: any, key: any) => (
                <div
                  className="col-6 mt-3 px-2"
                  key={key}
                  onClick={() => {
                    // setOpen(true);
                    localStorage.setItem("currentTicker", JSON.stringify(item));
                    navigate("/marketdetail");
                    // setstockData(item);
                  }}
                >
                  <div className="card_watchlist shd1">
                    <div>
                      <h6>{item.ticker}</h6>
                      <h5>{item.name}</h5>
                    </div>
                    <div>
                      <p>{formatCurrency(item.current_price)}</p>
                      <span
                        className={
                          item.percent_change >= 11 ? "postve" : "negtve"
                        }
                      >
                        {item.percent_change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="row mt-4 pt-2">
          <div className="col-12">
            <button className="add_assets_btn">Add asset +</button>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal3"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content animate-bottom">
            <div className="modal-body">
              <div className="container  pb-5 mb-5 ">
                <div className="row pt-2 ">
                  <div className="col-12 pt-1">
                    <button
                      className="back-btn mb-2"
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
                  <div className="col-12 pt-1">
                    <p className="mb-1  para3">KO</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 mt-1">
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

                    <button
                      className="buybtns"
                      onClick={() => {
                        navigate("/watchlist");
                      }}
                    >
                      Watchlist +
                    </button>
                  </div>
                </div>

                <div className="row  mt-4">
                  <div className="col-12">
                    <h3 className="subheading m-0">Summary</h3>
                    <p className="sum_dis mt-2">
                      Apple is the premier personal computing maker in the
                      world. Their end-to-end production gives Apple the unique
                      position of remaining insulated from supply chain issues,
                      and the “apple ecosystem” provides customers with
                      integration in watches, headphones, and phones.
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
                    <p className="para5">Volume</p>
                    <p className="para6">$128.51M</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">P/E Ratio</p>
                    <p className="para6">$2.56T</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">High</p>
                    <p className="para6">$131.54</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">Avg Volume</p>
                    <p className="para6">$67.5M</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">Div/Yield</p>
                    <p className="para6">34.8</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">Low</p>
                    <p className="para6">$127.41</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">Mkt Cap</p>
                    <p className="para6">28.31</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">52 Wk Low</p>
                    <p className="para6">$90.34</p>
                  </div>
                  <div className="col-4 mb-3">
                    <p className="para5">52 Wk High</p>
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
                  <div className="col-12 over-scrol mb-4">
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
                      Eos reported revenue of $0.9 million for Q2 2024, a 261%
                      increase year-over-year but fell short of the estimated
                      $3.8 million. The company also posted a GAAP EPS of
                      -$0.25, which is an improvement from the -$1.12 reported
                      in the same quarter last year. The company ended the
                      quarter with a cash balance of $52.5 million, excluding
                      $5.1 million in restricted cash. Additionally, they
                      terminated a $100 million Senior Secured Term loan for $27
                      million, resulting in a $73 million gain​
                      (markets.businessinsider.com)​ (GuruFocus).
                    </p>

                    <p className="para66 my-3">
                      Monetization of Production Tax Credits:
                    </p>

                    <p className="para6">
                      During the second quarter, Eos entered into tax credit
                      purchase agreements to monetize its 2023 and Q1 2024
                      production tax credits, receiving $3.4 million in cash.
                      This move is part of their strategy to strengthen their
                      balance sheet and fund ongoing operations​
                      (markets.businessinsider.com).
                    </p>

                    <p className="para66 my-3">
                      Proxy Statement Filing (July 29, 2024):
                    </p>

                    <p className="para6">
                      Eos filed a preliminary proxy statement with the SEC,
                      seeking stockholder approval for the issuance of
                      additional common stock under warrants and convertibility
                      of preferred stock related to a financing transaction with
                      Cerberus. This step is part of their ongoing financial
                      strategy and could significantly impact the company’s
                      capital structure​ (Eos Energy Enterprises, Inc.)​ (EIN
                      Presswire).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content animate-bottom pt-4">
            <button
              type="button"
              className="btn-close-modal"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="modal-body pt-0 mt-4">
              <div className="container">
                <div className="row">
                  <div className="col-12 border-bottom px-0 pb-2">
                    <input
                      type="search"
                      className="popup_search"
                      placeholder="Search markets"
                    ></input>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mt-3 popup_buttons px-0">
                    <button className="active">Stocks</button>
                    <button>Indexes</button>
                    <button>Crypto</button>
                  </div>
                </div>
                <div className="row pt-2">
                  <div className="col-12 px-0 pt-3">
                    <h3 className="pop_heading_2 mb-0">Market cap</h3>
                  </div>
                </div>
                <div
                  className="row py-3 border-bottom"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal3"
                >
                  <div className="col-8 px-0">
                    <p className="company_name">Robinhood Markets LLC</p>
                    <p className="stockname">HOOD</p>
                  </div>
                  <div className="col-4 text-right">
                    <p className="company_name">$111.42</p>
                    <p className="uptrend">
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
                        className="feather feather-arrow-up"
                      >
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                      1.65%
                    </p>
                  </div>
                </div>
                <div
                  className="row py-3 border-bottom"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop3"
                >
                  <div className="col-8 px-0">
                    <p className="company_name">Apple Computers</p>
                    <p className="stockname">AAPL</p>
                  </div>
                  <div className="col-4 text-right">
                    <p className="company_name">$111.42</p>
                    <p className="uptrend">
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
                        className="feather feather-arrow-up"
                      >
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                      &nbsp; 1.65%
                    </p>
                  </div>
                </div>
                <div
                  className="row py-3 border-bottom"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop3"
                >
                  <div className="col-8 px-0">
                    <p className="company_name">Apple Computers</p>
                    <p className="stockname">AAPL</p>
                  </div>
                  <div className="col-4 text-right">
                    <p className="company_name">$111.42</p>
                    <p className="uptrend">
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
                        className="feather feather-arrow-up"
                      >
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                      &nbsp; 1.65%
                    </p>
                  </div>
                </div>
                <div
                  className="row py-3 "
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop3"
                >
                  <div className="col-8 px-0">
                    <p className="company_name">Alphabet Class A</p>
                    <p className="stockname">GOOG</p>
                  </div>
                  <div className="col-4 text-right">
                    <p className="company_name">$111.42</p>
                    <p className="uptrend">
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
                        className="feather feather-arrow-up"
                      >
                        <line x1="12" y1="19" x2="12" y2="5"></line>
                        <polyline points="5 12 12 5 19 12"></polyline>
                      </svg>
                      &nbsp; 1.65%
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
          <div className="modal-content animate-bottom">
            <div className="modal-body">
              <div className="container px-3">
                <div className="row">
                  <div className="col-12 pt-2 px-0">
                    <button
                      className="back-btn mb-2"
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
          <div className="modal-content animate-bottom">
            <div className="modal-body">
              <div className="container px-3">
                <div className="row">
                  <div className="col-12 pt-2 px-0">
                    <button
                      className="back-btn mb-2"
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
                    <button
                      className="buy_shares_btn2"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal6"
                    >
                      Confirm
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
        id="exampleModal6"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content animate-bottom">
            <div className="modal-body">
              <div className="container pt-3 pb-5 mb-5 ">
                <div className="row pt-2">
                  <div className="col-12 pt-2">
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
                      Apple is the premier personal computing maker in the
                      world. Their end-to-end production gives Apple the unique
                      position of remaining insulated from supply chain issues,
                      and the “apple ecosystem” provides customers with
                      integration in watches, headphones, and phones.
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
                      Eos reported revenue of $0.9 million for Q2 2024, a 261%
                      increase year-over-year but fell short of the estimated
                      $3.8 million. The company also posted a GAAP EPS of
                      -$0.25, which is an improvement from the -$1.12 reported
                      in the same quarter last year. The company ended the
                      quarter with a cash balance of $52.5 million, excluding
                      $5.1 million in restricted cash. Additionally, they
                      terminated a $100 million Senior Secured Term loan for $27
                      million, resulting in a $73 million gain​
                      (markets.businessinsider.com)​ (GuruFocus).
                    </p>

                    <p className="para66 my-3">
                      Monetization of Production Tax Credits:
                    </p>

                    <p className="para6">
                      During the second quarter, Eos entered into tax credit
                      purchase agreements to monetize its 2023 and Q1 2024
                      production tax credits, receiving $3.4 million in cash.
                      This move is part of their strategy to strengthen their
                      balance sheet and fund ongoing operations​
                      (markets.businessinsider.com).
                    </p>

                    <p className="para66 my-3">
                      Proxy Statement Filing (July 29, 2024):
                    </p>

                    <p className="para6">
                      Eos filed a preliminary proxy statement with the SEC,
                      seeking stockholder approval for the issuance of
                      additional common stock under warrants and convertibility
                      of preferred stock related to a financing transaction with
                      Cerberus. This step is part of their ongoing financial
                      strategy and could significantly impact the company’s
                      capital structure​ (Eos Energy Enterprises, Inc.)​ (EIN
                      Presswire).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        // snapPoints={[1, 0.5, 0.25]}
        initialSnap={0}
        // detent="full-height"
      >
        <Sheet.Container>
          <Sheet.Header style={{ background: "#000" }} />
          <Sheet.Content style={{ background: "#000" }}>
            <Sheet.Scroller draggableAt="both">
              {/* <MarketSearch stockData={stockData} /> */}
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default Markets;
