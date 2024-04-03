import React from "react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="md:flex flex-col justify-center hidden">
      <span className="text-2xl font-semibold text-primary">
        Fno <span className="text-black">Scanner</span>
      </span>
      <span className="text-[10px] font-medium text-slate-500 ">
        Learn Before You Trade!
      </span>
    </Link>
  );
};

export default Logo;
