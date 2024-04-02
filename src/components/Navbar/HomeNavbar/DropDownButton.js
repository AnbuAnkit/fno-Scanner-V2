"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const NavDropDownButton = ({ options, buttonText }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className=" hover:text-primary font-medium text-sm text-center"
      >
        <span className="flex items-center space-x-3 text-slate-600 hover:text-primary">
          {buttonText}{" "}
          <ChevronDown
            size={16}
            className={` ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
          />
        </span>
      </button>
      {isDropdownOpen && (
        <ul className="absolute mt-1 py-4 w-48 bg-white rounded shadow-lg flex flex-col space-y-1">
          {options.map((option) => (
            <li key={option.label}>
              <span>
                <Link
                  href={option.href}
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-slate-600 hover:text-primary md:p-0 p-4"
                >
                  <span className="flex items-center font-medium text-[13px] space-x-3 py-3 px-4 hover:bg-gray-100">
                    {option.label}
                  </span>
                </Link>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavDropDownButton;
