"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Index = () => {
  const pathname = usePathname();
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="text-2xl font-semibold">
        <span>Coming</span>
        <span className="text-primary"> Soon...</span>.
        <br />
        <span>Current Path : </span>
        <span>{pathname}</span>
      </div>
    </div>
  );
};

export default Index;
