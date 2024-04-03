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
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";
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
  SelectIndexExpDateStrikeToast,
  failedToLoadDateToast,
  SelectStrikeToast,
} from "@/lib/ToastComponent";
import { domain } from "@/lib/url";
import { useSelector } from "react-redux";
import { NoOfDaysForExpiry } from "@/lib/date";
import greeks from "greeks";

const OptionChain = () => {
  const [index, setIndex] = useState("usdinr");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [optionchain, setOptionChain] = useState([]);
  const [priceRange, setPriceRange] = useState(2);
  const [currentPrice, setCurrentPrice] = useState(0);

  const { data, status } = useSelector((state) => state.expiryDates);

  useEffect(() => {
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
      SelectExpDateToast();
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
        SelectIndexExpDateToast();
      } else {
        optionChainUrl = `${domain}/api/optionChain/${value}`;
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

    if (index == "usdinr") {
      range = value * 0.125;
      setPriceRange(range);
    }
  };

  const setSelectedIndex = (value) => {
    setOptionChain([]);
    setIndex(value);
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center min-h-screen">
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
    <div className=" lg:mb-10 ">
      <Card className="w-full h-fit ">
        <div className=" flex md:flex-row flex-col justify-between items-center mt-3 bg-white ">
          <div className="flex md:flex-row flex-col items-center">
            <div className="md:p-2 md:ml-3 my-1">
              <Select onValueChange={setSelectedIndex}>
                <SelectTrigger className="md:w-[180px] w-[300px]">
                  <SelectValue placeholder="USD INR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currency</SelectLabel>
                    <SelectItem value="usdinr">USD INR</SelectItem>
                    <SelectItem value="eurinr" disabled>
                      EUR INR
                    </SelectItem>
                    <SelectItem value="jpyinr" disabled>
                      JPY INR
                    </SelectItem>
                    <SelectItem value="gbpinr" disabled>
                      {" "}
                      GBP INR
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="md:p-2 my-1">
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
            </div>
            <div className="md:p-2 md:mr-3 my-1">
              <Select onValueChange={setStrikeRange}>
                <SelectTrigger className="md:w-[140px] w-[300px]">
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
            </div>
            <div className="space-x-5 lg:flex flex-row text-gray-600 text-xs font-semibold hidden ">
              <div className="">
                SPOT Price:{" "}
                <span className="text-blue-500">{currentPrice}</span>{" "}
              </div>
            </div>
          </div>
          <div className="md:mr-5 my-1 space-x-2 flex flex-row items-center md:pt-2">
            <Button
              size="icon"
              variant="outline"
              onClick={refresh}
              className="w-[300px] md:w-10"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </Button>
          </div>
        </div>
        <div className="px-5 pb-5 pt-3">
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

                <TableHead className="text-center text-xs bg-gray-50 font-bold  text-red-500">
                  PUT
                </TableHead>
                <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
                <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center  text-xs font-semibold bg-green-200">
                  RHO
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-green-200">
                  GAMMA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-green-200">
                  VEGA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-green-200">
                  THETA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-green-200">
                  DELTA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-yellow-100 border-b-[0.5px] border-x-[0.5px]">
                  STRIKE
                </TableHead>

                <TableHead className="text-center  text-xs font-semibold bg-red-200">
                  DELTA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-red-200">
                  THETA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-red-200">
                  VEGA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-red-200">
                  GAMMA
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-red-200">
                  RHO
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
                        className="hover:bg-amber-100 text-xs"
                        key={optionChain.strikePrice}
                      >
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getRho(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.CE_impliedVolatility / 100,
                              0.1,
                              "call"
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getGamma(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.CE_impliedVolatility / 100,
                              0.1
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getVega(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.CE_impliedVolatility / 100,
                              0.1
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getTheta(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.CE_impliedVolatility / 100,
                              0.1,
                              "call"
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getDelta(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.CE_impliedVolatility / 100,
                              0.1,
                              "call"
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell className="text-center hover:bg-amber-100 font-semibold bg-yellow-50">
                          {optionChain.strikePrice}
                        </TableCell>
                        <TableCell
                          className={`text-center  hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getDelta(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.PE_impliedVolatility / 100,
                              0.1,
                              "put"
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center  hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getTheta(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.PE_impliedVolatility / 100,
                              0.1,
                              "put"
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center  hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getVega(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.PE_impliedVolatility / 100,
                              0.1
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center  hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getGamma(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.PE_impliedVolatility / 100,
                              0.1
                            )
                            .toFixed(6)}
                        </TableCell>
                        <TableCell
                          className={`text-center  hover:bg-amber-100 ${
                            parseFloat(optionChain.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          {greeks
                            .getRho(
                              currentPrice,
                              optionChain.strikePrice,
                              NoOfDaysForExpiry(selectedDate) / 365,
                              optionChain.PE_impliedVolatility / 100,
                              0.1,
                              "put"
                            )
                            .toFixed(6)}
                        </TableCell>
                      </TableRow>
                    );
                  }
                  return null;
                })}
              </TableBody>
            )}
          </Table>
        </div>
        {optionchain.length === 0 && (
          <Card className="mx-10 h-[60vh] shadow-none mb-12">
            <CardTitle className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl">
              <span>Select Index and </span>
              <span className="text-primary"> Exp. Date </span>
            </CardTitle>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default OptionChain;
