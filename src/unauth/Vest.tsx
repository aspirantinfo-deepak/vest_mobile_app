import rocket from "../assets/rocket.svg";
import { useNavigate } from "react-router-dom";

const Vest = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="log_wrapper headspace"
        onClick={() => {
          navigate("/create-account");
        }}
      >
        <div className="wrap_head mt-5 pt-5">
          <h2 className="shadowtext pt-5 mt-5">To the</h2>
          <p className="taptext mt-4">(tap)</p>
        </div>
        <img src={rocket}></img>
      </div>
    </>
  );
};

export default Vest;
