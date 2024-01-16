import React from "react";
import notFoundImage from "../images/error.jpg";
const NotFound = () => {
  return (
    <div style={{ width: "100%", height: "100vh", overflow:"hidden"}}>
      <img
        src={notFoundImage}
        alt=""
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default NotFound;
