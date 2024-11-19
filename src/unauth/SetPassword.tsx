import { useState } from "react";
import rocket from "../assets/rocket.svg";
import { useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";

import { postRequest } from "../services/axiosService";
import useUserStore from "../zustand/userStore";
import FullScreenLoader from "../components/FullScreenLoader";

const SetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { name, email, username, phone, setOTP, setToken } = useUserStore();
  const [otp2, setOtp2] = useState<any>("");
  const [otp, setOtp] = useState<any>("");
  const navigate = useNavigate();
  const [firstOTP, setfirstOTP] = useState(false);
  const [isError, setisError] = useState("");
  const submit = async () => {
    if (firstOTP) {
      if (otp.length == 6) {
        if (otp == otp2) {
          setisError("");
          try {
            setIsLoading(true);
            const response: any = await postRequest<{
              phone: string;
              otp: string;
            }>("/api/auth/create-otp", {
              phone: phone,
              email: email,
              username: username,
              name: name,
              otp: otp,
            });
            if (response.status === 200) {
              setIsLoading(false);
              setOTP(otp);
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
                  setisError(response.data);
                  setIsLoading(false);
                  setOTP(otp);
                  localStorage.setItem(
                    "vestr",
                    JSON.stringify(response.data.user)
                  );
                  setToken(response.data.user);
                  navigate("/intrest", { replace: true });
                }
              } catch (error: any) {
                setIsLoading(false);
                console.error("Error creating user:", error);
                setisError(error.response.data);
              }
            }
          } catch (error: any) {
            setIsLoading(false);
            console.error("Error creating user:", error);
            setisError(error.response.data);
          }
        } else {
          setisError("Password is mismatched.");
        }
      } else {
        setisError("Password is required.");
      }
    } else {
      if (otp2.length == 6) {
        setisError("");
        setfirstOTP(true);
      } else {
        setisError("Password is required.");
      }
    }
  };
  return (
    <>
      <div className="log_wrapper headspace">
        <div className="wrap_head pt-5 mt-5 px-4">
          <FullScreenLoader isLoading={isLoading} message="Please wait..." />
          <h2 className="shadowtext mt-5  mb-5 pb-5">
            {!firstOTP && "Set"} {firstOTP && "Confirm"} password
          </h2>
          <form>
            {!firstOTP && (
              <OTPInput
                containerStyle={"otp_input mb-4"}
                value={otp2}
                onChange={setOtp2}
                inputType={"number"}
                numInputs={6}
                renderInput={(props) => <input {...props} />}
              />
            )}
            {firstOTP && (
              <OTPInput
                containerStyle={"otp_input mb-4"}
                value={otp}
                onChange={setOtp}
                inputType={"number"}
                numInputs={6}
                renderInput={(props) => <input {...props} />}
              />
            )}
            {isError && (
              <span
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                {isError}
              </span>
            )}
            <div className="pt-5">
              <button
                type="button"
                className="btn_create_account mt-5"
                onClick={() => {
                  submit();
                  // navigate("/confirm-password");
                }}
              >
                {!firstOTP && "Set password"}
                {firstOTP && "Let's go"}
              </button>
              <button
                type="button"
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

export default SetPassword;
