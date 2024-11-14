import rocket from "../assets/rocket.svg";
import { useNavigate } from "react-router-dom";

const ConfirmPassword = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="log_wrapper headspace">
        <div className="wrap_head pt-5 mt-5 px-5">
          <h2 className="shadowtext mt-5 pt-5 mb-5 pb-5">Confirm password</h2>
          <form>
            <div className="otp_input">
              <input type="text"></input>
              <input type="text"></input>
              <input type="text"></input>
              <input type="text"></input>
              <input type="text"></input>
              <input type="text"></input>
            </div>
            <div className="pt-5">
              <button
                className="btn_create_account mt-5 "
                onClick={() => {
                  navigate("/intrest");
                }}
              >
                Let's go
              </button>
              <button
                className="btn_sign_in"
                onClick={() => {
                  navigate("/phone");
                }}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
        <img src={rocket} className="img_opacity"></img>
      </div>
    </>
  );
};

export default ConfirmPassword;
