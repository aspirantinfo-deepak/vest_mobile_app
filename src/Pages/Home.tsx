import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import useUserStore from "../zustand/userStore";
import { useEffect } from "react";
import "./../assets/css/swap.css";

const Home = () => {
  const vestr = JSON.parse(localStorage.getItem("vestr")!);
  const location = useLocation();
  const { setName, setEmail, setPhone, setUsername, setToken } = useUserStore();

  useEffect(() => {
    if (vestr) {
      setName(vestr.name);
      setEmail(vestr.email);
      setPhone(vestr.phoneNum);
      setUsername(vestr.username);
      setToken(vestr.token);
    }
  }, []);

  return (
    <div className="headspace">
      <Outlet />
      {location.pathname != "/marketdetail" &&
        location.pathname != "/settings" &&
        location.pathname != "/addcash" &&
        location.pathname != "/addcashsuccess" && <Footer />}
      <SideBar />
    </div>
  );
};

export default Home;
