"use client";
import { Card, CardTitle } from "@/components/ui/card";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  SelectExpDateToast,
  SelectIndexExpDateToast,
  SelectIndexExpDateStrikeToast,
  failedToLoadDateToast,
} from "@/lib/ToastComponent";
import { domain } from "@/lib/url";
import { useSelector } from "react-redux";

const OiBuildup = () => {
  const [index, setIndex] = useState("usdinr");
  const [selectedDate, setSelectedDate] = useState();
  const [dates, setDates] = useState([]);
  const [oiBuildup, setOiBuildup] = useState([]);
  const [priceRange, setPriceRange] = useState(2);
  const [currentPrice, setCurrentPrice] = useState(0);

  const { data, status } = useSelector((state) => state.expiryDates);

  useEffect(() => {
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
      SelectExpDateToast();
    } else {
      setDates([]);
    }
  }, [index, data]);

  const fetchOIBuildup = async (value) => {
    setSelectedDate(value);
    const data = `${index}-optionChain-${value}`;

    try {
      const oiBuildupUrl = `${domain}/api/optionChain/${data}`;
      const response = await fetch(oiBuildupUrl);
      if (response.ok) {
        const fetchedOiBuildup = await response.json();
        const oiBuildup = fetchedOiBuildup.data;

        if (oiBuildup.length > 0 && oiBuildup[0].underlyingValue) {
          const underlyingValue = parseFloat(oiBuildup[0].underlyingValue);
          if (!isNaN(underlyingValue)) {
            setCurrentPrice(underlyingValue);
          }
        }
        setOiBuildup(oiBuildup);
      } else {
        console.error("API Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const refeshData = () => {
    if (selectedDate == null || index == null) {
      SelectIndexExpDateToast();
    } else {
      fetchOIBuildup(selectedDate);
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
    setOiBuildup([]);
    setIndex(value);
    SelectExpDateToast();
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
        Error fetching data
      </div>
    );
  }

  return (
    <>
      <Card className="lg:mb-4 h-fit">
        <div className="p-5 justify-center items-center md:justify-between flex md:flex-row flex-col ">
          <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
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
                  <SelectItem value="gbpinr" disabled>
                    GBP INR
                  </SelectItem>
                  <SelectItem value="jpyinr" disabled>
                    JPY INR
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={fetchOIBuildup}>
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
            <div className="lg:flex flex-row hidden text-gray-600 text-xs font-semibold">
              <div className="py-3">
                SPOT Price:{" "}
                <span className="text-blue-500">{currentPrice}</span>{" "}
              </div>
            </div>
          </div>
          <div className="md:mt-0 mt-2">
            <Button
              size="icon"
              variant="outline"
              onClick={refeshData}
              className="w-[300px] md:w-10"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </Button>
          </div>
        </div>

        <div className="px-5 pb-5">
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
                  OVER-ALL INDEX TREND
                </TableHead>
                <TableHead className="text-center text-xs font-semibold  bg-green-200">
                  OI-BUILDUP
                </TableHead>

                <TableHead className="text-center  text-xs font-semibold bg-green-200">
                  CHG IN OI
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
                  CHG IN OI
                </TableHead>

                <TableHead className="text-center  text-xs font-semibold bg-red-200">
                  OI-BUILDUP
                </TableHead>
                <TableHead className="text-center  text-xs font-semibold bg-red-200">
                  OVER-ALL INDEX TREND
                </TableHead>
              </TableRow>
            </TableHeader>
            {oiBuildup.length > 0 && (
              <TableBody className="text-center bg-amber-50">
                {oiBuildup.map((oiBuildup) => {
                  const strikePrice = parseFloat(oiBuildup.strikePrice);
                  const priceDifference = Math.abs(strikePrice - currentPrice);

                  if (priceDifference <= priceRange) {
                    return (
                      <TableRow
                        className="hover:bg-amber-100 text-xs text-center"
                        key={oiBuildup.strikePrice}
                      >
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          <span
                            className={`py-1 px-3 rounded-full opacity-80 ${
                              (oiBuildup.CE_change > 0 &&
                                oiBuildup.CE_changeinOpenInterest > 0) ||
                              (oiBuildup.CE_change > 0 &&
                                oiBuildup.CE_changeinOpenInterest < 0)
                                ? "bg-green-500" // Green for uptrend
                                : (oiBuildup.CE_change < 0 &&
                                    oiBuildup.CE_changeinOpenInterest > 0) ||
                                  (oiBuildup.CE_change < 0 &&
                                    oiBuildup.CE_changeinOpenInterest < 0)
                                ? "bg-red-500" // Red for downtrend
                                : "bg-gray-500"
                            }`}
                          >
                            <span className="text-xs text-white">
                              {
                                // ...
                                (oiBuildup.CE_change > 0 &&
                                  oiBuildup.CE_changeinOpenInterest > 0) ||
                                (oiBuildup.CE_change > 0 &&
                                  oiBuildup.CE_changeinOpenInterest < 0)
                                  ? "Up Trend"
                                  : (oiBuildup.CE_change < 0 &&
                                      oiBuildup.CE_changeinOpenInterest > 0) ||
                                    (oiBuildup.CE_change < 0 &&
                                      oiBuildup.CE_changeinOpenInterest < 0)
                                  ? "Down Trend"
                                  : "--"
                                // ...
                              }
                            </span>
                          </span>
                        </TableCell>
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          <span
                            className={`py-1 px-3 rounded-full opacity-80 ${
                              oiBuildup.CE_change > 0 &&
                              oiBuildup.CE_changeinOpenInterest > 0
                                ? "bg-green-500" // Green for Long Buildup
                                : oiBuildup.CE_change < 0 &&
                                  oiBuildup.CE_changeinOpenInterest > 0
                                ? "bg-red-500" // Red for Short Buildup
                                : oiBuildup.CE_change > 0 &&
                                  oiBuildup.CE_changeinOpenInterest < 0
                                ? "bg-blue-500" // Blue for Short Covering
                                : oiBuildup.CE_change < 0 &&
                                  oiBuildup.CE_changeinOpenInterest < 0
                                ? "bg-yellow-500" // Yellow for Long Unwinding
                                : "bg-gray-500" // Gray as a default or for any other scenario
                            }`}
                          >
                            <span className="text-xs text-white">
                              {oiBuildup.CE_change > 0 &&
                              oiBuildup.CE_changeinOpenInterest > 0
                                ? "Long B."
                                : oiBuildup.CE_change < 0 &&
                                  oiBuildup.CE_changeinOpenInterest > 0
                                ? "Short B."
                                : oiBuildup.CE_change > 0 &&
                                  oiBuildup.CE_changeinOpenInterest < 0
                                ? "Short C."
                                : oiBuildup.CE_change < 0 &&
                                  oiBuildup.CE_changeinOpenInterest < 0
                                ? "Long U."
                                : "--"}
                            </span>
                          </span>
                        </TableCell>

                        <TableCell
                          className={`text-center font-semibold hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }
                        ${
                          parseFloat(oiBuildup.CE_changeinOpenInterest) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        >
                          {oiBuildup.CE_changeinOpenInterest}
                        </TableCell>

                        <TableCell
                          className={`text-center font-semibold hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }
                        ${
                          parseFloat(oiBuildup.CE_change) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        >
                          {parseFloat(oiBuildup.CE_change).toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) < currentPrice
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          {oiBuildup.CE_lastPrice}
                        </TableCell>
                        {/* STRIKE PRICE */}
                        <TableCell className="text-center bg-amber-100 font-semibold">
                          {oiBuildup.strikePrice}
                        </TableCell>
                        <TableCell
                          className={`text-center  hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          {oiBuildup.PE_lastPrice}
                        </TableCell>
                        <TableCell
                          className={`text-center font-semibold hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }
                        ${
                          parseFloat(oiBuildup.PE_change) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        >
                          {parseFloat(oiBuildup.PE_change).toFixed(2)}
                        </TableCell>

                        <TableCell
                          className={`text-center font-semibold hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }
                        ${
                          parseFloat(oiBuildup.PE_changeinOpenInterest) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                        >
                          {oiBuildup.PE_changeinOpenInterest}
                        </TableCell>

                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          <span
                            className={`py-1 px-3 rounded-full opacity-80 ${
                              oiBuildup.PE_change > 0 &&
                              oiBuildup.PE_changeinOpenInterest > 0
                                ? "bg-green-500" // Green for Long Buildup
                                : oiBuildup.PE_change < 0 &&
                                  oiBuildup.PE_changeinOpenInterest > 0
                                ? "bg-red-500" // Red for Short Buildup
                                : oiBuildup.PE_change > 0 &&
                                  oiBuildup.PE_changeinOpenInterest < 0
                                ? "bg-blue-500" // Blue for Short Covering
                                : oiBuildup.PE_change < 0 &&
                                  oiBuildup.PE_changeinOpenInterest < 0
                                ? "bg-yellow-500" // Yellow for Long Unwinding
                                : "bg-gray-500" // Gray as a default or for any other sPEnario
                            }`}
                          >
                            <span className="text-xs text-white">
                              {oiBuildup.PE_change > 0 &&
                              oiBuildup.PE_changeinOpenInterest > 0
                                ? "Long B."
                                : oiBuildup.PE_change < 0 &&
                                  oiBuildup.PE_changeinOpenInterest > 0
                                ? "Short B."
                                : oiBuildup.PE_change > 0 &&
                                  oiBuildup.PE_changeinOpenInterest < 0
                                ? "Short C."
                                : oiBuildup.PE_change < 0 &&
                                  oiBuildup.PE_changeinOpenInterest < 0
                                ? "Long U."
                                : "--"}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell
                          className={`text-center hover:bg-amber-100 ${
                            parseFloat(oiBuildup.strikePrice) > currentPrice
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          <span
                            className={`py-1 px-3 rounded-full opacity-80 ${
                              (oiBuildup.PE_change > 0 &&
                                oiBuildup.PE_changeinOpenInterest > 0) ||
                              (oiBuildup.PE_change > 0 &&
                                oiBuildup.PE_changeinOpenInterest < 0)
                                ? "bg-red-500" // Green for uptrend
                                : (oiBuildup.PE_change < 0 &&
                                    oiBuildup.PE_changeinOpenInterest > 0) ||
                                  (oiBuildup.PE_change < 0 &&
                                    oiBuildup.PE_changeinOpenInterest < 0)
                                ? "bg-green-500" // Red for downtrend
                                : "bg-gray-500"
                            }`}
                          >
                            <span className="text-xs text-white">
                              {
                                // ...
                                (oiBuildup.PE_change > 0 &&
                                  oiBuildup.PE_changeinOpenInterest > 0) ||
                                (oiBuildup.PE_change > 0 &&
                                  oiBuildup.PE_changeinOpenInterest < 0)
                                  ? "Down Trend"
                                  : (oiBuildup.PE_change < 0 &&
                                      oiBuildup.PE_changeinOpenInterest > 0) ||
                                    (oiBuildup.PE_change < 0 &&
                                      oiBuildup.PE_changeinOpenInterest < 0)
                                  ? "Up Trend"
                                  : "--"
                                // ...
                              }
                            </span>
                          </span>
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
        {oiBuildup.length === 0 && (
          <Card className="mx-10 h-[60vh] shadow-none mb-12">
            <CardTitle className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl">
              <span>Select Index and </span>
              <span className="text-primary"> Exp. Date </span>
            </CardTitle>
          </Card>
        )}
      </Card>
    </>
  );
};

export default OiBuildup;
