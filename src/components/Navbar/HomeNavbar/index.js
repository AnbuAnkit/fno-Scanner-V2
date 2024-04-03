import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import AboutButton from "./DropDownButton";
import Logo from "@/components/Icon/Logo";
import SheetComponent from "./SheetComponent";

const index = () => {
  return (
    <nav className="sticky top-0 z-10 bg-background flex flex-row justify-between items-center border-b sm:px-10 px-5 py-2">
      <div className="flex flex-row items-center space-x-5">
        <SheetComponent />
        <Logo />
      </div>
      <div className="hidden lg:block">
        <ul className="flex flex-row space-x-10 text-sm font-medium">
          <li className="hover:text-primary text-slate-600">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-primary text-slate-600">
            <Link href="/dashboard/strategy-builder">Dashboard</Link>
          </li>
          <li>
            {" "}
            <AboutButton
              buttonText="About"
              options={[
                { label: "About !", href: "/about" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Contact", href: "/contactus" },
                { label: "Privacy Policy", href: "/privacypolicy" },
              ]}
            />
          </li>
        </ul>
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
