import { useNavigate } from "react-router-dom";
import useUserStore from "../zustand/userStore";
import { Sheet } from "react-modal-sheet";
import { useState } from "react";
import EditProfile from "../components/EditProfile";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { putRequest } from "../services/axiosService";
import FullScreenLoader from "../components/FullScreenLoader";
interface User {
  userId: string;
  email: string;
  phone: string;
  isPublic: boolean;
}
const Settings = () => {
  const navigate = useNavigate();
  const { name, username, email, phone, setEmail, setPhone } = useUserStore();
  const [isOpen, setisOpen] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };
  const vestr = JSON.parse(localStorage.getItem("vestr")!);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = Yup.object().shape({
    isPublic: Yup.boolean().required(),
    userId: Yup.string().required(),
    phone: Yup.string()
      .required("Phone number is mandatory")
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number has 10 digit."),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
  });
  const formOptions = {
    resolver: yupResolver(formSchema),
    defaultValues: {
      userId: vestr.id,
      email: vestr.email,
      phone: vestr.phoneNum,
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
        // toast.success(response.data.message);
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
        setisEdit(false);
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
      <div className="container  pt-3 px-4">
        <FullScreenLoader isLoading={isLoading} message="Please wait..." />
        <div className="row">
          <div className="col-12 mt-3 pt-1 px-0">
            <button
              className="back-btn"
              onClick={() => {
                navigate("/Markets");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-left"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              &nbsp;Back
            </button>
          </div>
          <div className="col-12 px-0">
            <h3 className="side_headings mt-3 pt-1">Settings</h3>
          </div>
        </div>
        <div className="row py-4 border-bottom1">
          <div className="col-8 px-0 ">
            <p className="m-0 set_para">Password</p>
          </div>
          <div className="col-4 px-0 text-right">
            <p className="m-0 setpass">*******</p>
          </div>
        </div>
        <div className="row py-4 border-bottom1">
          <div className="col-6 px-0 ">
            <p className="m-0 set_para">Phone number</p>
          </div>
          <div className="col-6 px-0 text-right">
            {isEdit && (
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                className="edit_settings"
                {...register("phone", { required: true })}
                maxLength={10}
                onKeyPress={numberOnlyValidation}
              ></input>
            )}
            {!isEdit && <p className="m-0 setpass">{phone}</p>}
          </div>
          <div className="col-12 px-0">
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
        </div>
        <div className="row py-4 border-bottom1">
          <div className="col-8 px-0 ">
            <p className="m-0 set_para">Username</p>
          </div>
          <div className="col-4 px-0 text-right">
            <p className="m-0 setpass">{username}</p>
          </div>
        </div>
        <div className="row py-4 border-bottom1">
          <div className="col-6 px-0 ">
            <p className="m-0 set_para">Email</p>
          </div>
          <div className="col-6 px-0 text-right">
            {isEdit && (
              <input
                type="text"
                className="edit_settings"
                {...register("email", { required: true })}
              ></input>
            )}
            {!isEdit && <p className="m-0 setpass">{email}</p>}
          </div>
          <div className="col-12 px-0">
            <span
              style={{
                color: "#fff",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              {errors.email?.message?.toString()}
            </span>
          </div>
        </div>
        <div className="row py-4 border-bottom1">
          <div className="col-8 px-0 ">
            <p className="m-0 set_para">Name</p>
          </div>
          <div className="col-4 px-0 text-right">
            <p className="m-0 setpass">{name}</p>
          </div>
        </div>
        

        

        <div className="row">
          <div className="col-12 px-0">
            <h3 className="side_headings mt-3 pt-1">Privacy policy + TOS</h3>
          </div>
        </div>
        {!isEdit && (
          <div className="row pt-3 mb-8">
            <div className="col-6 text-center mt-3 px-1">
              <button
                onClick={() => setisEdit(true)}
                className="setbtnedit w-100"
              >
                Edit
              </button>
            </div>
            <div className="col-6 text-center mt-3 px-1">
              <button onClick={logout} className="setbtnedit w-100">
                Log out
              </button>
            </div>
          </div>
        )}
        {isEdit && (
          <div className="row pt-3 mb-8">
            <div className="col-6 text-center mt-3 px-1">
              <button onClick={() => onSubmit()} className="setbtnedit w-100">
                Save
              </button>
            </div>
            <div className="col-6 text-center mt-3 px-1">
              <button
                onClick={() => setisEdit(false)}
                className="setbtnedit w-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <Sheet
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        // snapPoints={[1, 0.5, 0.25]}
        initialSnap={0}
        // detent="full-height"
      >
        <Sheet.Container>
          <Sheet.Header style={{ background: "#000" }} />
          <Sheet.Content style={{ background: "#000" }}>
            <Sheet.Scroller draggableAt="both">
              <EditProfile setisOpen={setisOpen} />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
};

export default Settings;
