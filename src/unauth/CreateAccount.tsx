import rocket from "../assets/rocket.svg";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { postRequest } from "../services/axiosService";
import FullScreenLoader from "../components/FullScreenLoader";
import { useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../zustand/userStore";

interface User {
  name: string;
  email: string;
  username: string;
  phone: string;
}

const CreateAccount = () => {
  const { setName, setEmail, setPhone, setUsername } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name has minium 3 charater")
      .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabets")
      .matches(/^.*\S.*$/, "Whitespace is not allowed")
      .strict(true),

    username: Yup.string()
      .required("Username is required")
      .min(3, "Username has minium 3 charater")
      .test("username-validation", "Invalid username", (value) => {
        if (!value) {
          return false;
        }
        return /^[a-zA-Z0-9_]+$/.test(value);
      })
      .matches(/^\S*$/, "Whitespace is not allowed")
      .trim()
      .strict(true)
      .lowercase(),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Enter a 10 digits valid phone number"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const onSubmit = handleSubmit(async (data: User) => {
    try {
      setIsLoading(true);
      const response: any = await postRequest<User>("/api/auth/signup", data);
      toast.success(response.data);
      setIsLoading(false);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setUsername(data.username);
      // setToken(response.data.token);
      navigate("/set-password", { replace: true });
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error creating user:", error);
      toast.error(error.response.data);
    }
  });
  const numberOnlyValidation = (event: any) => {
    const pattern = /[0-9.,]/;
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
          <h2 className="shadowtext mt-5  mb-4">Moon</h2>
          <form onSubmit={onSubmit} autoComplete="off">
            <input
              autoComplete="off"
              type="text"
              id="name"
              {...register("name", { required: true })}
              className="npt_frm"
              placeholder="Name"
            ></input>
            <span
              style={{
                float: "left",
                color: "#fff",

                fontSize: "14px",
                marginLeft: "5px",
              }}
            >
              {errors.name?.message}
            </span>
            <input
              id="username"
              autoComplete="off"
              autoCapitalize="none"
              {...register("username", { required: true })}
              type="text"
              className="npt_frm"
              placeholder="Username"
            ></input>
            <span
              style={{
                float: "left",
                color: "#fff",

                fontSize: "14px",
                marginLeft: "5px",
              }}
            >
              {errors.username?.message}
            </span>
            <input
              id="email"
              autoComplete="off"
              type="text"
              {...register("email", { required: true })}
              className="npt_frm"
              placeholder="Email"
            ></input>
            <span
              style={{
                float: "left",
                color: "#fff",

                fontSize: "14px",
                marginLeft: "5px",
              }}
            >
              {errors.email?.message}
            </span>
            <input
              id="phone"
              pattern="[0-9]*"
              inputMode="numeric"
              autoComplete="off"
              type="text"
              maxLength={10}
              onKeyPress={numberOnlyValidation}
              className="npt_frm"
              {...register("phone", { required: true })}
              placeholder="Phone  number"
            ></input>
            <span
              style={{
                float: "left",
                color: "#fff",

                fontSize: "14px",
                marginLeft: "5px",
              }}
            >
              {errors.phone?.message}
            </span>
            <button type="submit" className="btn_create_account mt-4">
              Create account
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
          </form>
        </div>
        <img src={rocket} className="img_opacity"></img>
      </div>
    </>
  );
};

export default CreateAccount;
