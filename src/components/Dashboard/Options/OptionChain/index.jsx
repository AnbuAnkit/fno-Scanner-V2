"use client";

import * as React from "react";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import {
  SelectExpDateToast,
  SelectIndexExpDateToast,
  failedToLoadDateToast,
} from "@/lib/ToastComponent";
import { useSelector } from "react-redux";
import { domain } from "@/lib/url";

const OptionChain = () => {
  const [index, setIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [optionchain, setOptionChain] = useState([]);
  const [priceRange, setPriceRange] = useState(2000);
  const [currentPrice, setCurrentPrice] = useState(0);

  const { data, status } = useSelector((state) => state.expiryDates);

  useEffect(() => {
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
      console.log(data.data[index]);
    } else {
      setDates([]);
    }
  }, [index, data]);

  const fetchOptionChain = async (date) => {
    setSelectedDate(date);
    const value = `${index}-optionChain-${date}`;
    try {
      let optionChainUrl;
      if (index == null || date == null) {
        console.log(value);
        SelectIndexExpDateToast();
      } else {
        optionChainUrl = `${domain}/api/optionChain/${value}`;
        console.log(optionChainUrl);
        const response = await fetch(optionChainUrl);
        if (response.ok) {
          const fetchedOptionData = await response.json();
          const optionData = fetchedOptionData.data;
          setOptionChain(optionData);

          if (optionData.length > 0 && optionData[0].underlyingValue) {
            const underlyingValue = parseFloat(optionData[0].underlyingValue);
            if (!isNaN(underlyingValue)) {
              setCurrentPrice(underlyingValue);
            }
          }

          console.log("option chain fetched");
        } else {
          console.error("API Request failed with status:", response.status);
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const refresh = () => {
    if (selectedDate == null || index == null) {
      SelectIndexExpDateToast();
    } else {
      fetchOptionChain(selectedDate);
      console.log("Data Refreshed");
    }
  };

  const setStrikeRange = (value) => {
    let range;
    if (index == "nifty") {
      range = value * 50;
      setPriceRange(range);
    } else if (index == "banknifty") {
      range = value * 100;
      setPriceRange(range);
    } else if (index == "finnifty") {
      range = value * 50;
      setPriceRange(range);
    } else if (index == "midcpnifty") {
      range = value * 25;
      setPriceRange(range);
    }
  };

  const setSelectedIndex = (value) => {
    setOptionChain([]);
    let noOfStrikes = 11;
    if (value == "nifty") {
      setPriceRange(50 * noOfStrikes);
    } else if (value == "banknifty") {
      setPriceRange(100 * noOfStrikes);
    } else if (value == "finnifty") {
      setPriceRange(50 * noOfStrikes);
    } else if (value == "midcpnifty") {
      setPriceRange(25 * noOfStrikes);
    }
    setIndex(value);
    SelectExpDateToast();
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-2xl font-bold text-gray-500">
        Loading...
      </div>
    );
  if (status === "failed") {
    failedToLoadDateToast();
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error fetching Initial data
      </div>
    );
  }

  return (
    <div className="w-full h-fit xl:pr-5 pb-10 px-3 xl:px-0">
      <div className="flex md:flex-row flex-col justify-between items-center bg-background py-3 md:py-0">
        <div className="flex md:flex-row flex-col items-center md:space-x-3 md:py-5 space-y-2 md:space-y-0">
          <Select onValueChange={setSelectedIndex}>
            <SelectTrigger className="md:w-[180px] w-[300px]">
              <SelectValue placeholder="Select an INDEX" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>INDEX/Stock</SelectLabel>
                <SelectItem value="nifty">NIFTY</SelectItem>
                <SelectItem value="banknifty">BANK-NIFTY</SelectItem>
                <SelectItem value="finnifty">FIN-NIFTY</SelectItem>
                <SelectItem value="midcpnifty">MID-CP-NIFTY</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={fetchOptionChain}>
            <SelectTrigger className="md:w-[200px] w-[300px]">
              <SelectValue placeholder="Select an Exp. Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Exp. Date</SelectLabel>
                {dates.map((date) => (
                  <SelectItem key={date.expiryDate} value={date.expiryDate}>
                    {date.expiryDate}{" "}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={setStrikeRange}>
            <SelectTrigger className="md:w-[140px] w-[300px] ">
              <SelectValue placeholder="No. of Strikes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="11">10</SelectItem>
                <SelectItem value="16">15</SelectItem>
                <SelectItem value="21">20</SelectItem>
                <SelectItem value="31">30</SelectItem>
                <SelectItem value="41">40</SelectItem>
                <SelectItem value="51">50</SelectItem>
                <SelectItem value="61">ALL</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="space-x-5 lg:block text-gray-600 text-xs font-semibold hidden ">
            SPOT Price: <span className="text-blue-500">{currentPrice}</span>{" "}
          </div>
        </div>
        <div className="pt-2 md:pt-0">
          <Button
            size="icon"
            variant="outline"
            onClick={refresh}
            className="w-[300px] md:w-10"
          >
            <RefreshCw size={18} className="text-gray-600 " />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>

            <TableHead className="text-center text-xs bg-gray-50 font-bold  text-green-500">
              CALL
            </TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>

            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>

            <TableHead className="text-center text-xs bg-gray-50 font-bold  text-red-500">
              PUT
            </TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
            <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center text-xs font-semibold  bg-green-200">
              OI
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-green-200">
              CHG IN OI
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-green-200">
              VOLUME
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-green-200">
              IV
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-green-200">
              LTP CHG.
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-green-200">
              LTP
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-yellow-100 border-b-[0.5px] border-x-[0.5px]">
              STRIKE
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-red-200">
              LTP
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-red-200">
              LTP CHG.
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-red-200">
              IV
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-red-200">
              VOLUME
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-red-200">
              CHG IN OI
            </TableHead>
            <TableHead className="text-center  text-xs font-semibold bg-red-200">
              OI
            </TableHead>
          </TableRow>
        </TableHeader>

        {optionchain.length > 0 && (
          <TableBody>
            {optionchain.map((optionChain) => {
              const strikePrice = parseFloat(optionChain.strikePrice);
              const priceDifference = Math.abs(strikePrice - currentPrice);

              if (priceDifference <= priceRange) {
                return (
                  <TableRow
                    className="hover:bg-amber-0 text-xs"
                    key={optionChain.strikePrice}
                  >
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) < currentPrice
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      {optionChain.CE_OI}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) < currentPrice
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      {optionChain.CE_changeinOpenInterest}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) < currentPrice
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      {optionChain.CE_totalTradedVolume}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) < currentPrice
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      {parseFloat(optionChain.CE_impliedVolatility).toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${getColorBasedOnValue(
                        parseFloat(optionChain.CE_change)
                      )} ${
                        parseFloat(optionChain.strikePrice) < currentPrice
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      {parseFloat(optionChain.CE_change).toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) < currentPrice
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      {optionChain.CE_lastPrice}
                    </TableCell>
                    <TableCell className="text-center  hover:bg-amber-0 font-semibold bg-yellow-50">
                      {optionChain.strikePrice}
                    </TableCell>
                    <TableCell
                      className={`text-center   hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) > currentPrice
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      {optionChain.PE_lastPrice}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${getColorBasedOnValue(
                        parseFloat(optionChain.PE_change)
                      )} ${
                        parseFloat(optionChain.strikePrice) > currentPrice
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      {parseFloat(optionChain.PE_change).toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) > currentPrice
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      {parseFloat(optionChain.PE_impliedVolatility).toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) > currentPrice
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      {optionChain.PE_totalTradedVolume}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) > currentPrice
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      {optionChain.PE_changeinOpenInterest}
                    </TableCell>
                    <TableCell
                      className={`text-center  hover:bg-amber-0 ${
                        parseFloat(optionChain.strikePrice) > currentPrice
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      {optionChain.PE_OI}
                    </TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        )}
      </Table>
      {optionchain.length === 0 && (
        <div className="mx-10 h-[60vh] shadow-none my-10">
          <div className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl font-semibold">
            <span>Select Index and </span>
            <span className="text-primary"> Exp. Date </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionChain;

const getColorBasedOnValue = (value) => {
  if (!value) return "text-black";
  return value < 0
    ? "font-semibold  text-red-500"
    : "font-semibold font-bold text-green-600";
};
