import React from "react";
import DashboardNavbar from "@/components/Navbar/DashboardNavbar";

const layout = ({ children }) => {
  return (
    <main>
      <DashboardNavbar />
      {children}
    </main>
  );
};

export default layout;
