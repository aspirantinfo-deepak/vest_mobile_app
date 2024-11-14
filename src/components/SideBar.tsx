import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  return (
    <div
      className="offcanvas offcanvas-end"
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
    >
      <div className="offcanvas-body">
        <ul className="sidemenubar mt-5">
          <li
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              navigate("/accounts");
            }}
          >
            Account
          </li>
          <li
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              navigate("/settings");
            }}
          >
            Settings
          </li>
          <li
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              navigate("/vestplus");
            }}
          >
            Vestr+
          </li>
          <li>Privacy policy + TOS</li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
