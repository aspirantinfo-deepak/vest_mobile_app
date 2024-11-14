import rocket from "../assets/rocket.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postRequest } from "../services/axiosService";
import { toast } from "react-toastify";
import useUserStore from "../zustand/userStore";
import FullScreenLoader from "../components/FullScreenLoader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
const Phone = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setPhone } = useUserStore();
  const formSchema = Yup.object().shape({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Enter 10 digits Phone number."),
  });
  const formOptions = {
    resolver: yupResolver(formSchema),
  };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const submit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const response: any = await postRequest<{
        phone: string;
        otp: string;
      }>("/api/auth/signin", data);
      if (response.status === 200) {
        toast.success(response.data);
        setIsLoading(false);
        setPhone(data.phone);
        navigate("/enter-password", { replace: true });
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
      toast.error(error.response.data);
    }
  });
  const numberOnlyValidation = (event: any) => {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  };
  return (
    <>
      <div className="log_wrapper headspace">
        <div className="wrap_head pt-5 mt-5 px-5">
          <FullScreenLoader isLoading={isLoading} message="Please wait..." />
          <h2 className="shadowtext mt-5 pt-5 mb-5 pb-5">Phone number</h2>
          <form>
            <div className="otp_input2">
              <input
                pattern="[0-9]*"
                inputMode="numeric"
                onKeyPress={numberOnlyValidation}
                type="text"
                maxLength={10}
                {...register("phone", { required: true })}
              ></input>
              <span
                style={{
                  color: "#fff",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                {errors.phone?.message?.toString()}
              </span>
            </div>
            <div className="pt-5">
              <button
                type="button"
                onClick={() => {
                  submit();
                }}
                className="btn_create_account mt-5 "
              >
                Sign in
              </button>
              <button
                className="btn_sign_in"
                onClick={() => {
                  navigate("/create-account");
                }}
              >
                Create account
              </button>
              {/* <button
                className="btn_sign_in"
                onClick={() => {
                  navigate("/resetpassword");
                }}
              >
                Reset password
              </button> */}
            </div>
          </form>
        </div>
        <img src={rocket} className="img_opacity"></img>
      </div>
    </>
  );
};

export default Phone;
