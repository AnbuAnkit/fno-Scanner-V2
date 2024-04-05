import React from "react";
import HomeNavbar from "@/components/Navbar/HomeNavbar";
import Footer from "@/components/Footer";

const layout = ({ children }) => {
  return (
    <>
      <HomeNavbar />
      {children}
      <Footer />
    </>
  );
};

export default layout;
