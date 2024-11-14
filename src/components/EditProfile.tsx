import rocket from "../assets/rocket.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { putRequest } from "../services/axiosService";
import FullScreenLoader from "../components/FullScreenLoader";
import { useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../zustand/userStore";

interface User {
  userId: string;
  email: string;
  phone: string;
  isPublic: boolean;
}

const EditProfile = (props: any) => {
  const vestr = JSON.parse(localStorage.getItem("vestr")!);
  const { email, phone, setEmail, setPhone } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = Yup.object().shape({
    isPublic: Yup.boolean().required(),
    userId: Yup.string().required(),
    phone: Yup.string()
      .required("Phone number is mandatory")
      .min(10, "Phone number has 10 digit."),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
  });
  const formOptions = {
    resolver: yupResolver(formSchema),
    defaultValues: {
      userId: vestr.id,
      email: email,
      phone: phone,
      isPublic: true,
    },
  };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const onSubmit = handleSubmit(async (data: User) => {
    try {
      setIsLoading(true);
      const response: any = await putRequest<User>(
        "/api/auth/update-profile",
        data
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsLoading(false);
        const opost = {
          email: data.email,
          id: vestr.id,
          isPublic: true,
          name: vestr.name,
          phoneNum: data.phone,
          profilePicture: vestr.profilePicture,
          token: vestr.token,
          username: vestr.username,
        };
        localStorage.setItem("vestr", JSON.stringify(opost));
        setEmail(data.email);
        setPhone(data.phone);
        props.setisOpen(false);
      }
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
          <h2 className="shadowtext mt-5 pt-5 mb-4">Edit</h2>
          <form onSubmit={onSubmit} autoComplete="off">
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
                marginBottom: "10px",
                fontSize: "14px",
                marginLeft: "5px",
              }}
            >
              {errors.email?.message}
            </span>
            <input
              id="phone"
              pattern="[0-9]*"
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
                marginBottom: "10px",
                fontSize: "14px",
                marginLeft: "5px",
              }}
            >
              {errors.phone?.message}
            </span>
            <button type="submit" className="btn_create_account mt-4">
              Update Profile
            </button>
          </form>
        </div>
        <img src={rocket} className="img_opacity"></img>
      </div>
    </>
  );
};

export default EditProfile;
