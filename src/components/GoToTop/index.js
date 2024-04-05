"use client";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-10 z-10 shadow-2xl">
      {isVisible && (
        <Button
          variant="default"
          onClick={scrollToTop}
          title="Go to top"
          //   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          <MdOutlineKeyboardDoubleArrowUp size={20} />
        </Button>
      )}
    </div>
  );
};

export default GoToTop;
