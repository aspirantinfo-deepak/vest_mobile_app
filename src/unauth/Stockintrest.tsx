import rocket from "../assets/rocket.svg";
import { useNavigate } from "react-router-dom";

const Stockintrest = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="log_wrapper headspace">
        <div className="wrap_head pt-4  px-4 text-left">
          <h2 className="shadowtext3">Add three or more news interests </h2>
          <p>We need some of your interests to populate the news page.</p>
          <button
            className="btn_customes mt-3 mb-3"
            onClick={() => {
              navigate("/stock-intrest");
            }}
          >
            Custom +
          </button>

          <div className="text-left mb-2">
            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Apple</label>

            <input type="checkbox" className="input_intrest" checked></input>
            <label className="lbl_intrest">Microsoft</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Nvidia</label>

            <input type="checkbox" className="input_intrest" checked></input>
            <label className="lbl_intrest">World events</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Stock market winners</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Stock market losers</label>

            <input type="checkbox" className="input_intrest" checked></input>
            <label className="lbl_intrest">Earnings reports</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">China</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Tesla</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Oil</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Asia</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Europe</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">US economy</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">IPO’s</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Wall Street</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Election</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Israel</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">World events</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Asia</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">Europe</label>

            <input type="checkbox" className="input_intrest"></input>
            <label className="lbl_intrest">US economy</label>
          </div>
          <div className="fix-posti-btns">
          <button
            type="button"
            onClick={() => {
              navigate("/news");
            }}
            className="btn_create_account mt-4 p "
          >
            Let's go
          </button></div>
        </div>
        <img src={rocket} className="img_opacity"></img>
      </div>
    </>
  );
};

export default Stockintrest;
