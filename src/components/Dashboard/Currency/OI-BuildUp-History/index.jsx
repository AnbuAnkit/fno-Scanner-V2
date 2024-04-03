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
import { RefreshCw, Settings } from "lucide-react";
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
import { sortByDateTime } from "@/lib/utils";

const OiBuildup = () => {
  const [index, setIndex] = useState("usdinr");
  const [selectedDate, setSelectedDate] = useState();
  const [dates, setDates] = useState([]);
  const [oiBuildup, setOiBuildup] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [strikes, setStrikes] = useState([]);
  const [currentStrike, setCurrentStrike] = useState();

  const { data, status } = useSelector((state) => state.expiryDates);

  useEffect(() => {
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
      SelectExpDateToast();
    } else {
      setDates([]);
    }
    if (index !== null) {
      fetchCurrentPrice(index);
    }
  }, [index, data]);

  const fetchCurrentPrice = async (value) => {
    try {
      const response = await fetch(
        `${domain}/api/currentPrice/${value.toUpperCase()}`
      );
      if (response.ok) {
        const fetchedData = await response.json();
        const currentPrice = fetchedData.underlyingValue;
        setCurrentPrice(currentPrice);
        findMultiples50Around(currentPrice, value);
        console.log(`currentPrice`);
      } else {
        console.error("API Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const findMultiples50Around = (num, index) => {
    const multiples = [];
    let mul;

    if (index == "usdinr") {
      mul = 0.125;
    }
    const base = Math.floor(num / mul) * mul;

    for (let i = 30; i >= 1; i--) {
      multiples.push(base - mul * i); // Add below multiples
    }

    multiples.push(base);

    for (let i = 1; i <= 30; i++) {
      multiples.push(base + mul * i); // Add above multiples
    }

    setStrikes(multiples);
  };

  const fetchOIBuildup = async (value) => {
    setCurrentStrike(parseFloat(value));
    try {
      const oiBuildupUrl = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${value}`;
      const response = await fetch(oiBuildupUrl);

      if (response.ok) {
        const fetchedOiBuildup = await response.json();
        const sortedData = sortByDateTime(fetchedOiBuildup);

        setOiBuildup(sortedData);
        console.log(sortedData);
      } else {
        console.error("API Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const refeshData = () => {
    if (selectedDate == null || index == null) {
      SelectIndexExpDateStrikeToast();
    } else {
      fetchOIBuildup(currentStrike);
    }
  };

  const setDate = (value) => {
    setOiBuildup([]);
    setSelectedDate(value);
    SelectStrikeToast();
  };

  const setSelectedIndex = (value) => {
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
    <div className="w-full h-fit xl:pr-5 pb-5 px-3 xl:px-0">
      <div className="flex md:flex-row flex-col justify-between items-center bg-background py-3 md:py-0">
        <div className="flex md:flex-row flex-col items-center md:space-x-3 md:py-5 space-y-2 md:space-y-0">
          <Select onValueChange={setSelectedIndex}>
            <SelectTrigger className="md:w-[180px] w-[300px]">
              <SelectValue placeholder="USD INR" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Currency</SelectLabel>
                <SelectItem value="usdinr">USDINR</SelectItem>
                <SelectItem value="eurinr" disabled>
                  EURINR
                </SelectItem>
                <SelectItem value="jpyinr" disabled>
                  JPYINR
                </SelectItem>
                <SelectItem value="gbpinr" disabled>
                  GBPINR
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={setDate}>
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
          <Select onValueChange={fetchOIBuildup}>
            <SelectTrigger className="md:w-[160px] w-[300px]">
              <SelectValue placeholder="Select Strike" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Strikes</SelectLabel>
                {strikes.map((strike) => (
                  <SelectItem key={strike} value={strike}>
                    {strike}{" "}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="lg:flex flex-row hidden text-gray-600 text-xs font-semibold ">
            <div className="py-3">
              SPOT Price: <span className="text-blue-500">{currentPrice}</span>{" "}
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
            <TableHead className="text-center  text-xs font-semibold bg-yellow-100 border-b-[0.5px] border-x-[0.5px]">
              TIME
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
            {[...oiBuildup].reverse().map((oiBuildupItem) => {
              return (
                <TableRow
                  className="hover:bg-amber-100 text-xs text-center"
                  key={oiBuildupItem._id}
                >
                  <TableCell
                    className={`text-center hover:bg-amber-100 ${"bg-green-100"}`}
                  >
                    <span
                      className={`py-1 px-3 rounded-full opacity-80 ${
                        (oiBuildupItem.CE_change > 0 &&
                          oiBuildupItem.CE_changeinOpenInterest > 0) ||
                        (oiBuildupItem.CE_change > 0 &&
                          oiBuildupItem.CE_changeinOpenInterest < 0)
                          ? "px-2 py-1 bg-green-200 text-green-600 rounded-md" // Green for uptrend
                          : (oiBuildupItem.CE_change < 0 &&
                              oiBuildupItem.CE_changeinOpenInterest > 0) ||
                            (oiBuildupItem.CE_change < 0 &&
                              oiBuildupItem.CE_changeinOpenInterest < 0)
                          ? "px-2 py-1 bg-red-200 text-red-600 rounded-md" // Red for downtrend
                          : "px-2 py-1 bg-gray-200 text-gray-600 rounded-md"
                      }`}
                    >
                      <span className="text-xs font-semibold">
                        {(oiBuildupItem.CE_change > 0 &&
                          oiBuildupItem.CE_changeinOpenInterest > 0) ||
                        (oiBuildupItem.CE_change > 0 &&
                          oiBuildupItem.CE_changeinOpenInterest < 0) ? (
                          <span>
                            <ArrowUpIcon className="w-4 h-4 inline-block mr-1" />
                            Up Trend
                          </span>
                        ) : (oiBuildupItem.CE_change < 0 &&
                            oiBuildupItem.CE_changeinOpenInterest > 0) ||
                          (oiBuildupItem.CE_change < 0 &&
                            oiBuildupItem.CE_changeinOpenInterest < 0) ? (
                          <span>
                            <ArrowDownIcon className="w-4 h-4 inline-block mr-1" />
                            Down Trend
                          </span>
                        ) : (
                          "--"
                        )}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-center hover:bg-amber-100 ${"bg-green-100"}`}
                  >
                    <span
                      className={`py-1 px-3 rounded-full opacity-80 ${
                        oiBuildupItem.CE_change > 0 &&
                        oiBuildupItem.CE_changeinOpenInterest > 0
                          ? "px-2 py-1 bg-green-200 text-green-600 rounded-md" // Green for Long Buildup
                          : oiBuildupItem.CE_change < 0 &&
                            oiBuildupItem.CE_changeinOpenInterest > 0
                          ? "px-2 py-1 bg-red-200 text-red-600 rounded-md" // Green for Long Buildup
                          : oiBuildupItem.CE_change > 0 &&
                            oiBuildupItem.CE_changeinOpenInterest < 0
                          ? "px-2 py-1 bg-blue-200 text-blue-600 rounded-md" // Blue for Short Covering
                          : oiBuildupItem.CE_change < 0 &&
                            oiBuildupItem.CE_changeinOpenInterest < 0
                          ? "px-2 py-1 bg-yellow-200 text-yellow-600 rounded-md" // Yellow for Long Unwinding
                          : "px-2 py-1 bg-gray-200 text-gray-600 rounded-md" // Gray as a default or for any other scenario
                      }`}
                    >
                      <span className="text-xs text-white">
                        {oiBuildupItem.CE_change > 0 &&
                        oiBuildupItem.CE_changeinOpenInterest > 0 ? (
                          <span>
                            <ArrowUpIcon className="w-4 h-4 inline-block mr-1" />
                            Long B.
                          </span>
                        ) : oiBuildupItem.CE_change < 0 &&
                          oiBuildupItem.CE_changeinOpenInterest > 0 ? (
                          <span>
                            <ArrowDownIcon className="w-4 h-4 inline-block mr-1" />
                            Short B.
                          </span>
                        ) : oiBuildupItem.CE_change > 0 &&
                          oiBuildupItem.CE_changeinOpenInterest < 0 ? (
                          <span>
                            <ArrowUpLeftIcon className="w-4 h-4 inline-block mr-1" />
                            Short C.
                          </span>
                        ) : oiBuildupItem.CE_change < 0 &&
                          oiBuildupItem.CE_changeinOpenInterest < 0 ? (
                          <span>
                            <ArrowDownLeftIcon className="w-4 h-4 inline-block mr-1" />
                            Long U.
                          </span>
                        ) : (
                          "--"
                        )}
                      </span>
                    </span>
                  </TableCell>

                  <TableCell
                    className={`text-center font-semibold hover:bg-amber-100 ${"bg-green-100"}
                      ${
                        parseFloat(oiBuildupItem.CE_changeinOpenInterest) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                  >
                    {oiBuildupItem.CE_changeinOpenInterest}
                  </TableCell>

                  <TableCell
                    className={`text-center font-semibold hover:bg-amber-100 ${"bg-green-100"}
                      ${
                        parseFloat(oiBuildupItem.CE_change) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                  >
                    {parseFloat(oiBuildupItem.CE_change).toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={`text-center hover:bg-amber-100 " ${"bg-green-100"}`}
                  >
                    {oiBuildupItem.CE_lastPrice}
                  </TableCell>
                  {/* STRIKE PRICE */}
                  <TableCell className="text-center bg-amber-100 font-semibold border-x-[1px] ">
                    {parseFloat(oiBuildupItem.strikePrice)}
                  </TableCell>
                  <TableCell className="text-center bg-amber-100 font-semibold">
                    {extractTime(oiBuildupItem.currentDateTime)}
                  </TableCell>

                  <TableCell
                    className={`text-center  hover:bg-amber-100 ${"bg-red-100"}`}
                  >
                    {oiBuildupItem.PE_lastPrice}
                  </TableCell>
                  <TableCell
                    className={`text-center font-semibold hover:bg-amber-100 ${"bg-red-100"}
                      ${
                        parseFloat(oiBuildupItem.PE_change) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                  >
                    {parseFloat(oiBuildupItem.PE_change).toFixed(2)}
                  </TableCell>

                  <TableCell
                    className={`text-center font-semibold hover:bg-amber-100 ${"bg-red-100"}
                      ${
                        parseFloat(oiBuildupItem.PE_changeinOpenInterest) > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                  >
                    {oiBuildupItem.PE_changeinOpenInterest}
                  </TableCell>

                  <TableCell
                    className={`text-center hover:bg-amber-100 ${"bg-red-100"}`}
                  >
                    <span
                      className={`py-1 px-3 rounded-full opacity-80 ${
                        oiBuildupItem.PE_change > 0 &&
                        oiBuildupItem.PE_changeinOpenInterest > 0
                          ? "px-2 py-1 bg-green-200 text-green-600 rounded-md" // Green for Long Buildup
                          : oiBuildupItem.PE_change < 0 &&
                            oiBuildupItem.PE_changeinOpenInterest > 0
                          ? "px-2 py-1 bg-red-200 text-red-600 rounded-md" // Red for Short Buildup
                          : oiBuildupItem.PE_change > 0 &&
                            oiBuildupItem.PE_changeinOpenInterest < 0
                          ? "px-2 py-1 bg-blue-200 text-blue-600 rounded-md" // Blue for Short Covering
                          : oiBuildupItem.PE_change < 0 &&
                            oiBuildupItem.PE_changeinOpenInterest < 0
                          ? "px-2 py-1 bg-yellow-200 text-yellow-600 rounded-md" // Yellow for Long Unwinding
                          : "px-2 py-1 bg-gray-200 text-gray-600 rounded-md" // Gray as a default or for any other sPEnario
                      }`}
                    >
                      <span className="text-xs text-white">
                        {oiBuildupItem.PE_change > 0 &&
                        oiBuildupItem.PE_changeinOpenInterest > 0 ? (
                          <span>
                            <ArrowUpIcon className="w-4 h-4 inline-block mr-1" />
                            Long B.
                          </span>
                        ) : oiBuildupItem.PE_change < 0 &&
                          oiBuildupItem.PE_changeinOpenInterest > 0 ? (
                          <span>
                            <ArrowDownIcon className="w-4 h-4 inline-block mr-1" />
                            Short B.
                          </span>
                        ) : oiBuildupItem.PE_change > 0 &&
                          oiBuildupItem.PE_changeinOpenInterest < 0 ? (
                          <span>
                            <ArrowUpLeftIcon className="w-4 h-4 inline-block mr-1" />
                            Short C.
                          </span>
                        ) : oiBuildupItem.PE_change < 0 &&
                          oiBuildupItem.PE_changeinOpenInterest < 0 ? (
                          <span>
                            <ArrowUpLeftIcon className="w-4 h-4 inline-block mr-1" />
                            Long U.
                          </span>
                        ) : (
                          "--"
                        )}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-center hover:bg-amber-100 ${"bg-red-100"}`}
                  >
                    <span
                      className={`py-1 px-3 rounded-full opacity-80 ${
                        (oiBuildupItem.PE_change > 0 &&
                          oiBuildupItem.PE_changeinOpenInterest > 0) ||
                        (oiBuildupItem.PE_change > 0 &&
                          oiBuildupItem.PE_changeinOpenInterest < 0)
                          ? "px-2 py-1 bg-red-200 text-red-600 rounded-md" // Green for uptrend
                          : (oiBuildupItem.PE_change < 0 &&
                              oiBuildupItem.PE_changeinOpenInterest > 0) ||
                            (oiBuildupItem.PE_change < 0 &&
                              oiBuildupItem.PE_changeinOpenInterest < 0)
                          ? "px-2 py-1 bg-green-200 text-green-600 rounded-md" // Red for downtrend
                          : "px-2 py-1 bg-gray-200 text-gray-600 rounded-md"
                      }`}
                    >
                      <span className="text-xs text-white">
                        {(oiBuildupItem.PE_change > 0 &&
                          oiBuildupItem.PE_changeinOpenInterest > 0) ||
                        (oiBuildupItem.PE_change > 0 &&
                          oiBuildupItem.PE_changeinOpenInterest < 0) ? (
                          <span>
                            <ArrowDownIcon className="w-4 h-4 inline-block mr-1" />
                            Down Trend
                          </span>
                        ) : (oiBuildupItem.PE_change < 0 &&
                            oiBuildupItem.PE_changeinOpenInterest > 0) ||
                          (oiBuildupItem.PE_change < 0 &&
                            oiBuildupItem.PE_changeinOpenInterest < 0) ? (
                          <span>
                            <ArrowUpIcon className="w-4 h-4 inline-block mr-1" />
                            Up Trend
                          </span>
                        ) : (
                          "--"
                        )}
                      </span>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
      {oiBuildup.length === 0 && (
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

export default OiBuildup;

function extractTime(dateTimeString) {
  let date = new Date(dateTimeString);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Pad single digit minutes with leading zero
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes}`;
}
