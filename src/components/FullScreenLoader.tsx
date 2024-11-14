import React from "react";
import "./FullScreenLoader.css"; // Import CSS styles

// import roc from "../assets/vesticons.svg";

interface FullScreenLoaderProps {
  isLoading: boolean;
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isLoading }) => {
  return null
  // if (!isLoading) return null;

  // return (
  //   <div className="loader-container">
  //     <div>
  //       <div className="loader"></div>
  //       {/* <img src={roc} className="roc_img"></img> */}
  //     </div>
  //     {/* <p className="loader-message">{message}</p> */}
  //   </div>
  // );
};

export default FullScreenLoader;
