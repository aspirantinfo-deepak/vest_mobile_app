import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../services/axiosService";
import FullScreenLoader from "../components/FullScreenLoader";
import { toast } from "react-toastify";
import CurrencyInput from "../components/CurrencyInput";

const AddCash = () => {
  const totalCash = JSON.parse(localStorage.getItem("totalCash")!);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setamount] = useState<any>("");
  const [isConfirm, setisConfirm] = useState(false);

  const addCash = async () => {
    setIsLoading(true);
    try {
      const response: any = await postRequest(`/api/stockActions/addCash`, {
        amount: Number(amount),
      });
      if (response.status == 200) {
        setamount("");
        localStorage.removeItem("totalCash");
        setisConfirm(false);
        localStorage.setItem("cash", JSON.stringify(response.data.cash));
        navigate("/addcashsuccess");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  return (
    <>
      <div className="container pt-3">
        <FullScreenLoader isLoading={isLoading} message="Please wait..." />
        <div className="row">
          <div className="col-12 mt-3 pt-1">
            <button
              className="back-btn"
              onClick={() => {
                if (isConfirm) {
                  setisConfirm(false);
                } else {
                  setisConfirm(false);
                  localStorage.removeItem("totalCash");
                  navigate(-1);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="feather feather-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              &nbsp; Back
            </button>
          </div>
        </div>
        <div className="row pt-4">
          <div className="col-12 addcashpaghead">
            <h1>Add cash</h1>
            <p className="pt-2">
              You currently have {formatCurrency(totalCash)} in cash
            </p>
          </div>
          <div className="col-12 py-5">
            {!isConfirm && (
              <CurrencyInput
                value={amount}
                onChange={setamount}
                prefix="$"
                className="addcash_inputs"
                placeholder="$0"
              />
              // <input
              //   type="text"
              //   className="addcash_inputs"
              //   placeholder="$0"
              //   inputMode="numeric"
              //   pattern="[0-9]*"
              //   value={amount}
              //   onKeyPress={numberOnlyValidation}
              //   onChange={(e) => setamount(e.target.value)}
              // ></input>
            )}
            {isConfirm && (
              <p className="addcash_inputs">{formatCurrency(amount)}</p>
            )}
          </div>
          <div className="col-12 mt-4">
            {!isConfirm && (
              <button
                className="buy_shares_btn "
                disabled={!amount || amount <= 0}
                onClick={() => setisConfirm(true)}
              >
                Add cash
              </button>
            )}
            {isConfirm && (
              <button
                disabled={isLoading}
                className="buy_shares_btn confirm_cash2"
                onClick={() => addCash()}
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCash;
