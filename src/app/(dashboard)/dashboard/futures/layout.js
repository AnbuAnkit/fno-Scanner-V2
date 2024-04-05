import React from "react";
import { futuresSideBar } from "@/constants";
import SideBar from "@/components/Sidebar";
import EmptySidebar from "@/components/EmptySideBar";
import Footer from "@/components/Footer";

const layout = ({ children }) => {
  return (
    <>
      {" "}
      <section>
        <SideBar links={futuresSideBar} />
        <div className="flex flex-row">
          <EmptySidebar />
          <div className="w-full">{children}</div>
        </div>
      </section>
      <Footer cssprop={"xl:pl-80"} />
    </>
  );
};

export default layout;
