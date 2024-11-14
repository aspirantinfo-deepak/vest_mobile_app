import { getRequest } from "../services/axiosService";

export const getUnixTimestampRange = (filter: any) => {
  const currentDate = new Date(); // Get current time
  switch (filter) {
    case "1y":
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      break;
    case "3m":
      currentDate.setMonth(currentDate.getMonth() - 3);
      break;
    case "1m":
      currentDate.setMonth(currentDate.getMonth() - 1);
      break;
    case "1w":
      currentDate.setDate(currentDate.getDate() - 7);
      break;
    case "1d":
      currentDate.setDate(currentDate.getDate() - 1);
      break;
    case "1h":
      currentDate.setHours(currentDate.getHours() - 1);
      break;
    case "live":
      return Math.floor(currentDate.getTime() - 300000); // 5 minutes ago
    default:
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      break;
  }
  // Return the Unix timestamp (in seconds)
  return Math.floor(currentDate.getTime());
};

export const portfolioIntervalMap = {
  "all time": ["12", "hour"],
  "1y": ["12", "hour"],
  "3m": ["3", "hour"],
  "1m": ["1", "hour"],
  "1w": ["15", "minute"],
  "1d": ["1", "minute"],
  "1h": ["14", "second"],
  live: ["1", "second"],
};
export function calculateReturns(asset: any, livePrice: any) {
  // Calculate total invested amount for the asset
  const totalInvested = asset.quantity * asset.avgBuyPrice;

  // Calculate current market value of the asset
  const marketValue = livePrice * asset.quantity;

  // Calculate unrealized gains/losses
  const unrealizedDollar = marketValue - totalInvested;
  const unrealizedPercentage =
    totalInvested > 0 ? (unrealizedDollar / totalInvested) * 100 : 0;

  // Initialize realized gains/losses
  let realizedDollar = 0;
  let realizedPercentage = 0;

  // Calculate realized gains/losses if there are any sold shares
  if (asset.avgSellPrice && asset.quantitySold > 0) {
    realizedDollar =
      (asset.avgSellPrice - asset.avgBuyPrice) * asset.quantitySold;
    realizedPercentage =
      asset.avgBuyPrice > 0
        ? (realizedDollar / (asset.avgBuyPrice * asset.quantitySold)) * 100
        : 0;
  }

  // Return only unrealized and realized returns
  return {
    unrealizedDollar,
    unrealizedPercentage,
    realizedDollar,
    realizedPercentage,
  };
}
export const fetchAllTransactionsGeneral = async (setAllTransactions: any) => {
  try {
    const response = await getRequest("/api/stockActions/transactions");
    setAllTransactions(response.data);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
  }
};
export const fetchUserPortfolio = async (setUserPortfolio: any) => {
  try {
    const response = await getRequest("/api/stockActions/portfolio");

    setUserPortfolio(response.data);
  } catch (error) {
    console.error("Error fetching user portfolio:", error);
  }
};
export const fetchUserCashBalance = async (setCashBalance: any) => {
  try {
    const response = await getRequest("/api/stockActions/cash");
    setCashBalance(response.data);
  } catch (error) {
    console.error("Error fetching user cash balance:", error);
  }
};
export const isOption = (ticker: any) => {
  if (typeof ticker !== "string") {
    return false;
  }
  return ticker.startsWith("O:");
};
export const fetchCompanyDetails = async (
  ticker: any,
  setCompanyStates: any,
  setCompanyDetailsFetched: any
) => {
  try {
    const companyResponse = await getRequest(
      `/api/polygon/stock/${ticker}/company-details` // Call your backend API
    );
    const companyInfo = companyResponse.data;
    if (typeof setCompanyDetailsFetched === "function") {
      setCompanyStates(companyInfo);
    }
    return companyInfo;
  } catch (error) {
    console.error("Error fetching company details from backend:", error);
  }
  if (typeof setCompanyDetailsFetched === "function") {
    setCompanyDetailsFetched(true);
  }
};
export const formatAmount = (amount: any) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "+0.00";
  }
  const sign = amount >= 0 ? "+" : "-";
  const formattedAmount = Math.abs(amount).toFixed(2);
  return `${sign}${formattedAmount}`;
};

// Helper function to format percentages with sign
export const formatPercentage = (percentage: any) => {
  if (typeof percentage !== "number" || isNaN(percentage)) {
    return "+0.00%";
  }
  const sign = percentage >= 0 ? "+" : "-";
  const formattedPercentage = Math.abs(percentage).toFixed(2);
  return `${sign}${formattedPercentage}%`;
};

export const formatCurrency = (value: any, decimalPlaces = 2) => {
  let originalValue = value;
  const numValue = typeof value === "number" ? value : Number(value);
  if (isNaN(numValue)) {
    return originalValue;
  }

  return numValue.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};
export const fetchAllTransactions = async (
  ticker: any,
  setAllTransactions: any
) => {
  try {
    const response = await getRequest(
      `/api/stockActions/transactions/${ticker}`
    );
    setAllTransactions(response.data);
  } catch (error) {
    console.error("Error fetching user transactions:", error);
  }
};
