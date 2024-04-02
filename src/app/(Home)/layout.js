import React from "react";
import HomeNavbar from "@/components/Navbar/HomeNavbar";

const layout = ({ children }) => {
  return (
    <>
      <HomeNavbar />
      {children}
    </>
  );
};

export default layout;
