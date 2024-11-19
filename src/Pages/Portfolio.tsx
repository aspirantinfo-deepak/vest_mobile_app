import { useEffect, useState } from "react";
import graph from "../assets/graph.svg";
import set from "../assets/settings.svg";
import { useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../services/axiosService";
import FullScreenLoader from "../components/FullScreenLoader";
import dayjs from "dayjs";
import { formatCurrency as fc } from "./../helper/MarketHelper";
import {
  calculateReturns,
  fetchAllTransactionsGeneral,
  fetchCompanyDetails,
  fetchUserCashBalance,
  fetchUserPortfolio,
  formatAmount,
  formatPercentage,
  getUnixTimestampRange,
  isOption,
  portfolioIntervalMap,
} from "../helper/MarketHelper";
import PortFolioGraph from "../components/PortFolioGraph";
import AnimatedNumber from "../components/AnimatedNumber";
import { toast } from "react-toastify";
import { Sheet } from "react-modal-sheet";
import MarketSearch from "../components/MarketSearch";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Stats {
  [key: string]: {
    totalInvested: number;
    marketValue: number;
    realizedDollar: any;
    buyCount: any;
    sellCount: any;
    buyVolumeMap: any;
    sellVolumeMap: any;
  };
}
const Portfolio = () => {
  const [currentPrice, setcurrentPrice] = useState<any>("");
  const [currentPrice2, setcurrentPrice2] = useState<any>("");
  const [previousPrice, setpreviousPrice] = useState<any>("");
  const [sampleData, setsampleData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("1d");
  const [TradeHistory, setTradeHistory] = useState<any>([]);
  const [stats, setStats] = useState<Stats>({});
  const [portfolioStats, setPortfolioStats] = useState<any>({});
  const [mainPortfolio, setMainPortfolio] = useState<any>(null);
  const [livePriceMap, setLivePriceMap] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [cashBalance, setCashBalance] = useState<any>(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [tickerCompanyMap, setTickerCompanyMap] = useState<any>({});
  const [CompanyDetailsFetched, setCompanyDetailsFetched] = useState<any>("");
  const [CompanyStates, setCompanyStates] = useState(false);
  const [quantityMap, setQuantityMap] = useState(null);
  const [amount, setamount] = useState<any>("");
  const [IsAmount, setIsAmount] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [portfolioStartDate, setportfolioStartDate] = useState<any>("");
  useEffect(() => {
    if (!mainPortfolio || !mainPortfolio.assets) {
      return;
    }
    console.log(transactionsLoading);
    console.log(cashBalance);
    console.log(CompanyDetailsFetched);
    console.log(CompanyStates);
    const tickerSet = new Set(
      mainPortfolio.assets.map((stock: any) => stock.ticker)
    );
    const tickerArray = Array.from(tickerSet);

    // Function to fetch company details for all tickers
    const fetchAllCompanyDetails = async () => {
      try {
        const companyDetailsPromises = tickerArray.map(
          (ticker) =>
            fetchCompanyDetails(
              ticker,
              setCompanyStates,
              setCompanyDetailsFetched
            ) // Fetch company details for each ticker
        );

        // Wait for all promises to resolve
        const allCompanyDetails = await Promise.all(companyDetailsPromises);

        // Create a new object to map ticker to company details
        const tickerCompanyDetailsMap = allCompanyDetails.reduce(
          (acc: any, companyInfo: any, index: any) => {
            const ticker: any = tickerArray[index];
            acc[ticker] = companyInfo.name;
            return acc;
          },
          {}
        );

        // Update the state with the mapped data
        setTickerCompanyMap(tickerCompanyDetailsMap);
      } catch (error) {
        console.error("Error fetching company details for tickers:", error);
      }
    };
    fetchAllCompanyDetails();
  }, [mainPortfolio]);
  useEffect(() => {
    if (portfolioStats && tickerCompanyMap) {
      setTableLoading(false);
      // console.log(portfolioStats);
    }
  }, [portfolioStats, tickerCompanyMap]);

  useEffect(() => {
    getTradeHistory();
  }, []);
  useEffect(() => {
    fetchPortfolioDataPoints();
  }, [filter]);
  useEffect(() => {
    if (!mainPortfolio || !mainPortfolio.assets) return;

    const quantityMapTemp = mainPortfolio.assets.reduce(
      (map: any, stock: any) => {
        map[stock.ticker.toUpperCase()] = stock.quantity;
        return map;
      },
      {}
    );

    setQuantityMap(quantityMapTemp);
  }, [mainPortfolio]);
  useEffect(() => {
    // Ensure that both livePriceMap and quantityMap have been populated before calculating assetsValue
    if (!livePriceMap || !quantityMap) {
      return;
    }

    const liveValueMapTemp = Object.keys(livePriceMap).reduce(
      (map: any, ticker: any) => {
        const price = parseFloat(livePriceMap[ticker]);
        const quantity = quantityMap[ticker];
        if (price && quantity) {
          map[ticker] = price * quantity;
        }
        return map;
      },
      {}
    );

    const assetsValueTemp: any = Object.values(liveValueMapTemp).reduce(
      (total: any, value: any) => total + value,
      0
    );

    setcurrentPrice2(assetsValueTemp + cashBalance);
    setTimeout(() => {
      setcurrentPrice(assetsValueTemp + cashBalance);
    }, 10);
  }, [livePriceMap, quantityMap]);

  const getTradeHistory = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest<any>("/api/stockActions/transactions");

      if (response.status == 200) {
        // console.log(response.data);
        setTradeHistory(response.data);
        if (response.data.length > 0) {
          setportfolioStartDate(response.data[response.data.length - 1].date);
        }
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPortfolioDataPoints = async () => {
    try {
      let fromDateUnixMs;
      let multiplier, timespan;
      let toDateUnixMs = new Date().getTime();

      if (filter === "all time") {
        fromDateUnixMs = new Date("2024-08-01").getTime();
      } else {
        fromDateUnixMs = getUnixTimestampRange(filter);
      }

      const intervalArray =
        portfolioIntervalMap[filter as keyof typeof portfolioIntervalMap];

      multiplier = intervalArray[0];
      timespan = intervalArray[1];

      const response: any = await getRequest(
        "/api/markets/portfolio/datapoints",
        {
          params: {
            multiplier,
            timespan,
            fromDateUnixMs,
            toDateUnixMs,
          },
        }
      );
      var demosampleData = [];
      // var demoCategories = [];
      for (var i = 0; i < response.data.length; i++) {
        demosampleData.push({
          y: response.data[i].portfolioValue,
          x: response.data[i].time,
        });
        // demoCategories.push(response.data[i].time);
      }
      setpreviousPrice(response.data[0].portfolioValue);
      setsampleData(demosampleData);
      // setcategories(demoCategories);
    } catch (error) {
      console.error("Error fetching portfolio data points:", error);
    }
    // setDataFetched(true);
  };

  const calculatePercentageChange = (
    currentPrice1: any,
    previousPrice1: any
  ) => {
    if (previousPrice1 === 0) {
      return 0;
    }
    const change = ((currentPrice1 - previousPrice1) / previousPrice1) * 100;
    return change.toFixed(2);
  };
  useEffect(() => {
    fetchAllTransactionsGeneral(setTransactions).then(() =>
      setTransactionsLoading(false)
    );
    fetchUserPortfolio(setMainPortfolio);
    fetchUserCashBalance(setCashBalance);
    setTimeout(() => {
      fetchPortfolioDataPoints();
    }, 2000);
  }, []);
  useEffect(() => {
    const Interval = setInterval(() => {
      const isAPI = JSON.parse(localStorage.getItem("isAPI")!);

      if (isAPI) {
        fetchAllTransactionsGeneral(setTransactions).then(() =>
          setTransactionsLoading(false)
        );
        fetchUserPortfolio(setMainPortfolio);
        fetchUserCashBalance(setCashBalance);
        setTimeout(() => {
          fetchPortfolioDataPoints();
        }, 2000);
        localStorage.removeItem("isAPI");
      }
    }, 1000);
    return () => {
      clearInterval(Interval);
    };
  }, []);
  useEffect(() => {
    if (
      !mainPortfolio ||
      !mainPortfolio.assets ||
      !livePriceMap ||
      !tickerCompanyMap ||
      !transactions
    ) {
      return;
    }

    const buyMap: any = {};
    const sellMap: any = {};
    const buyVolumeMap: any = {};
    const sellVolumeMap: any = {};

    transactions.forEach((transaction: any) => {
      const { ticker, type } = transaction;
      if (type === "buy") {
        if (buyMap[ticker]) {
          buyMap[ticker]++;
          buyVolumeMap[ticker] += transaction.quantity * transaction.price;
        } else {
          buyMap[ticker] = 1;
          buyVolumeMap[ticker] = transaction.quantity * transaction.price;
        }
      }
      if (type === "sell") {
        if (sellMap[ticker]) {
          sellMap[ticker]++;
          sellVolumeMap[ticker] += transaction.quantity * transaction.price;
        } else {
          sellMap[ticker] = 1;
          sellVolumeMap[ticker] = transaction.quantity * transaction.price;
        }
      }
    });

    mainPortfolio.assets.forEach((stock: any) => {
      const ticker = stock.ticker.toUpperCase();

      // Get the live price for this asset
      let livePrice = livePriceMap[ticker];

      // Calculate returns using the function
      const {
        unrealizedDollar,
        unrealizedPercentage,
        realizedDollar,
        realizedPercentage,
      } = calculateReturns(stock, livePrice);

      // Calculate other stats (buyCount, sellCount, etc.)
      const stats = {
        totalInvested: stock.quantity * stock.avgBuyPrice,
        marketValue: livePrice * stock.quantity,
        unrealizedDollar,
        unrealizedPercentage,
        realizedDollar,
        realizedPercentage,
        buyCount: buyMap[ticker] || 0,
        sellCount: sellMap[ticker] || 0,
        buyVolumeMap: buyVolumeMap[ticker] || 0,
        sellVolumeMap: sellVolumeMap[ticker] || 0,
      };

      setStats((prevStats) => ({
        ...prevStats,
        [ticker]: stats,
      }));
    });
  }, [mainPortfolio, livePriceMap, transactions, tickerCompanyMap]);
  useEffect(() => {
    let totalInvested = Object.keys(stats).reduce((total, ticker) => {
      return total + stats[ticker].totalInvested;
    }, 0);

    let marketValue = Object.keys(stats).reduce((total, ticker) => {
      return total + stats[ticker].marketValue;
    }, 0);

    let totalUnrealizedDollar = marketValue - totalInvested;
    let totalUnrealizedPercentage =
      totalInvested > 0 ? (totalUnrealizedDollar / totalInvested) * 100 : 0;

    // Calculate total realized dollar and percentage
    let totalRealizedDollar = Object.keys(stats).reduce((total, ticker) => {
      return total + stats[ticker].realizedDollar;
    }, 0);

    // Updated calculation for totalRealizedPercentage
    let totalRealizedPercentage =
      totalInvested > 0 ? (totalRealizedDollar / totalInvested) * 100 : 0;

    let totalBuys = Object.keys(stats).reduce((total, ticker) => {
      return total + stats[ticker].buyCount;
    }, 0);

    let totalSells = Object.keys(stats).reduce((total, ticker) => {
      return total + stats[ticker].sellCount;
    }, 0);
    let totalBuyVolume = Object.keys(stats).reduce((total, ticker) => {
      return total + stats[ticker].buyVolumeMap;
    }, 0);

    let totalSellVolume = Object.keys(stats).reduce((total, ticker) => {
      return total + stats[ticker].sellVolumeMap;
    }, 0);
    setPortfolioStats({
      totalInvested,
      marketValue,
      totalUnrealizedPercentage,
      totalUnrealizedDollar,
      totalRealizedDollar,
      totalRealizedPercentage,
      totalBuys,
      totalSells,
      totalBuyVolume,
      totalSellVolume,
      ...stats,
    });
  }, [stats]);
  useEffect(() => {
    if (!mainPortfolio) return;

    const fetchCurrentPrices = async () => {
      try {
        const pricePromises = mainPortfolio.assets.map((stock: any) => {
          const ticker = stock.ticker.toUpperCase();
          return getRequest(`/api/markets/dailychange?ticker=${ticker}`)
            .then((response: any) => ({
              ticker,
              price: response.data.currentPrice.toFixed(2),
            }))
            .catch((error) => {
              console.error(`Error fetching price for ${ticker}:`, error);
              return { ticker, price: "--" };
            });
        });

        const prices = await Promise.all(pricePromises);
        const updatedPriceMap = prices.reduce((map, { ticker, price }) => {
          if (isOption(ticker)) {
            price = price * 100;
          }
          map[ticker] = price;
          return map;
        }, {});

        setLivePriceMap((prevMap: any) => ({ ...prevMap, ...updatedPriceMap }));
      } catch (error) {
        console.error("Error fetching current prices:", error);
      }
    };

    fetchCurrentPrices();
  }, [mainPortfolio]);

  const renderTable = () => {
    if (tableLoading) {
      return "";
    }
    const keysToUse = Object.keys(portfolioStats).filter((ticker) => {
      return (
        ticker !== "totalInvested" &&
        ticker !== "marketValue" &&
        ticker !== "totalUnrealizedPercentage" &&
        ticker !== "totalUnrealizedDollar" &&
        ticker !== "totalRealizedDollar" &&
        ticker !== "totalRealizedPercentage" &&
        ticker !== "totalBuys" &&
        ticker !== "totalSells" &&
        ticker !== "totalBuyVolume" &&
        ticker !== "totalSellVolume"
      );
    });

    if (transactions?.length === 0) {
      return;
    }
    return (
      <>
        {keysToUse.map((ticker: any, i: number) => (
          <>
            <div
              className={
                "row py-3 stock_names_prrice" +
                (i === keysToUse.length - 1 ? "" : " border-bottom1")
              }
              onClick={() => {
                localStorage.setItem(
                  "currentTicker",
                  JSON.stringify({ ticker: ticker })
                );
                navigate("/marketdetail");
              }}
            >
              <div className="col-7">
                <p className="company_name text_ov_ec">
                  {tickerCompanyMap[ticker] || "N/A"}{" "}
                </p>
                <p className="stockname">{ticker}</p>
              </div>
              <div className="col-5 text-right">
                <p className="company_name">
                  {formatCurrency(portfolioStats[ticker]?.totalInvested) ||
                    "--"}
                </p>
                <p
                  className={
                    portfolioStats[ticker]?.unrealizedDollar >= 0
                      ? "uptrend"
                      : "downtrend"
                  }
                >
                  {portfolioStats[ticker]?.unrealizedDollar >= 0 && (
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
                      className="feather feather-arrow-up "
                    >
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  )}
                  {portfolioStats[ticker]?.unrealizedDollar < 0 && (
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
                      className="feather feather-arrow-up "
                    >
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  )}
                  {formatPercentage(
                    portfolioStats[ticker]?.unrealizedPercentage
                  )}
                </p>
              </div>
            </div>

            <div className="col-12 pt-2 stock_details">
              <p className="stockname">
                Market value:
                {formatCurrency(portfolioStats[ticker]?.marketValue) || "--"}
                <br></br>
                Invested:
                {formatCurrency(portfolioStats[ticker]?.totalInvested) || "--"}
                <br></br>
                ROI: {formatAmount(portfolioStats[ticker]?.realizedDollar)} (
                {formatPercentage(portfolioStats[ticker]?.realizedPercentage)}){" "}
                <br></br>
                Shares buy:{" "}
                {portfolioStats[ticker]?.buyCount !== undefined
                  ? portfolioStats[ticker].buyCount
                  : "--"}
                <br></br>
                Shares sell:{" "}
                {portfolioStats[ticker]?.sellCount !== undefined
                  ? portfolioStats[ticker].sellCount
                  : "--"}
                <br></br>
              </p>
            </div>
          </>
        ))}
      </>
    );
  };
  const formatCurrency = (value: number, fraction: number = 2) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: fraction,
      minimumFractionDigits: fraction,
    }).format(value);
  };
  const formatNumber = (value: number, fraction: number = 2) => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      maximumFractionDigits: fraction,
      minimumFractionDigits: fraction,
    }).format(value);
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
        setCashBalance(response.data.cash);
        fetchAllTransactionsGeneral(setTransactions).then(() =>
          setTransactionsLoading(false)
        );
        fetchUserPortfolio(setMainPortfolio);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const numberOnlyValidation = (event: any) => {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  };
  // Function to determine opacity based on change
  const getOpacity = (change: number) => {
    if (change <= 1) return 0.2;
    if (change <= 3) return 0.3;
    if (change <= 5) return 0.4;
    if (change <= 10) return 0.5;
    if (change <= 15) return 0.6;
    return 0.7;
  };
  const getTransactionStyle = (type: string, changePercent: number) => {
    const op = getOpacity(Math.abs(changePercent));
    const color = changePercent > 0 ? "0, 255, 0" : "255, 0, 0";
    const backgroundColor =
      type === "buy" ? `rgba(${color}, ${op})` : "transparent";
    const border = type !== "buy" ? `0.5px solid rgba(${color})` : "none";
    return { backgroundColor, border };
  };

  return (
    <>
      <div className="container pt-3 pb-5 mb-5 ">
        <FullScreenLoader isLoading={isLoading} message="Please wait..." />
        <div className="row pt-3">
          <div className="col-9">
            <p className="main-port3">Portfolio</p>
            <h3
              className="headingport"
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
                currentPrice - previousPrice >= 0 ? "trends" : "trends2"
              }
            >
              {formatCurrency(currentPrice - previousPrice)} (
              {currentPrice &&
                previousPrice &&
                calculatePercentageChange(currentPrice, previousPrice)}
              %)&nbsp;
              <span>
                {filter == "live" && "today"} {filter == "1d" && "past day"}{" "}
                {filter == "1w" && "past week"}{" "}
                {filter == "3m" && "past 3 months"}{" "}
                {filter == "1y" && "past year"} {filter == "all time" && "all"}
              </span>
            </p>
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

        <div className="row">
          <div className="col-12" style={{ padding: 0 }}>
            {sampleData.length > 0 && currentPrice2 && previousPrice && (
              <PortFolioGraph
                data={sampleData}
                setcurrentPrice={setcurrentPrice}
                currentPrice={currentPrice2}
                previousPrice={previousPrice}
              />
            )}
          </div>
          <div className="col-12 pt-3">
            <ul className="dayul portfolio_dayul">
              <li
                onClick={() => setFilter("live")}
                className={filter == "live" ? "active" : ""}
              >
                live
              </li>
              <li
                onClick={() => setFilter("1d")}
                className={filter == "1d" ? "active" : ""}
              >
                1d
              </li>
              <li
                onClick={() => setFilter("1w")}
                className={filter == "1w" ? "active" : ""}
              >
                1w
              </li>
              <li
                onClick={() => setFilter("3m")}
                className={filter == "3m" ? "active" : ""}
              >
                3m
              </li>
              <li
                onClick={() => setFilter("1y")}
                className={filter == "1y" ? "active" : ""}
              >
                1y
              </li>
              <li
                onClick={() => setFilter("all time")}
                className={filter == "all time" ? "active" : ""}
              >
                all
              </li>
            </ul>
          </div>
        </div>

        <div className="row  mt-4">
          <div className="col-12">
            <p className="invested">
              Cash:&nbsp;
              <span className="color-white">
                {" "}
                {cashBalance && formatCurrency(cashBalance)}
              </span>
            </p>
            <div className="row pt-3">
              <div className="col-12">
                <p className="invested d-flex">
                  ROI:&nbsp;
                  <span
                    className={
                      portfolioStats?.totalUnrealizedPercentage >= 0
                        ? "uptrend"
                        : "downtrend"
                    }
                  >
                    {" "}
                    {portfolioStats?.totalUnrealizedPercentage >= 0 && (
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
                    )}
                    {portfolioStats?.totalUnrealizedPercentage < 0 && (
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
                    )}
                    {portfolioStats?.totalUnrealizedDollar &&
                      formatCurrency(portfolioStats?.totalUnrealizedDollar)}
                    &nbsp; (
                    {portfolioStats?.totalUnrealizedPercentage &&
                      formatNumber(portfolioStats?.totalUnrealizedPercentage)}
                    %)
                  </span>
                  &nbsp;
                </p>
              </div>
              {/* <div className="col-6">
                <p className="invested d-flex">
                  ROI:&nbsp;
                  <span
                    className={
                      portfolioStats?.totalUnrealizedDollar >= 0
                        ? "uptrend"
                        : "downtrend"
                    }
                  >
                    {" "}
                    {portfolioStats?.totalUnrealizedDollar >= 0 && (
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
                    )}
                    {portfolioStats?.totalUnrealizedDollar < 0 && (
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
                    )}
                    {portfolioStats?.totalUnrealizedDollar &&
                      formatCurrency(portfolioStats?.totalUnrealizedDollar)}
                  </span>
                  &nbsp;
                </p>
              </div> */}
            </div>

            <div className="row pt-4 pb-3">
              <div className="col-12">
                <button
                  className="addcash_btn"
                  onClick={() => {
                    localStorage.setItem("totalCash", cashBalance);
                    navigate("/addcash");
                  }}
                >
                  Add cash
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-2">
          <h2 className="trans_history_head mb-2 pb-0">Holdings</h2>
        </div>
        {renderTable()}

        <div className="row  mt-4">
          <div className="col-12 mt-2">
            <h2 className="trans_history_head mb-2 pb-2">Advanced stats</h2>
          </div>
          <div className="col-12 mb-2 advancee_stats_para">
            <p>
              <span>Buys:</span>{" "}
              {portfolioStats.totalBuys !== undefined
                ? fc(portfolioStats.totalBuys, 0)
                : "--"}
            </p>
            <p>
              <span>Buy vol:</span>{" "}
              {portfolioStats.totalBuyVolume !== undefined
                ? `$${fc(portfolioStats?.totalBuyVolume)}`
                : "--"}
            </p>
            <p>
              <span>Sells:</span>{" "}
              {portfolioStats.totalSells !== undefined
                ? fc(portfolioStats.totalSells, 0)
                : "--"}
            </p>
            <p>
              <span>Sell vol:</span>{" "}
              {portfolioStats.totalSellVolume !== undefined
                ? `$${fc(portfolioStats?.totalSellVolume)}`
                : "--"}
            </p>

            <p>
              <span>Portfolio opened:</span> {!portfolioStartDate && "N/A"}
              {portfolioStartDate &&
                dayjs(portfolioStartDate).format("MMM DD, YYYY")}
            </p>
          </div>
        </div>

        <div className="row mb-5 mt-2 py-5">
          <div className="col-12 mt-2">
            <h2 className="trans_history_head mb-3 pb-1">
              Transaction history
            </h2>
          </div>
          {TradeHistory.length == 0 && (
            <div className="col-12 mb-5">
              <p className="no_transactions" style={{ color: "#fff" }}>
                No transactions yet
              </p>
            </div>
          )}
          <div className="col-12 mb-5">
            {TradeHistory.map((item: any, key: any) => (
              <div
                key={key}
                className="card_trans_histor mb-3"
                style={getTransactionStyle(item.type, item.changePercentage)}
              >
                <p className="tran_hitr_p">
                  {item.type == "buy" ? "BUY" : "SELL"} -{" "}
                  {dayjs(item.date).format("MMMM DD, YYYY HH:mm:ss EST")}{" "}
                </p>
                <div className="row">
                  <div className="col-12 py-2 d-flex">
                    <p className="tran_hitr_p fix_wwed">{item.ticker} </p>
                    <p className="tran_hitr_p2">
                      {tickerCompanyMap[item.ticker]}
                    </p>
                  </div>
                  <div className="col-6 py-1  d-flex">
                    <p className="tran_hitr_p fix_wwed">Price </p>
                    <p className="tran_hitr_p2">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="col-6 py-1 d-flex">
                    <p className="tran_hitr_p fix_wwed2">ROI: </p>
                    <p
                      className={
                        item.changePercentage < 0
                          ? "tran_hitr_p2 neg_clr"
                          : "tran_hitr_p2 postive_clr "
                      }
                    >
                      {formatNumber(
                        (item.changePercentage * item.totalAmount) / 100
                      )}
                    </p>
                  </div>
                  <div className="col-6 py-1 d-flex">
                    <p className="tran_hitr_p fix_wwed">Shares </p>
                    <p className="tran_hitr_p2 ">
                      {formatNumber(item.quantity)}
                    </p>
                  </div>
                  <div className="col-6 py-1 d-flex">
                    <p className="tran_hitr_p fix_wwed2">ROI: </p>
                    <p
                      className={
                        item.changePercentage < 0
                          ? "tran_hitr_p2 neg_clr"
                          : "tran_hitr_p2 postive_clr "
                      }
                    >
                      {formatNumber(item.changePercentage)}%
                    </p>
                  </div>
                  <div className="col-6 py-1 d-flex">
                    <p className="tran_hitr_p fix_wwed">Total </p>
                    <p className="tran_hitr_p2 fix_wwed">
                      {formatCurrency(item.totalAmount)}
                    </p>
                  </div>
                  <div className="col-6 py-1 d-flex">
                    <p className="tran_hitr_p fix_wwed2">MV: </p>
                    <p className="tran_hitr_p2 ">
                      {formatCurrency(item.currentPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
                  <div className="col-12 pt-2 pb-2">
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

      <div
        className="modal fade"
        id="exampleModal44"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content animate-bottom pt-4">
            <button
              type="button"
              className="btn-close-modal "
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
                  <div className="col-12 border-bottom1 px-0 pb-3">
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
                  className="row py-3 border-bottom1"
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
      {IsAmount && (
        <div
          className="modal fade modal_picks show"
          style={{ display: "inline-block" }}
        >
          <div className="modal-dialog px-4  modal-dialog-centered ctret2">
            <div className="modal-content modal_pick_con bg_gyreeys position-relative">
              <button
                className="modal_close_btn"
                onClick={() => setIsAmount(false)}
              >
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
                  className="feather feather-x"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <div className="modal-body p-3">
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
                        className=" input_addcash"
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
                      disabled={!amount || amount <= 0}
                      className="btn_okfineyes"
                      onClick={() => addCash()}
                    >
                      Confirm
                    </button>
                    &nbsp;&nbsp;&nbsp;
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
              <MarketSearch />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default Portfolio;
