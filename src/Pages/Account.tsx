import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container pt-3 px-4">
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
            <h3 className="side_headings mt-3 pt-1">Account</h3>
          </div>
        </div>

        <div className="row py-4 border-bottom">
          <div className="col-8 px-0 ">
            <p className="m-0 set_phone">Phone number</p>
          </div>
          <div className="col-4 px-0 text-right">
            <p className="m-0 setphone2">33333333</p>
          </div>
        </div>

        <div className="row py-4 border-bottom">
          <div className="col-8 px-0 ">
            <p className="m-0 set_phone">Username</p>
          </div>
          <div className="col-4 px-0 text-right">
            <p className="m-0 setphone2">adam</p>
          </div>
        </div>

        <div className="row py-4 border-bottom">
          <div className="col-8 px-0 ">
            <p className="m-0 set_phone">Email</p>
          </div>
          <div className="col-4 px-0 text-right">
            <p className="m-0 setphone2">adam@gmail.com</p>
          </div>
        </div>

        <div className="row py-4 ">
          <div className="col-8 px-0 ">
            <p className="m-0 set_phone">Name</p>
          </div>
          <div className="col-4 px-0 text-right">
            <p className="m-0 setphone2">Adam Yorke</p>
          </div>
        </div>

        <div className="row pt-4">
          <div className="col-12 text-center mt-3">
            <button className="setbtnedit">Edit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
