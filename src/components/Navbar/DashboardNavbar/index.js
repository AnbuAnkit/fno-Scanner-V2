import React from "react";
import NavLink from "./NavLink";
import Logo from "@/components/Icon/Logo";
import SheetComponent from "./SheetComponent";
import LoginButton from "@/components/Navbar/LoginButton";

const index = () => {
  return (
    <nav className="sticky top-0 z-10 bg-background flex flex-row justify-between items-center border-b-[1px] py-2 w-full sm:px-10 px-5">
      <div className="flex flex-row items-center space-x-5">
        <SheetComponent />
        <div className=" flex flex-row space-x-40 items-center">
          <Logo />
          <NavLink />
        </div>
      </div>

      <div>
        <LoginButton />
      </div>
    </nav>
  );
};

export default index;
