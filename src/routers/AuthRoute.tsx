import { createBrowserRouter, Navigate } from "react-router-dom";
import Markets from "./../Pages/Markets";
import Portfolio from "./../Pages/Portfolio";
import MarketDetail from "./../Pages/MarketDetail";

import News from "./../Pages/News";
import SearchNews from "./../Pages/SearchNews";
import WatchList from "./../Pages/WatchList";
import VestPlus from "./../Pages/VestPlus";
import Settings from "./../Pages/Settings";
import Account from "./../Pages/Account";

import Marketgrid from "./../Pages/Marketgrid";
import ModalComponent from "./../Pages/ModalComponent";
import Home from "../Pages/Home";
import AddCash from "../Pages/AddCash";
import AddCashSuccess from "../Pages/AddCashSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <News />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "search-news",
        element: <SearchNews />,
      },
      {
        path: "marketgrid",
        element: <Marketgrid />,
      },
      {
        path: "modal",
        element: <ModalComponent />,
      },

      {
        path: "market",
        element: <Markets />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "marketdetail",
        element: <MarketDetail />,
      },
      {
        path: "watchlist",
        element: <WatchList />,
      },
      {
        path: "vestplus",
        element: <VestPlus />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "addcash",
        element: <AddCash />,
      },
      {
        path: "addcashsuccess",
        element: <AddCashSuccess />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
export default router;
