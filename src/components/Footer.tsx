import news from "../assets/n1.svg";
import market from "../assets/n2.svg";
import portfolio from "../assets/n3.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet } from "react-modal-sheet";
import { useEffect, useState } from "react";
import MarketSearch from "./MarketSearch";
import NewsSearch from "./NewsSearch";
// import PortfolioSearch from "./PortfolioSearch";
const Footer = () => {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isOpen) {
      localStorage.setItem("isAPI", JSON.stringify(true));
    }
  }, [isOpen]);
  return (
    <footer>
      <button className="searchmarketbtn" onClick={() => setOpen(true)}>
        Search {location.pathname == "/news" && "news"}
        {location.pathname == "/" && "news"}{" "}
        {(location.pathname == "/market" ||
          location.pathname == "/marketdetail" ||
          location.pathname == "/addcash" ||
          location.pathname == "/addcashsuccess") &&
          "market"}{" "}
        {location.pathname == "/portfolio" && "market"}
      </button>
      <div className="footer">
        <button
          className={
            location.pathname == "/news" || location.pathname == "/"
              ? "active"
              : ""
          }
          onClick={() => {
            // props.currentPage(0);
            navigate("/news");
          }}
        >
          <img src={news}></img>
          News
        </button>
        <button
          className={location.pathname == "/market" ? "active" : ""}
          onClick={() => {
            // props.currentPage(1);
            navigate("/market");
          }}
        >
          <img src={market}></img>
          Markets
        </button>
        <button
          className={location.pathname == "/portfolio" ? "active" : ""}
          onClick={() => {
            // props.currentPage(2);
            navigate("/portfolio");
          }}
        >
          <img src={portfolio}></img>
          Portfolio
        </button>
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
              {(location.pathname == "/news" || location.pathname == "/") && (
                <NewsSearch />
              )}
              {(location.pathname == "/market" ||
                location.pathname == "/marketdetail" ||
                location.pathname == "/addcash" ||
                location.pathname == "/addcashsuccess") && <MarketSearch />}
              {location.pathname == "/portfolio" && <MarketSearch />}
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </footer>
  );
};

export default Footer;
