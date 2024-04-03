import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import NavLink from "./NavLink";
import Logo from "@/components/Icon/Logo";
import SheetComponent from "./SheetComponent";

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
        <Button size="sm" variant="outline">
          <LogIn size={16} />
          <span className="pl-2">Login</span>
        </Button>
      </div>
    </nav>
  );
};

export default index;
