import { useNavigate } from "react-router-dom";

const AddCashSuccess = () => {
  const cash = localStorage.getItem("cash");
  const navigate = useNavigate();
  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  return (
    <>
      <div className="container pt-3">
        <div className="row pt-5 mt-5">
          <div className="col-12 pt-5 addcashpagheadsuccess text-center">
            <h1>Done!</h1>
            <p className="pt-3">
              Your cash balance is now: {formatCurrency(cash)}
            </p>
          </div>
          <div className="col-12 mt-5 pt-5">
            <button
              className="buy_shares_btn "
              onClick={() => {
                localStorage.removeItem("cash");
                navigate("/portfolio");
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCashSuccess;
