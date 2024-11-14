import "./App.css";
import { RouterProvider } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./routers/AuthRoute";
import unrouter from "./routers/UnAuthRoute";
function App() {
  const vestr = localStorage.getItem("vestr");

  return (
    <>
      {vestr && <RouterProvider router={router} />}
      {!vestr && <RouterProvider router={unrouter} />}

      <ToastContainer position="top-right" theme="dark" autoClose={1500} />
    </>
  );
}

export default App;
