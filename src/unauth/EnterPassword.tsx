import { useNavigate } from "react-router-dom";
import rocket from "../assets/rocket.svg";
import OTPInput from "react-otp-input";
import { useState } from "react";
import { toast } from "react-toastify";
import { postRequest } from "../services/axiosService";
import useUserStore from "../zustand/userStore";
import FullScreenLoader from "../components/FullScreenLoader";

const EnterPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { phone, setOTP, setToken } = useUserStore();
  const [otp, setOtp] = useState<any>("");
  const submit = async () => {
    if (otp.length == 6) {
      try {
        setIsLoading(true);
        const response: any = await postRequest<{
          phone: string;
          otp: string;
        }>("/api/auth/verify-otp", {
          phone: phone,
          otp: otp,
        });
        if (response.status === 200) {
          toast.success(response.data);
          setIsLoading(false);
          setOTP(otp);
          localStorage.setItem("vestr", JSON.stringify(response.data.user));
          setToken(response.data.user);
          window.location.assign("/");
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error("Error creating user:", error);
        toast.error(error.response.data);
      }
    } else {
      toast.error("Password is required");
    }
  };
  return (
    <>
      <div className="log_wrapper headspace">
        <div className="wrap_head pt-5 mt-5 px-5">
          <FullScreenLoader isLoading={isLoading} message="Please wait..." />
          <h2 className="shadowtext mt-5 pt-5 mb-5 pb-5">Enter password</h2>
          <form>
            <OTPInput
              containerStyle={"otp_input mb-4"}
              value={otp}
              onChange={setOtp}
              inputType={"number"}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
            />
            <div className="pt-5">
              <button
                type="button"
                onClick={() => {
                  submit();
                }}
                className="btn_create_account mt-5 "
              >
                Let's go
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate("/create-account");
                }}
                className="btn_sign_in"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
        <img src={rocket} className="img_opacity"></img>
      </div>
    </>
  );
};

export default EnterPassword;
