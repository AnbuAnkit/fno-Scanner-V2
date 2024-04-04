"use client";

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
import React, { useState, useEffect } from "react";
import {
  SelectExpDateToast,
  SelectIndexExpDateToast,
  SelectIndexExpDateStrikeToast,
  failedToLoadDateToast,
} from "@/lib/ToastComponent";
import { Separator } from "@/components/ui/separator";
import { SelectDateCard } from "@/components/SelectDateCard";

import { domain } from "@/lib/url";
import { useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import greeks from "greeks";
import { NoOfDaysForExpiry } from "@/lib/date";

const MaxPain = () => {
  const [xAxisPriceRange, setxAxisPriceRange] = useState(2000);
  const [strikeDiff, setStrikeDiff] = useState(50);
  const [index, setIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [dates, setDates] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [ProbabilityOfTouchGraph, setProbabilityOfTouchGraph] = useState([]);
  const [xaxisGraphData, setXAxisGraphData] = useState([]);
  // const [optionchain, setOptionChain] = useState([]);

  const { data, status } = useSelector((state) => state.expiryDates);

  const dataArray = xaxisGraphData.map((label) => ({
    name: label,
    ProbofTouch: ProbabilityOfTouchGraph[xaxisGraphData.indexOf(label)],
  }));

  useEffect(() => {
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
    } else {
      setDates([]);
    }

    if (index == "nifty") {
      setxAxisPriceRange(2000);
      setStrikeDiff(50);
    } else if (index == "banknifty") {
      setxAxisPriceRange(4000);
      setStrikeDiff(100);
    } else if (index == "finnifty") {
      setxAxisPriceRange(2000);
      setStrikeDiff(50);
    } else if (index == "midcpnifty") {
      setxAxisPriceRange(1000);
      setStrikeDiff(25);
    }
  }, [index, data]);

  const fetchOptionChain = async (date) => {
    let current, optionData, IV;
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
          optionData = fetchedOptionData.data;
          // setOptionChain(optionData);

          if (optionData.length > 0 && optionData[0].underlyingValue) {
            const underlyingValue = parseFloat(optionData[0].underlyingValue);
            if (!isNaN(underlyingValue)) {
              current = parseInt(underlyingValue);
              setCurrentPrice(underlyingValue);
              XaxisNumberArray(underlyingValue);
            }
          }

          IV =
            optionData.find(
              (option) => option.strikePrice == IndexStrikeDiff(current)
            ).PE_impliedVolatility / 100;

          console.log(
            "Option Element : ",
            optionData.find(
              (option) => option.strikePrice == IndexStrikeDiff(current)
            )
          );

          console.log("option chain fetched");
        } else {
          console.error("API Request failed with status:", response.status);
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    } finally {
      ProbabilityCurve(current, IV, date);
      console.log("ProbabilityCurve");
    }
  };

  const fetchAll = async () => {
    if (selectedDate == null || index == null) {
      SelectIndexExpDateToast();
    } else {
      await fetchOptionChain(selectedDate);
    }
  };

  const setSelectedIndex = (value) => {
    setIndex(value);
    SelectExpDateToast();
  };

  function ProbabilityCurve(currentPrice, IV, date) {
    let array = [];
    let a;

    // function getStrikeObject(value) {
    //   const returnValue = optionData.find(
    //     (option) => option.strikePrice == value
    //   );
    //   return returnValue;
    // }

    for (
      let i = currentPrice - xAxisPriceRange;
      i <= currentPrice + xAxisPriceRange;
      i++
    ) {
      if (i <= currentPrice) {
        // console.log(
        //   currentPrice,
        //   i,
        //   NoOfDaysForExpiry(date) / 365,
        //   // getStrikeObject(IndexStrikeDiff(i)).PE_impliedVolatility / 100,
        //   IV,
        //   0.1,
        //   "put"
        // );
        a = parseFloat(
          -200 *
            greeks.getDelta(
              currentPrice,
              i,
              NoOfDaysForExpiry(date) / 365,
              // getStrikeObject(IndexStrikeDiff(i)).PE_impliedVolatility / 100,
              IV,
              0.1,
              "put"
            )
        ).toFixed(2);

        if (a > 100) {
          a = -a + 200;
        }

        console.log(a);
        array.push(a);
      } else if (i > currentPrice) {
        // console.log(
        //   currentPrice,
        //   i,
        //   NoOfDaysForExpiry(date) / 365,
        //   // getStrikeObject(IndexStrikeDiff(i)).CE_impliedVolatility / 100,
        //   IV,
        //   0.1,
        //   "call"
        // );
        a = parseFloat(
          200 *
            greeks.getDelta(
              currentPrice,
              i,
              NoOfDaysForExpiry(date) / 365,
              // getStrikeObject(IndexStrikeDiff(i)).CE_impliedVolatility / 100,
              IV,
              0.1,
              "call"
            )
        ).toFixed(2);

        if (a > 100) {
          a = -a + 200;
        }
        console.log(a);
        array.push(a);
      }
    }
    setProbabilityOfTouchGraph(array);
  }

  function XaxisNumberArray(a) {
    const x = parseInt(a);
    const start = x - xAxisPriceRange;
    const end = x + xAxisPriceRange;
    const numbers = [];

    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }
    setXAxisGraphData(numbers);
  }

  function IndexStrikeDiff(number) {
    return Math.floor(number / strikeDiff) * strikeDiff;
  }

  // function getStrikeObject(value) {
  //   const returnValue = optionData.find(
  //     (option) => option.strikePrice == value
  //   );
  //   return returnValue;
  // }

  const currentDate = (value) => {
    fetchOptionChain(value);
    setSelectedDate(value);
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (status === "failed")
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error fetching data
      </div>
    );

  return (
    <>
      <div className="w-full h-fit xl:pr-5 px-3 xl:px-0">
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
            <Select onValueChange={currentDate}>
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

          <div className="md:pt-0 pt-2">
            <Button
              size="icon"
              variant="outline"
              onClick={fetchAll}
              className="w-[300px] md:w-10"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-center items-center flex-col space-y-6 py-5">
        <h2 className="text-base font-bold">Prob. Curve</h2>
        <div className="xl:h-[60vh] md:h-[50vh] h-[40vh] w-full">
          {ProbabilityOfTouchGraph.length === 0 ? (
            <SelectDateCard />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dataArray}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={1} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 200]} />
                <Tooltip content={renderTooltip} />
                <Legend content={renderLegend} />
                <Area
                  type="monotone"
                  dataKey="ProbofTouch"
                  stroke="#8884d8"
                  strokeWidth={1.5}
                  fill="url(#colorUv)"
                  // strokeDasharray="4 4"
                />
                <ReferenceLine
                  x={parseInt(currentPrice)}
                  stroke="green"
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
};

const renderLegend = ({ payload }) => {
  return (
    <ul className="flex justify-center space-x-4 text-xs">
      {payload.map(
        (entry, index) =>
          entry.value === "ProbofTouch" && (
            <li
              key={`legend-${index}`}
              className={cn("font-sm")}
              style={{ color: entry.color }}
            >
              Probability Curve
            </li>
          )
      )}
    </ul>
  );
};

const renderTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const uvEntry = payload.find((entry) => entry.dataKey === "ProbofTouch");

  if (!uvEntry) {
    return null;
  }

  const uvValue = uvEntry.value;
  const uvColor = uvEntry.color;

  return (
    <div className="bg-white p-2 rounded shadow-md text-xs">
      <p>{label}</p>
      <ul>
        <li className="text-gray-700">
          <span style={{ color: uvColor }}>ITM Prob. : {uvValue} %</span>
        </li>
      </ul>
    </div>
  );
};

export default MaxPain;
