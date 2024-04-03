import React from "react";
import DashboardNavbar from "@/components/Navbar/DashboardNavbar";

const layout = ({ children }) => {
  return (
    <>
      <DashboardNavbar />
      <main>{children}</main>
    </>
  );
};

export default layout;
