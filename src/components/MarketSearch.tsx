import { useEffect, useRef, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../services/axiosService";
import { toast } from "react-toastify";
import StockGraph from "./StockGraph";
import AnimatedNumber from "./AnimatedNumber";
import { useNavigate } from "react-router-dom";
import {
  calculateReturns,
  fetchUserCashBalance,
  fetchUserPortfolio,
  formatCurrency as fc,
} from "../helper/MarketHelper";
import CurrencyInput from "./CurrencyInput";
const MarketSearch = (props: any) => {
  const [peStocks, setpeStocks] = useState<any>("");
  const [userPortfolio, setUserPortfolio] = useState<any>(null);
  const [userTickerPosition, setUserTickerPosition] = useState<any>(null);
  const [returnData, setReturnData] = useState<any>(null);

  const [isConfirm, setisConfirm] = useState(false);
  const [long_description, setlong_description] = useState<any>("");
  const [isInsufficient, setisInsufficient] = useState(false);
  const [IsAmount, setIsAmount] = useState(false);
  const [balanceMSG, setbalanceMSG] = useState<any>("");
  const [amount, setamount] = useState<any>("");

  const [type, settype] = useState("stock");
  const [IsModal, setIsModal] = useState(false);
  const [IsBut, setIsBut] = useState(true);
  const [keyword, setkeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [stockList, setstockList] = useState<any>([]);
  const [isStockDetails, setisStockDetails] = useState(1);
  const [ticker, setticker] = useState("");
  const [stockDetail, setstockDetail] = useState<any>("");
  const [sampleData, setsampleData] = useState<any>([]);
  const [interval, setinterval] = useState("1w");
  const [currentPrice, setcurrentPrice] = useState<any>("");
  const [currentPrice2, setcurrentPrice2] = useState<any>("");
  const [quantity, setquantity] = useState<any>("");
  const [previousPrice, setpreviousPrice] = useState<any>("");
  const [ticket_list, setticket_list] = useState<any>([]);
  // const [watchName, setwatchName] = useState<any>([]);
  const [currentWatch, setcurrentWatch] = useState<any>("");
  const [additionalDetails, setadditionalDetails] = useState<any>("");

  const [totalBUY, settotalBUY] = useState(0);
  const [totalSELL, settotalSELL] = useState(0);
  const inputRef = useRef<any>(null);
  const navigate = useNavigate();
  const [cashBalance, setCashBalance] = useState<any>(null);
  const [isError, setisError] = useState("");

  useEffect(() => {
    if (currentPrice && userTickerPosition) {
      let returns = calculateReturns(userTickerPosition, currentPrice);

      setReturnData(returns);
    }
  }, [currentPrice, userTickerPosition]);
  useEffect(() => {
    fetchUserPortfolio(setUserPortfolio);

    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (userPortfolio && ticker) {
      setUserTickerPosition(
        userPortfolio?.assets.find(
          (stock: any) => stock?.ticker?.toUpperCase() === ticker?.toUpperCase()
        )
      );
    }
  }, [userPortfolio, ticker]);

  const getRecentSearch = async () => {
    try {
      const response: any = await getRequest(
        "/api/app/market/recent-search-list"
      );
      setticket_list(response.data.data.list.ticket_list);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (props.stockData) {
      if (props.stockData.ticker) {
        getStockDetails(props.stockData);
      } else {
        setkeyword(props.stockData.name);
        searchByProps(props.stockData.name);
      }
    } else {
      setisStockDetails(1);
      getRecentSearch();
      setinterval("1w");
      setstockDetail("");
      setsampleData("");
      // inputRef.current.focus();
    }
    fetchUserCashBalance(setCashBalance);
    setisConfirm(false);
  }, []);
  const searchByProps = async (keyword1: any) => {
    try {
      setIsLoading(true);
      const response = await postRequest<any>("/api/app/market/search", {
        keyword: keyword1,
        type: type,
      });
      setIsLoading(false);
      if (response.status == 200) {
        // console.log(response.data);
        setstockList(response.data.data.result);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const searchStock = async () => {
    if (keyword) {
      try {
        setIsLoading(true);
        const response = await postRequest<any>("/api/app/market/search", {
          keyword: keyword,
          type: type,
        });

        if (response.status == 200) {
          // console.log(response.data);
          setstockList(response.data.data.result);
          setIsLoading(false);
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error("Error creating user:", error);
      }
    } else {
      // toast.error("Please enter stock");
    }
  };
  useEffect(() => {
    if (!keyword) {
      setstockList([]);
    }
  }, [keyword]);
  const getStockDetails = async (item: any) => {
    setisStockDetails(2);

    setticker(item.ticker);
  };
  useEffect(() => {
    if (ticker && interval) {
      getStockGraph();
    }
  }, [ticker, interval]);
  const getPEStockData = async () => {
    try {
      setIsLoading(true);
      const response = await postRequest<any>("/api/app/market/get-eps", {
        ticker: ticker,
      });
      setIsLoading(false);
      if (response.status == 200) {
        console.log(response.data);
        setpeStocks(response.data.data);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  useEffect(() => {
    if (ticker) {
      getStockData();
      getStockBUYSELL();
      getActiveWatchList();
      getStockAdditional();
      regenerate();
      getPEStockData();
    }
  }, [ticker]);
  const getStockAdditional = async () => {
    try {
      setIsLoading(true);
      const response = await postRequest<any>(
        "/api/app/market/additional-details",
        {
          ticker: ticker,
          type: type,
        }
      );
      setIsLoading(false);
      // console.log(response.data);
      setadditionalDetails(response.data.data.details);
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const getStockBUYSELL = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest<any>(
        "/api/stockActions/transactions/" + ticker
      );
      setIsLoading(false);
      // console.log(response.data);
      var demoBUY = 0;
      var demoSELL = 0;
      for (let index = 0; index < response.data.length; index++) {
        if (response.data[index].type == "buy") {
          // console.log(response.data[index]);
          demoBUY += response.data[index].quantity;
        } else {
          demoSELL += response.data[index].quantity;
        }
      }
      settotalBUY(demoBUY);
      settotalSELL(demoSELL);
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const getStockData = async () => {
    try {
      setIsLoading(true);
      const response = await postRequest<any>("/api/app/market/details", {
        ticker: ticker,
        type: type,
      });
      setIsLoading(false);
      if (response.status == 200) {
        // console.log(response.data);
        setstockDetail(response.data.data.details);
        setcurrentPrice2(response.data.data.details.current_price);
        setcurrentPrice("");
        setTimeout(() => {
          setcurrentPrice(response.data.data.details.current_price);
        }, 10);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const getStockGraph = async () => {
    try {
      const timeValues: { [key: string]: any } = {
        live: {
          from: (date: Date) =>
            date.setTime(date.getTime() - 1000 * 60 * 5) && date,
          multiplier: 1,
          timespan: "second",
        },
        "1h": {
          from: (date: Date) =>
            date.setTime(date.getTime() - 1000 * 60 * 60) && date,
          multiplier: 14,
          timespan: "second",
        },
        "1d": {
          from: (date: Date) => date.setDate(date.getDate() - 1) && date,
          multiplier: 1,
          timespan: "minute",
        },
        "1w": {
          from: (date: Date) => date.setDate(date.getDate() - 7) && date,
          multiplier: 15,
          timespan: "minute",
        },
        "3m": {
          from: (date: Date) => date.setMonth(date.getMonth() - 3) && date,
          multiplier: 1,
          timespan: "day",
        },
        "1y": {
          from: (date: Date) =>
            date.setFullYear(date.getFullYear() - 1) && date,
          multiplier: 1,
          timespan: "day",
        },
        all: {
          from: () => new Date("August 01, 2003"),
          multiplier: 1,
          timespan: "week",
        },
      };
      const currentDate = new Date();
      const oldDate = timeValues[interval].from(new Date(currentDate));

      // setIsLoading(true);
      const url =
        "/api/markets/stock/datapoints?" +
        "ticker=" +
        ticker +
        "&" +
        "fromDateUnixMs=" +
        oldDate.getTime() +
        "&" +
        "toDateUnixMs=" +
        currentDate.getTime() +
        "&" +
        "multiplier=" +
        timeValues[interval].multiplier +
        "&" +
        "timespan=" +
        timeValues[interval].timespan;
      const response = await getRequest<any>(url);
      setIsLoading(false);
      setsampleData([]);
      if (response.status == 200) {
        var demosampleData = [];
        // var demoCategories = [];
        // console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
          demosampleData.push({
            y: response.data[i].c,
            x: i,
            t: response.data[i].t,
          });
        }
        setsampleData(demosampleData);
        setpreviousPrice(response.data?.[0]?.c || previousPrice);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const formatCurrency = (num: any) => {
    if (Math.abs(num) >= 1_000_000_000_000) {
      return `$${(num / 1_000_000_000_000).toFixed(1)}T`; // Trillion
    } else if (Math.abs(num) >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(1)}B`; // Billion
    } else if (Math.abs(num) >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(1)}M`; // Million
    } else if (Math.abs(num) >= 1_000) {
      return `$${(num / 1_000).toFixed(1)}K`; // Thousand
    } else {
      return "$" + num.toString(); // Less than 1K
    }
  };
  const formatCurrency2 = (value: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  const formatCurrency3 = (value: any) => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
    }).format(value);
  };
  const buyStiock = async () => {
    if (quantity) {
      try {
        if (IsBut) {
          if (isLoading2) return;
          setIsLoading2(true);
          const response = await postRequest<any>("/api/stockActions/buy", {
            ticker: ticker,
            assetType: type,
            price: currentPrice2,
            quantity: quantity,
          });

          // console.log(response.data);

          toast.success(response.data.message);
          setisStockDetails(2);
          setquantity("");
          setIsModal(false);
          getStockBUYSELL();
          fetchUserCashBalance(setCashBalance);
          fetchUserPortfolio(setUserPortfolio);
          // setTimeout(() => {
          setIsLoading2(false);
          // }, 3000);
        } else {
          if (Number(quantity) > totalBUY) {
            toast.error("You don't have enough shares to sell");
          } else {
            if (isLoading2) return;
            setIsLoading2(true);
            const response = await postRequest<any>("/api/stockActions/sell", {
              ticker: ticker,
              assetType: type,
              price: currentPrice2,
              quantity: quantity,
            });

            setIsModal(false);
            toast.success(response.data.message);
            setisStockDetails(2);
            setquantity("");
            getStockBUYSELL();
            fetchUserCashBalance(setCashBalance);
            fetchUserPortfolio(setUserPortfolio);
            // setTimeout(() => {
            setIsLoading2(false);
            // }, 3000);
          }
        }
      } catch (error: any) {
        // setTimeout(() => {
        setIsLoading2(false);
        // }, 3000);
        console.error("Error creating user:", error);
        // toast.error(error.response.data.message);
        setbalanceMSG(error.response.data.message);
        setisInsufficient(true);
        setIsModal(false);
      } finally {
        setisConfirm(false);
      }
    } else {
      toast.error("Please enter quantity");
    }
  };
  const numberOnlyValidation = (event: any) => {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  };
  const calculatePercentageChange = (
    currentPrice1: any,
    previousPrice1: any
  ) => {
    if (previousPrice1 === 0) {
      return 0;
    }
    const change = ((currentPrice1 - previousPrice1) / previousPrice1) * 100;
    return change.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      searchStock();
    }
  };
  const getActiveWatchList = async () => {
    try {
      const response = await getRequest<any>(
        `/api/markets/stocklists/watchlist`,
        {}
      );
      console.log(response.data);

      const aa = response.data.stocks.filter((stock: any) => {
        if (stock.ticker === ticker) {
          return stock;
        } else {
          return "";
        }
      });
      if (aa.length > 0) setcurrentWatch(aa[0]);
      // setIsInWatchlist(response.data.stocks.some((stock) => stock.ticker === ticker));
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };
  const getStockWatchList = async (e: any) => {
    try {
      e.stopPropagation();
      // setIsLoading(true);
      const response = await getRequest<any>("/api/markets/stocklists/", {});
      setIsLoading(false);
      if (response.status == 200) {
        console.log(response.data);
        setcurrentWatch(response.data[0]);
        addStockWatch(response.data[0]._id);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const addStockWatch = async (id: any) => {
    try {
      // e.stopPropagation();
      // setIsLoading(true);
      const response = await postRequest<any>(
        "/api/markets/stocklists/" + id + "/stocks",
        {
          ticker: ticker,
        }
      );
      setIsLoading(false);
      if (response.status == 200) {
        // toast.success("Added successfully in watchlist");
        localStorage.setItem("newsChanges1", JSON.stringify(true));
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const removeStockWatchList = async () => {
    try {
      // setIsLoading(true);
      const response = await deleteRequest<any>(
        "/api/markets/stocklists/watchlist/" + ticker
      );
      setIsLoading(false);
      if (response.status == 200) {
        console.log(response.data);
        // toast.success("Removed successfully from watchlist");
        localStorage.setItem("newsChanges1", JSON.stringify(true));
        setcurrentWatch("");
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
    }
  };
  const addCash = async () => {
    setIsLoading(true);
    try {
      const response: any = await postRequest(`/api/stockActions/addCash`, {
        amount: amount,
      });
      if (response.status == 200) {
        toast.success("Cash added successfully");
        setIsAmount(false);
        setamount("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
    }).format(value);
  };
  const regenerate = async () => {
    try {
      setIsLoading(true);
      const response = await postRequest<any>(
        "/api/app/market/regenerate-news",
        {
          ticker: ticker,
          type: type,
        }
      );
      if (response.status == 200) {
        setlong_description(response.data.data.details.news);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container">
      <FullScreenLoader isLoading={isLoading} message="Please wait..." />
      {isStockDetails == 1 && (
        <div>
          <div className="row border-bottom1 pt-3 pb-3 mt-2">
            <div className="col-12 position-relative">
              <input
                type="text"
                onChange={(e) => setkeyword(e.target.value)}
                value={keyword}
                onKeyUp={handleKeyPress}
                ref={inputRef}
                className="popup_search"
                placeholder="Search markets"
              ></input>
              {/* <button className="btn_save_news" onClick={() => searchStock()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-arrow-right"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button> */}
            </div>
          </div>
          <div className="row pt4">
            <div className="col-12 mt-2 popup_buttons px-3">
              <button
                className={type == "stock" ? "active" : ""}
                onClick={() => settype("stock")}
              >
                Stocks
              </button>
              <button
                className={type == "indexes" ? "active" : ""}
                onClick={() => settype("indexes")}
              >
                Indexes
              </button>
            </div>
          </div>
          <div className="row pt-4">
            <div className="col-12">
              {!isLoading && (
                <button
                  className="refreshnwsfed"
                  style={
                    keyword
                      ? { backgroundColor: "#00FF00", color: "black" }
                      : {}
                  }
                  onClick={searchStock}
                >
                  Search
                </button>
              )}
              {isLoading && (
                <button
                  className="refreshnwsfed"
                  style={
                    keyword
                      ? { backgroundColor: "#00FF00", color: "black" }
                      : {}
                  }
                >
                  Searching...
                </button>
              )}
            </div>
          </div>
          {stockList.length > 0 && (
            <div className="row pt-2">
              <div className="col-12 px-3 pt-3">
                <h3 className="pop_heading_2 mb-0">Search results</h3>
              </div>
            </div>
          )}
          {stockList.map((item: any, key: any) => (
            <div
              key={key}
              onClick={() => {
                getStockDetails(item);
              }}
              className="row py-3 px-3 border-bottom1"
            >
              <div className="col-7 px-0">
                <p className="company_name text_ov_ec">{item.name}</p>
                <p className="stockname">{item.ticker}</p>
              </div>
              <div className="col-5 px-0 text-right">
                <p className="company_name">
                  {formatCurrency2(item.current_price)}
                </p>
                <p
                  className={item.percent_change >= 0 ? "uptrend" : "downtrend"}
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
                  {item.percent_change}%
                </p>
              </div>
            </div>
          ))}
          {stockList.length == 0 && (
            <div className="row pt-2">
              <div className="col-12 px-3 pt-3">
                <h3 className="pop_heading_2 mb-0">Recently searched</h3>
              </div>
            </div>
          )}
          {stockList.length == 0 &&
            ticket_list.map((item: any, key: any) => (
              <div
                className="row py-3 px-3 border-bottom1"
                key={key}
                onClick={() => {
                  getStockDetails(item);
                }}
              >
                <div className="col-7 px-0">
                  <p className="company_name text_ov_ec">{item.name}</p>
                  <p className="stockname">{item.ticker}</p>
                </div>
                <div className="col-5 text-right px-0">
                  <p className="company_name">
                    {formatCurrency2(item.current_price)}
                  </p>
                  <p
                    className={
                      item.percent_change >= 0 ? "uptrend" : "downtrend"
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
                    {item.percent_change}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
      {isStockDetails == 2 && (
        <div>
          <div className="row pt-2 ">
            <div className="col-12 pt-1">
              <button
                onClick={() => {
                  setisStockDetails(1);
                  setinterval("1w");
                  setstockDetail("");
                  setsampleData("");
                  setcurrentWatch("");
                }}
                className="back-btn mb-2"
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
              <p className="mb-1  para3">{ticker}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-12 mt-1">
              <h3 className="heading mb-0">{stockDetail?.name}</h3>
              <h3
                className="heading mb-0 py-1 headspanss"
                style={{ display: "flex", alignItems: "center" }}
              >
                {currentPrice && (
                  <AnimatedNumber
                    value={currentPrice.toFixed(2)}
                    duration={500}
                    format={(val) => `${val.toFixed(2)}`}
                  />
                )}
              </h3>
              <p
                className={
                  parseFloat((currentPrice - previousPrice).toFixed(2)) >= 0
                    ? "trends"
                    : "trends2"
                }
              >
                ${formatNumber(currentPrice - previousPrice)} (
                {calculatePercentageChange(currentPrice, previousPrice)}
                %)&nbsp;
                <span>
                  {interval == "live" && "today"}{" "}
                  {interval == "1h" && "past hour"}{" "}
                  {interval == "1d" && "past day"}{" "}
                  {interval == "1w" && "past week"}{" "}
                  {interval == "3m" && "past 3 months"}{" "}
                  {interval == "1y" && "past year"}
                  {interval == "all" && "all"}
                </span>
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-12" style={{ padding: 0 }}>
              {sampleData.length > 0 && (
                <StockGraph
                  data={sampleData}
                  currentPrice={currentPrice2}
                  setcurrentPrice={setcurrentPrice}
                  previousPrice={previousPrice}
                />
              )}
            </div>
            <div className="col-12 pt-3">
              <ul className="dayul d-flex align-items-center justify-content-between">
                <li
                  onClick={() => setinterval("live")}
                  className={interval == "live" ? "active" : ""}
                >
                  live
                </li>
                {/* <li
                  onClick={() => setinterval("1h")}
                  className={interval == "1h" ? "active" : ""}
                >
                  1h
                </li> */}
                <li
                  onClick={() => setinterval("1d")}
                  className={interval == "1d" ? "active" : ""}
                >
                  1d
                </li>
                <li
                  onClick={() => setinterval("1w")}
                  className={interval == "1w" ? "active" : ""}
                >
                  1w
                </li>
                <li
                  onClick={() => setinterval("3m")}
                  className={interval == "3m" ? "active" : ""}
                >
                  3m
                </li>
                <li
                  onClick={() => setinterval("1y")}
                  className={interval == "1y" ? "active" : ""}
                >
                  1y
                </li>
                <li
                  onClick={() => setinterval("all")}
                  className={interval == "all" ? "active" : ""}
                >
                  all
                </li>
              </ul>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 d-flex gap10 justify-content-between">
              <button
                onClick={() => {
                  setquantity("");
                  setIsBut(true);
                  setisStockDetails(3);
                }}
                className="buybtns"
              >
                Buy
              </button>
              {totalBUY - totalSELL > 0 && (
                <button
                  onClick={() => {
                    setquantity("");
                    setIsBut(false);
                    setisStockDetails(3);
                  }}
                  className="buybtns"
                >
                  Sell
                </button>
              )}

              {!currentWatch && (
                <button
                  className="buybtns"
                  onClick={(e) => {
                    getStockWatchList(e);
                  }}
                >
                  Watchlist +{" "}
                </button>
              )}

              {currentWatch && (
                <button
                  className="buybtns"
                  onClick={() => {
                    removeStockWatchList();
                  }}
                >
                  Watchlist -
                </button>
              )}
            </div>
          </div>

          {userTickerPosition?.quantity && (
            <>
              <div className="row  mt-4">
                <div className="col-12 pt-2">
                  <h3 className="subheading m-0">Your position</h3>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-4 mb-3">
                  <p className="para5">Shares</p>
                  <p className="para6">
                    {userTickerPosition?.quantity &&
                      formatCurrency3(userTickerPosition?.quantity)}
                    {!userTickerPosition?.quantity && "--"}
                  </p>
                </div>
                <div className="col-4 mb-3">
                  <p className="para5">Market value</p>
                  <p className="para6">
                    {userTickerPosition?.quantity &&
                      formatCurrency2(
                        userTickerPosition?.quantity * currentPrice2
                      )}
                    {!userTickerPosition?.quantity && "--"}
                  </p>
                </div>
                <div className="col-4 mb-3">
                  <p className="para5">Average cost</p>
                  <p className="para6">
                    {" "}
                    {userTickerPosition?.avgBuyPrice &&
                      formatCurrency2(userTickerPosition?.avgBuyPrice)}
                    {!userTickerPosition?.avgBuyPrice && "--"}
                  </p>
                </div>
                <div className="col-4 mb-3">
                  <p className="para5">ROI $</p>
                  <p className="para6">
                    {returnData ? (
                      <>
                        {returnData?.realizedDollar >= 0 ? "+" : ""}
                        {fc(returnData.realizedDollar)}
                      </>
                    ) : (
                      "--"
                    )}
                  </p>
                </div>
                <div className="col-4 mb-3">
                  <p className="para5">ROI %</p>
                  <p
                    className={
                      returnData?.realizedDollar >= 0
                        ? "para6 clr_grn"
                        : "para6 clr_red"
                    }
                  >
                    {returnData ? (
                      <> {fc(returnData.realizedPercentage)}%</>
                    ) : (
                      "--"
                    )}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="row  mt-4">
            <div className="col-12">
              <h3 className="subheading m-0 pb-2">Summary</h3>
              <p className="sum_dis mt-2">{stockDetail?.description}</p>
            </div>
          </div>
          <div className="row pt-2">
            <div className="col-5">
              <p className="desig">CEO</p>
            </div>
            <div className="col-7">
              <p className="valuess">
                {additionalDetails?.ceo}
                {!additionalDetails?.ceo && "N/A"}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <p className="desig">Founded</p>
            </div>
            <div className="col-7">
              <p className="valuess">
                {additionalDetails?.founded}
                {!additionalDetails?.founded && "N/A"}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <p className="desig">Employees</p>
            </div>
            <div className="col-7">
              <p className="valuess">
                {additionalDetails?.total_employees &&
                  formatNumber(additionalDetails?.total_employees)}
                {!additionalDetails?.total_employees && "N/A"}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <p className="desig">Headquarters</p>
            </div>
            <div className="col-7">
              <p className="valuess">
                {additionalDetails?.headquarters}
                {!additionalDetails?.headquarters && "N/A"}
              </p>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 pt-2">
              <h3 className="subheading m-0">Stats</h3>
            </div>
          </div>

          <div className="row mt-3 ">
            <div className="col-4 mb-3">
              <p className="para5">Open</p>
              <p className="para6">
                {stockDetail?.open ? formatCurrency2(stockDetail?.open) : "--"}
              </p>
            </div>
            <div className="col-4 mb-3">
              <p className="para5">Volume</p>
              <p className="para6">
                {stockDetail?.volume
                  ? formatCurrency(stockDetail?.volume)
                  : "--"}
              </p>
            </div>
            <div className="col-4 mb-3">
              <p className="para5">P/E Ratio</p>
              <p className="para6">
                {peStocks?.peRatio ? formatCurrency2(peStocks?.peRatio) : "--"}
              </p>
            </div>
            <div className="col-4 mb-3">
              <p className="para5">EPS (TTM)</p>
              <p className="para6 tofl_ec">
                {peStocks?.eps ? formatCurrency2(peStocks?.eps) : "--"}
              </p>
            </div>
            <div className="col-4 mb-3">
              <p className="para5">High</p>
              <p className="para6">
                {(stockDetail?.high && formatCurrency(stockDetail?.high)) ||
                  "--"}
              </p>
            </div>

            <div className="col-4 mb-3">
              <p className="para5">Div/Yield</p>
              <p className="para6">
                {(
                  ((stockDetail?.dividend || 0) * 100) /
                  currentPrice2
                )?.toFixed(2) + "%" || "--"}
              </p>
            </div>
            <div className="col-4 mb-3">
              <p className="para5">Low</p>
              <p className="para6">
                {(stockDetail?.low && formatCurrency(stockDetail?.low)) || "--"}
              </p>
            </div>
            <div className="col-4 mb-3">
              <p className="para5">Mkt Cap</p>
              <p className="para6">
                {(stockDetail?.market_cap &&
                  formatCurrency(stockDetail?.market_cap)) ||
                  "--"}
              </p>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <p className="parane7 ">
                News about {stockDetail?.name} (${ticker})
              </p>
            </div>
            <div className="col-12 pt-2 pb-2">
              <p className="heading2 mb-0">Sources</p>
            </div>
            <div className="col-12 over-scrol">
              {additionalDetails?.news?.map((item: any, key: any) => (
                <div
                  className="card_news"
                  key={key}
                  onClick={() => {
                    window.open(item.article_url, "_blank");
                  }}
                >
                  <div>
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.author}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12 pt-2">
              <h3 className="subheading m-0">Recent updates:</h3>
              <p
                className="subheading font_regn mt-1"
                onClick={() => regenerate()}
              >
                Regenerate
              </p>
              <p
                className="sum_dis mt-2"
                dangerouslySetInnerHTML={{
                  __html: long_description,
                }}
              ></p>
            </div>
          </div>
        </div>
      )}
      {isStockDetails == 3 && (
        <div>
          <div className="row">
            <div className="col-12 pt-2 px-3">
              <button
                className="back-btn mb-2"
                onClick={() => {
                  setisError("");
                  if (isConfirm) {
                    setisConfirm(false);
                  } else {
                    setisConfirm(false);
                    setisStockDetails(2);
                  }
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
          </div>
          <div className="row">
            <div className="col-12 px-3">
              <p className="stock_buy_head mb-0 mt-2">
                {IsBut ? "Buy" : "Sell"} {ticker}
              </p>
              <p>
                You currently own {formatCurrency3(totalBUY - totalSELL)} shares
                of {ticker}
              </p>
            </div>
          </div>
          <div className="row border-bottom1 pb-3">
            <div className="col-6 px-3 pt-1">
              <p className="para7">Shares</p>
            </div>
            <div className="col-6 px-3 text-right px-0">
              {!isConfirm && (
                <CurrencyInput
                  value={quantity}
                  onChange={(e) => {
                    if (e) {
                      setquantity(e);
                      setisError("");
                    } else {
                      setquantity("");
                      setisError("Please enter valid quantity");
                    }
                  }}
                  prefix=""
                  className="shares_qty"
                  placeholder="0"
                />
                // <input
                //   type="text"
                //   inputMode="numeric"
                //   onChange={(e: any) => {
                //     const filteredValue = e.target.value.replace(/[.,-]/g, "");

                //     setquantity(filteredValue.trim());
                //   }}
                //   value={quantity}
                //   onKeyPress={numberOnlyValidation}
                //   placeholder="0"
                //   pattern="[0-9]*"
                //   className="shares_qty"
                // ></input>
              )}
              {isConfirm && (
                <p className="para7 wei-bold">{formatCurrency3(quantity)}</p>
              )}
            </div>
          </div>
          <div className="row border-bottom1 pb-3 pt-3">
            <div className="col-6 px-3 pt-1">
              <p className="para7">Share price</p>
            </div>
            <div className="col-6 px-3 text-right px-0">
              <p className="para7 wei-bold">
                ${currentPrice2 && currentPrice2.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="row  pb-3 pt-3">
            <div className="col-6 px-3 pt-1">
              <p className="para7">Total</p>
            </div>
            <div className="col-6 px-3 text-right px-0">
              <p className="para7 wei-bold">
                {currentPrice2 && formatCurrency2(currentPrice2 * quantity)}
              </p>
            </div>
          </div>
          {isError && (
            <div className="row  pb-3 pt-3">
              <div className="col-6 px-3 pt-1" style={{ color: "#fff" }}>
                {isError}
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-12 px-3 mt-5 mb-5">
              {!isConfirm && (
                <button
                  onClick={() => {
                    if (quantity > 0) {
                      // setIsModal(true);
                      setisError("");
                      setisConfirm(true);
                    } else {
                      setisError("Please enter valid quantity");
                    }
                  }}
                  className="buy_shares_btn"
                >
                  {IsBut ? "Buy" : "Sell"}
                </button>
              )}
              {isConfirm && (
                <button
                  disabled={isLoading2}
                  className="buy_shares_btn confirm_cash2"
                  onClick={() => buyStiock()}
                >
                  Confirm
                </button>
              )}
              {/* {isConfirm && isLoading2 && (
                <button className="buy_shares_btn confirm_cash2">
                  Confirm
                </button>
              )} */}
            </div>
          </div>
        </div>
      )}

      {IsModal && (
        <div
          className="modal fade modal_picks show"
          style={{ display: "inline-block" }}
        >
          <div className="modal-dialog px-4  modal-dialog-centered ctret2">
            <div className="modal-content modal_pick_con2 border_modal_light">
              <div className="modal-body p-4">
                <h6 className="selct_heading">
                  Are you sure you want to<br></br>
                  {IsBut ? "buy" : "sell"} this?
                </h6>
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn_okfineno"
                    onClick={() => {
                      setquantity("");
                      setIsModal(false);
                    }}
                  >
                    No
                  </button>
                  <button
                    disabled={isLoading}
                    className="btn_okfineyes"
                    onClick={buyStiock}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isInsufficient && (
        <div
          className="modal fade modal_picks show"
          style={{ display: "inline-block" }}
        >
          <div className="modal-dialog px-4  modal-dialog-centered ctret2">
            <div className="modal-content modal_pick_con">
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-12 mt-2">
                    <p className="balancemsg_funds">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-alert-triangle"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      {balanceMSG}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mt-2 text-center">
                    <button
                      className="btn_okfineno"
                      onClick={() => setisInsufficient(false)}
                    >
                      Cancel
                    </button>
                    &nbsp;&nbsp;
                    <button
                      className="btn_okfineyes"
                      onClick={() => {
                        // setIsAmount(true);
                        setisInsufficient(false);
                        localStorage.setItem("totalCash", cashBalance);
                        navigate("/addcash");
                      }}
                    >
                      Add Cash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {IsAmount && (
        <div
          className="modal fade modal_picks show"
          style={{ display: "inline-block" }}
        >
          <div className="modal-dialog px-4  modal-dialog-centered ctret2">
            <div className="modal-content modal_pick_con">
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-12 text-center">
                    <h5 className="add_cash_modal_heading">Please Add Cash</h5>
                  </div>
                  <div className="col-12">
                    <div className="form-group position-relative">
                      <div className="symbole_dollar_addcash">$</div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="input_addcash"
                        placeholder="Amount"
                        value={amount}
                        onKeyPress={numberOnlyValidation}
                        onChange={(e) => setamount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center mt-3">
                    <button
                      disabled={isLoading}
                      className="btn_okfineyes"
                      onClick={() => addCash()}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn_okfineno"
                      onClick={() => setIsAmount(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketSearch;
