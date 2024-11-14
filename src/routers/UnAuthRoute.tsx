import { createBrowserRouter, Navigate } from "react-router-dom";
import Vest from "../unauth/Vest";
import Phone from "./../unauth/Phone";
import CreateAccount from "./../unauth/CreateAccount";
import EnterPassword from "./../unauth/EnterPassword";
import ConfirmPassword from "./../unauth/ConfirmPassword";
import SetPassword from "./../unauth/SetPassword";
import Intrest from "./../unauth/Intrest";
import IntrestCustom from "./../unauth/IntrestCustom";
import Stock from "./../unauth/Stock";
import Stockintrest from "./../unauth/Stockintrest";
import Resetpassword from "./../unauth/Resetpassword";

const unrouter = createBrowserRouter([
  {
    path: "/",
    element: <Vest />,
  },
  {
    path: "/phone",
    element: <Phone />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/enter-password",
    element: <EnterPassword />,
  },
  {
    path: "/confirm-password",
    element: <ConfirmPassword />,
  },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/intrest",
    element: <Intrest />,
  },
  {
    path: "/intrest-custome",
    element: <IntrestCustom />,
  },
  {
    path: "/stock",
    element: <Stock />,
  },
  {
    path: "/stock-intrest",
    element: <Stockintrest />,
  },
  {
    path: "/resetpassword",
    element: <Resetpassword />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
export default unrouter;
