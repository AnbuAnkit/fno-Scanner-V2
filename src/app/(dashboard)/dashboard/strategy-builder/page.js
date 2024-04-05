import React from "react";
import Builder from "@/components/Dashboard/Strategy-Builder";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Strategy Builder",
};

const page = () => {
  return (
    <>
      <Builder />
      <Footer />
    </>
  );
};

export default page;
