import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import useUserStore from "../zustand/userStore";
import { useEffect, useRef } from "react";
import "./../assets/css/swap.css";

const Home = () => {
  const navigate = useNavigate();
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

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const swipeThreshold = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchEndX.current - touchStartX.current;
      const stayPortfolio = localStorage.getItem("stayPortfolio");
      if (Math.abs(distance) > swipeThreshold) {
        if (distance > 0) {
          console.log("Swiped Right");
          if (location.pathname == "/portfolio") {
            if (!stayPortfolio) {
              navigate("/market");
            }
          }
          if (location.pathname == "/market") {
            navigate("/news");
          }
        } else {
          if (location.pathname == "/") {
            navigate("/market");
          }
          if (location.pathname == "/news") {
            navigate("/market");
          }
          if (location.pathname == "/market") {
            navigate("/portfolio");
          }
          console.log("Swiped Left");
        }
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="headspace"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
