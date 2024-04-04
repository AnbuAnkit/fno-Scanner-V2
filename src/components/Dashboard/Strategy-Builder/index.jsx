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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  SelectExpDateToast,
  SelectIndexExpDateToast,
  SelectIndexExpDateStrikeToast,
  failedToLoadDateToast,
} from "@/lib/ToastComponent";
import { useSelector } from "react-redux";
import { domain } from "@/lib/url";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { OptionPrice } from "@/lib/Maths/Formula";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoOfDaysForExpiry } from "@/lib/date";
import greeks from "greeks";
import { nanoid } from "nanoid";
import Logo from "@/components/Icon/Logo";

const buy = "buy";
const sell = "sell";

const OptionChain = () => {
  const [strikeDiff, setStrikeDiff] = useState(0);
  const [lot, setLot] = useState(0);
  const [xAxisPriceRange, setxAxisPriceRange] = useState(2000);
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const [optionchain, setOptionChain] = useState([]);
  const [priceRange, setPriceRange] = useState(2000);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [xaxisGraphData, setXAxisGraphData] = useState([]);
  const [expiredOptionLine, setExpiredOptionLine] = useState([]);
  const [positiveExpiredOptionLine, setPositiveExpiredOptionLine] = useState(
    []
  );
  const [negativeExpiredOptionLine, setNegativeExpiredOptionLine] = useState(
    []
  );
  const [liveOptionLine, setLiveOptionLine] = useState([]);
  const [ProbabilityOfTouchGraph, setProbabilityOfTouchGraph] = useState([]);
  const [positions, setPosition] = useState([]);

  const { data, status } = useSelector((state) => state.expiryDates);

  const dataArray = xaxisGraphData.map((label) => ({
    name: label,
    expiredOptionLine: expiredOptionLine[xaxisGraphData.indexOf(label)],
    positiveExpiredOptionLine:
      positiveExpiredOptionLine[xaxisGraphData.indexOf(label)] || null,
    negativeExpiredOptionLine:
      negativeExpiredOptionLine[xaxisGraphData.indexOf(label)] || null,
    liveOptionLine: liveOptionLine[xaxisGraphData.indexOf(label)],
    ProbofTouch: ProbabilityOfTouchGraph[xaxisGraphData.indexOf(label)],
  }));

  useEffect(() => {
    ReSetGraph();
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
      console.log(data);
    } else {
      setDates([]);
    }

    if (index == "nifty") {
      setxAxisPriceRange(1500);
      setLot(50);
      setStrikeDiff(50);
    } else if (index == "finnifty") {
      setxAxisPriceRange(1500);
      setLot(40);
      setStrikeDiff(50);
    } else if (index == "midnifty") {
      setxAxisPriceRange(700);
      setLot(75);
      setStrikeDiff(25);
    } else if (index == "banknifty") {
      setxAxisPriceRange(2000);
      setLot(15);
      setStrikeDiff(100);
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
              XaxisNumberArray(underlyingValue);
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
    let noOfStrikes = 20;
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

  const returnPositiveValue = (x) => {
    if (x >= 0) {
      return x;
    } else if (x < 0) {
      return -1 * x;
    }
  };

  const deletePosition = (id) => {
    setPosition((prevPositions) =>
      prevPositions.filter((item) => item.id !== id)
    );
  };

  const ReSetGraph = () => {
    setPosition([]);
    setExpiredOptionLine([]);
    setPositiveExpiredOptionLine([]);
    setNegativeExpiredOptionLine([]);
    setLiveOptionLine([]);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  function IndexStrikeDiff(number) {
    return Math.floor(number / strikeDiff) * strikeDiff;
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

  function CallExpiredOptionGraph(start, x, ltp, buyorSell, CallPut) {
    let result = [];
    // CalculateOptionPrice(CallPut, buyorSell, start, ltp, x);

    if (buyorSell == "buy") {
      for (
        let i = currentPrice - xAxisPriceRange;
        i <= currentPrice + xAxisPriceRange;
        i++
      ) {
        if (i <= start) {
          result.push(0);
        } else if (i > start && i <= currentPrice + xAxisPriceRange) {
          result.push(((i - start) * x).toFixed(2));
        } else {
          result.push(
            (
              (i - start + (currentPrice + xAxisPriceRange) - start) *
              x
            ).toFixed(2)
          );
        }
      }
    } else if (buyorSell == "sell") {
      for (
        let i = currentPrice - xAxisPriceRange;
        i <= currentPrice + xAxisPriceRange;
        i++
      ) {
        if (i <= start) {
          result.push(0);
        } else if (i > start && i <= currentPrice + xAxisPriceRange) {
          result.push(((start - i) * x).toFixed(2));
        } else {
          result.push(
            (
              (start - i + (currentPrice + xAxisPriceRange) - start) *
              x
            ).toFixed(2)
          );
        }
      }
    }

    if (buyorSell == "buy") {
      var y11 = -1 * ltp;
    } else if (buyorSell == "sell") {
      var y11 = ltp;
    }
    const newArray1 = result.map((number) => parseInt(number) + y11);

    // let lot;
    // if (index == "nifty") {
    //   lot = 50;
    // } else if (index == "banknifty") {
    //   lot = 15;
    // } else if (index == "finnifty") {
    //   lot = 40;
    // } else if (index == "midcpnifty") {
    //   lot = 75;
    // }

    const newArray = newArray1.map((number) => parseInt(number) * lot);

    return newArray;

    // if (expiredOptionLine.length == 0) {
    //   // setExpiredOptionLine(newArray);
    //   // splitArray(newArray);

    //   return newArray;
    // } else {
    //   const sumArray = expiredOptionLine.map(
    //     (value, index) => value + newArray[index]
    //   );
    //   // setExpiredOptionLine(sumArray);
    //   // splitArray(sumArray);

    //   return sumArray;
    // }
  }

  function PutExpiredOptionGraph(start, x, ltp, buyorSell, CallPut) {
    let result = [];
    // CalculateOptionPrice(CallPut, buyorSell, start, ltp, x);

    if (buyorSell == "buy") {
      for (
        let i = currentPrice - xAxisPriceRange;
        i <= currentPrice + xAxisPriceRange;
        i++
      ) {
        if (i <= start) {
          result.push((start - i) * x);
        } else if (i > start && i <= currentPrice + xAxisPriceRange) {
          result.push(0);
        } else {
          result.push((i - (currentPrice + xAxisPriceRange)) * x);
        }
      }
    } else if (buyorSell == "sell") {
      for (
        let i = currentPrice - xAxisPriceRange;
        i <= currentPrice + xAxisPriceRange;
        i++
      ) {
        if (i <= start) {
          result.push((i - start) * x);
        } else if (i > start && i <= currentPrice + xAxisPriceRange) {
          result.push(0);
        } else {
          result.push((currentPrice + xAxisPriceRange - i) * x);
        }
      }
    }

    if (buyorSell == "buy") {
      var y11 = -1 * ltp;
    } else if (buyorSell == "sell") {
      var y11 = ltp;
    }
    const newArray1 = result.map((number) => parseInt(number) + y11);

    // let lot;
    // if (index == "nifty") {
    //   lot = 50;
    // } else if (index == "banknifty") {
    //   lot = 15;
    // } else if (index == "finnifty") {
    //   lot = 40;
    // } else if (index == "midcpnifty") {
    //   lot = 75;
    // }

    const newArray = newArray1.map((number) => parseInt(number) * lot);

    return newArray;

    // if (expiredOptionLine.length == 0) {
    //   // setExpiredOptionLine(newArray);
    //   // splitArray(newArray);
    //   return newArray;
    // } else {
    //   const sumArray = expiredOptionLine.map(
    //     (value, index) => value + newArray[index]
    //   );
    //   // setExpiredOptionLine(sumArray);
    //   // splitArray(sumArray);
    //   return sumArray;
    // }
  }

  function splitArray(inputArray) {
    const array = inputArray;
    const positiveArray = [];
    const negativeArray = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i] >= 0) {
        positiveArray.push(array[i]);
        negativeArray.push(0);
      } else {
        positiveArray.push(0);
        negativeArray.push(array[i]);
      }
    }
    // setPositiveExpiredOptionLine(positiveArray);
    // setNegativeExpiredOptionLine(negativeArray);
    return { positiveArray, negativeArray };
  }

  function CalculateOptionPrice(CallPut, buyorSell, straikePrice, ltp, nolot) {
    let result = [];
    const diff = straikePrice - currentPrice;
    const strike = straikePrice - 2 * diff;

    for (
      let i = currentPrice - xAxisPriceRange;
      i <= currentPrice + xAxisPriceRange;
      i++
    ) {
      result.push(
        OptionPrice(
          CallPut,
          strike,
          i,
          NoOfDaysForExpiry(selectedDate) / 365,
          0.1,
          getIV(straikePrice, CallPut) / 100
        )
      );
    }

    if (buyorSell == "buy") {
      var y = 1;
      var x = -1 * parseFloat(ltp);
    } else if (buyorSell == "sell") {
      var y = -1;
      var x = parseFloat(ltp);
    }

    const newArray1 = result.map((number) => parseInt(number) * y);
    const newArray2 = newArray1.map((number) => parseInt(number) + x);
    const newArray3 = newArray2.map((number) => parseInt(number) * nolot);

    const newArray = newArray3.map((number) => parseInt(number) * lot);

    return newArray;

    // if (liveOptionLine.length == 0) {
    //   const array = newArray.reverse();
    //   // setLiveOptionLine(array);
    //   return array;
    // } else {
    //   const reverseLiveOptionLine = liveOptionLine.reverse();
    //   const sumArray = reverseLiveOptionLine.map(
    //     (value, index) => value + newArray[index]
    //   );
    //   const array = sumArray.reverse();
    //   // setLiveOptionLine(array);
    //   return array;
    // }
  }

  function getIV(strike, CallPut) {
    if (optionchain.length > 0) {
      let result = optionchain.find((obj) => obj.strikePrice === strike);
      if (CallPut == "c") {
        return result.CE_impliedVolatility;
      } else if (CallPut == "p") {
        return result.PE_impliedVolatility;
      }
    }
  }

  function getCurrentPrice(strike, CallPut) {
    if (optionchain.length > 0) {
      let result = optionchain.find((obj) => obj.strikePrice == strike);
      if (CallPut == "CE") {
        return result.CE_lastPrice;
      } else if (CallPut == "PE") {
        return result.PE_lastPrice;
      }
    }
  }

  function AddPosition(CallPut, buyorSell, straikePrice, ltp, nolot, pop) {
    let OptionType;
    if (CallPut == "c") {
      OptionType = "CE";
    } else if (CallPut == "p") {
      OptionType = "PE";
    }

    const Order = {
      id: nanoid(), // Generate a unique ID
      index: index,
      OptionType: OptionType,
      buyorSell: buyorSell,
      strikePrice: straikePrice,
      entryPrice: ltp,
      expiryDate: selectedDate,
      nolot: nolot,
      pop: pop,
    };

    setPosition((prevPositions) => [...prevPositions, Order]);
  }

  function setGraph(strikePrice, x, ltp, buyorSell, CallPut, pop) {
    AddPosition(CallPut, buyorSell, strikePrice, ltp, x, pop);
    ProbabilityCurve();

    let array = [];
    if (CallPut == "c") {
      array = CallExpiredOptionGraph(strikePrice, x, ltp, buyorSell, CallPut);
    } else if (CallPut == "p") {
      array = PutExpiredOptionGraph(strikePrice, x, ltp, buyorSell, CallPut);
    }

    if (expiredOptionLine.length == 0) {
      setExpiredOptionLine(array);
      splitArray(array);
      var { positiveArray, negativeArray } = splitArray(array);

      // return newArray;
    } else {
      const sumArray = expiredOptionLine.map(
        (value, index) => value + array[index]
      );
      setExpiredOptionLine(sumArray);
      splitArray(sumArray);
      var { positiveArray, negativeArray } = splitArray(sumArray);

      // return sumArray;
    }

    setPositiveExpiredOptionLine(positiveArray);
    setNegativeExpiredOptionLine(negativeArray);

    const liveOptionLIneLocal = CalculateOptionPrice(
      CallPut,
      buyorSell,
      strikePrice,
      ltp,
      x
    );

    if (liveOptionLine.length == 0) {
      const array = liveOptionLIneLocal.reverse();
      setLiveOptionLine(array);
      // return array;
    } else {
      const reverseLiveOptionLine = liveOptionLine.reverse();
      const sumArray = reverseLiveOptionLine.map(
        (value, index) => value + liveOptionLIneLocal[index]
      );
      const array = sumArray.reverse();
      setLiveOptionLine(array);
      // return array;
    }

    // setLiveOptionLine(liveOptionLIne);
  }

  function RemoveGraph(item) {
    deletePosition(item.id);
    let CallPut;
    if (item.OptionType == "CE") {
      CallPut = "c";
    } else if (item.OptionType == "PE") {
      CallPut = "p";
    }

    let array = [];
    if (CallPut == "c") {
      array = CallExpiredOptionGraph(
        item.strikePrice,
        item.nolot,
        item.entryPrice,
        item.buyorSell,
        CallPut
      );
    } else if (CallPut == "p") {
      array = PutExpiredOptionGraph(
        item.strikePrice,
        item.nolot,
        item.entryPrice,
        item.buyorSell,
        CallPut
      );
    }

    const finalArray = expiredOptionLine.map(
      (value, index) => value - array[index]
    );

    setExpiredOptionLine(finalArray);

    const { positiveArray, negativeArray } = splitArray(finalArray);

    setPositiveExpiredOptionLine(positiveArray);
    setNegativeExpiredOptionLine(negativeArray);

    // const newPositiveArray = positiveExpiredOptionLine.map(
    //   (value, index) => value - positiveArray[index]
    // );
    // setPositiveExpiredOptionLine(newPositiveArray);

    // const newNegativeArray = negativeExpiredOptionLine.map(
    //   (value, index) => value - negativeArray[index]
    // );
    // setNegativeExpiredOptionLine(newNegativeArray);

    const liveOptionLIneLocalsample = CalculateOptionPrice(
      CallPut,
      item.buyorSell,
      item.strikePrice,
      item.entryPrice,
      item.nolot
    );

    const liveOptionLIneLocal = liveOptionLIneLocalsample.reverse();

    const newLiveOptionArray = liveOptionLine.map(
      (value, index) => value - liveOptionLIneLocal[index]
    );
    setLiveOptionLine(newLiveOptionArray);
  }

  function credits(options) {
    let sum = 0;
    let multiple;
    let nolot;
    if (optionchain.length > 0) {
      for (const option of options) {
        if (option.buyorSell == "buy") {
          multiple = -1;
          nolot = parseInt(option.nolot);
        } else {
          multiple = 1;
          nolot = parseInt(option.nolot);
        }
        sum += multiple * option.entryPrice * nolot * lot;
      }
    }
    return sum;
  }

  function findNearestStrikePrice(currentPrice, options) {
    if (options.length > 0) {
      let nearestOption = options[0];
      let minDiff = Math.abs(nearestOption.strikePrice - currentPrice);
      for (let i = 1; i < options.length; i++) {
        let diff = Math.abs(options[i].strikePrice - currentPrice);
        if (diff < minDiff) {
          minDiff = diff;
          nearestOption = options[i];
        }
      }
      return nearestOption;
    } else {
      return 0;
    }
  }

  function getStrikeObject(value) {
    return optionchain.find((option) => option.strikePrice == value);
  }

  function PNLofTrade(options) {
    if (optionchain.length > 0) {
      if (options.length > 0) {
        let totalPnL = 0;
        let pnl = 0;
        for (const option of options) {
          if (option.OptionType == "CE") {
            if (option.buyorSell == "buy") {
              pnl =
                (getStrikeObject(option.strikePrice).CE_lastPrice -
                  option.entryPrice) *
                option.nolot;
            } else if (option.buyorSell == "sell") {
              pnl =
                (option.entryPrice -
                  getStrikeObject(option.strikePrice).CE_lastPrice) *
                option.nolot;
            }
          } else if (option.OptionType == "PE") {
            if (option.buyorSell == "buy") {
              pnl =
                (getStrikeObject(option.strikePrice).PE_lastPrice -
                  option.entryPrice) *
                option.nolot;
            } else if (option.buyorSell == "sell") {
              pnl =
                (option.entryPrice -
                  getStrikeObject(option.strikePrice).PE_lastPrice) *
                option.nolot;
            }
          }

          totalPnL = totalPnL + pnl * lot;
        }
        return totalPnL;
      }
    }
  }

  function ProbabilityCurve() {
    let array = [];
    let a;
    for (
      let i = currentPrice - xAxisPriceRange;
      i <= currentPrice + xAxisPriceRange;
      i++
    ) {
      if (i <= currentPrice) {
        a = parseFloat(
          -200 *
            greeks.getDelta(
              currentPrice,
              i,
              NoOfDaysForExpiry(selectedDate) / 365,
              getStrikeObject(IndexStrikeDiff(currentPrice))
                .PE_impliedVolatility / 100,
              0.1,
              "put"
            )
        ).toFixed(2);

        array.push(a);
      } else if (i > currentPrice) {
        a = parseFloat(
          200 *
            greeks.getDelta(
              currentPrice,
              i,
              NoOfDaysForExpiry(selectedDate) / 365,
              getStrikeObject(IndexStrikeDiff(currentPrice))
                .CE_impliedVolatility / 100,
              0.1,
              "call"
            )
        ).toFixed(2);

        array.push(a);
      }
    }
    setProbabilityOfTouchGraph(array);
  }

  const nearestOption = findNearestStrikePrice(currentPrice, positions);

  return (
    <>
      <div className="px-10 flex flex-col md:flex-row md:justify-between justify-center items-center bg-whitep py-5">
        <div className="flex flex-row items-center md:space-x-3 pb-2 md:p-0">
          <Button
            onClick={toggleDrawer}
            variant="default"
            size="lg"
            className="w-[300px] md:w-40"
            x
          >
            Option Chain
          </Button>

          <div className="items-center text-xs hidden lg:flex">
            SPOT Price: <span className="text-blue-500">{currentPrice}</span>{" "}
          </div>
        </div>
        <div className=" md:space-x-5 space-y-2 md:space-y-0 flex flex-col md:flex-row items-center ">
          <Button
            variant="outline"
            onClick={() => ReSetGraph()}
            className="w-[300px] md:w-40"
          >
            Re-Set Positions
          </Button>
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
      <div className="px-10 ">
        <Separator />
      </div>

      <div className="xl:h-[60vh] md:h-[50vh] h-[40vh] w-full py-5 my-10">
        {positions.length === 0 ? (
          <div className="px-10 h-full w-full">
            <div className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl font-semibold">
              <span>Open Option-Chain and </span>
              <span className="text-primary"> Build Strategy </span>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={dataArray}
                margin={{
                  right: 60,
                  left: 20,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  // horizontal={false}
                />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="black" strokeDasharray="4 4" />
                <ReferenceLine
                  x={parseInt(currentPrice)}
                  stroke="green"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="ProbofTouch"
                  stroke="#204fe5"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="4 4"
                />
                {/* <Area
                  strokeWidth={1.5}
                  type="monotone"
                  dataKey="positiveExpiredOptionLine"
                  stroke="#00C30D"
                  fill="#00C30D"
                  fillOpacity={0.2} // Adjust the opacity here
                />
                <Area
                  strokeWidth={1.5}
                  type="monotone"
                  dataKey="negativeExpiredOptionLine"
                  stroke="#FA5456"
                  fill="#FA5456"
                  fillOpacity={0.2} // Adjust the opacity here
                />
                <Line
                  type="monotone"
                  dataKey="liveOptionLine"
                  stroke="#0081D0"
                  strokeWidth={1.5}
                  dot={false}
                  // strokeDasharray="3 3"
                /> */}
              </ComposedChart>
            </ResponsiveContainer>

            <div className="p-10">
              <Separator />
            </div>

            <div className="w-full p-5 flex flex-col xl:flex-row ">
              <div className="xl:w-1/2 space-y-2 p-5 w-full">
                <div className="items-center font-semibold px-5">
                  All Position
                </div>
                {positions.length > 0 &&
                  positions.map((item) => (
                    <Card
                      key={item.id}
                      className="w-full shadow-none rounded-sm p-5 flex justify-between items-center"
                    >
                      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 space-x-0 md:space-x-4">
                        <div>
                          <span className=" text-sm">
                            {item.index} {item.strikePrice} {item.OptionType}{" "}
                            {item.expiryDate} x{item.nolot}
                          </span>
                        </div>
                        <div className="flex justify-between items-center space-x-4">
                          <span
                            className={`${
                              item.buyorSell == "buy"
                                ? " text-green-600"
                                : " text-red-500"
                            } text-xs font-semibold`}
                          >
                            Entry Price : {item.entryPrice}
                          </span>
                          <span
                            className={`${
                              positions.length > 0 &&
                              item.buyorSell -
                                getCurrentPrice(
                                  item.strikePrice,
                                  item.OptionType
                                ) >=
                                0
                                ? " text-green-600"
                                : " text-red-500"
                            } text-xs font-semibold`}
                          >
                            LTP :{" "}
                            {positions.length > 0 &&
                              getCurrentPrice(
                                item.strikePrice,
                                item.OptionType
                              )}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => RemoveGraph(item)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Card>
                  ))}
              </div>
              <div className="space-y-2 p-5 xl:w-1/2 w-full">
                <div className="items-center font-semibold px-5">
                  Trade Details
                </div>
                <Card className="w-full h-80 shadow-none rounded-sm p-5 flex justify-between text-sm">
                  <div className="flex flex-col space-y-3">
                    <span>Prob. of Profit</span>
                    <span>Net Credits</span>
                    <span>Max. Profit</span>
                    <span>Max. Loss</span>
                    <span>Risk Reward Ratio</span>
                    <span>PNL</span>
                  </div>
                  <div className="flex flex-col space-y-3 ">
                    <span>
                      {credits(positions) > 0
                        ? (100 - nearestOption.pop).toFixed(2)
                        : parseFloat(nearestOption.pop).toFixed(2)}
                      %
                    </span>
                    <span>
                      {credits(positions) > 0 ? credits(positions) : 0}
                    </span>
                    <span className="font-semibold">
                      {Math.max(...positiveExpiredOptionLine)}
                    </span>
                    <span className="font-semibold text-red-500">
                      {Math.min(...negativeExpiredOptionLine)}
                    </span>
                    <span
                      className={`${
                        parseFloat(
                          returnPositiveValue(
                            Math.min(...negativeExpiredOptionLine) /
                              Math.max(...positiveExpiredOptionLine)
                          )
                        ).toFixed(2) >= 1
                          ? "text-red-500 font-semibold"
                          : "text-green-500"
                      }`}
                    >
                      {positions.length > 0 &&
                        parseFloat(
                          returnPositiveValue(
                            Math.min(...negativeExpiredOptionLine) /
                              Math.max(...positiveExpiredOptionLine)
                          )
                        ).toFixed(2)}
                    </span>
                    <span
                      className={` ${
                        PNLofTrade(positions) >= 0
                          ? "text-green-500 font-semibold"
                          : "text-red-500 "
                      }`}
                    >
                      {PNLofTrade(positions)}
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Drawer for OptionChain */}
      <div
        className={`fixed top-0 left-0 bg-background shadow-lg z-50 xl:w-4/5 w-full h-full transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-out mb-5 `}
      >
        <nav className="sticky top-0 z-10 bg-background flex flex-row justify-between items-center border-b-[1px] py-2 w-full sm:px-10 px-5">
          <Logo />

          <Button
            variant="destructive"
            size="sm"
            className="ml-auto"
            onClick={() => toggleDrawer()}
          >
            Close
          </Button>
        </nav>

        <div
          className={`flex flex-col md:flex-row px-10 py-5 space-y-2 md:space-y-0 w-full justify-center items-center ${
            isOpen == false && "hidden"
          } `}
        >
          <div className=" flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 ">
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
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={refresh}
            className="md:ml-auto md:w-10 w-[300px]"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </Button>
        </div>

        <div className="lg:px-10">
          <Separator className=" bg-slate-300" />
        </div>

        <div className="lg:px-10 px-5">
          <ScrollArea className="md:h-[80vh] h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center text-xs bg-gray-50  hidden md:table-cell "></TableHead>
                  <TableHead className="text-center text-xs bg-gray-50  hidden md:table-cell "></TableHead>

                  <TableHead className="text-center text-xs bg-gray-50 font-bold  text-green-500">
                    CALL
                  </TableHead>
                  <TableHead className="text-center text-xs bg-gray-50  hidden lg:table-cell "></TableHead>
                  <TableHead className="text-center text-xs bg-gray-50  hidden lg:table-cell"></TableHead>
                  {/* <TableHead className="text-center text-xs bg-gray-50 "></TableHead> */}

                  {/* <TableHead className="text-center text-xs bg-gray-50 "></TableHead> */}
                  <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
                  <TableHead className="text-center text-xs bg-gray-50 "></TableHead>
                  <TableHead className="text-center text-xs bg-gray-50 "></TableHead>

                  <TableHead className="text-center text-xs bg-gray-50 font-bold  text-red-500">
                    PUT
                  </TableHead>
                  <TableHead className="text-center text-xs bg-gray-50  hidden md:table-cell "></TableHead>
                  <TableHead className="text-center text-xs bg-gray-50  hidden md:table-cell "></TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="text-center text-xs font-semibold  bg-green-200">
                    BUY/SELL
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-green-200  hidden md:table-cell">
                    Delta
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-green-200  hidden lg:table-cell">
                    Prob. of Touch
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-green-200  hidden md:table-cell">
                    IV
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-green-200">
                    LTP( LTP CHG.)
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-yellow-100 border-b-[0.5px] border-x-[0.5px]">
                    STRIKE
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-red-200">
                    LTP( LTP CHG.)
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-red-200  hidden md:table-cell">
                    IV
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-red-200  hidden lg:table-cell">
                    Prob. of Touch
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-red-200  hidden md:table-cell">
                    Delta
                  </TableHead>
                  <TableHead className="text-center  text-xs font-semibold bg-red-200">
                    BUY/SELL
                  </TableHead>
                </TableRow>
              </TableHeader>
              {optionchain.length > 0 && (
                <TableBody>
                  {optionchain.map((optionChain) => {
                    const strikePrice = parseFloat(optionChain.strikePrice);
                    const priceDifference = Math.abs(
                      strikePrice - currentPrice
                    );

                    if (priceDifference <= priceRange) {
                      return (
                        <TableRow
                          className="hover:bg-amber-0 text-xs"
                          key={optionChain.strikePrice}
                        >
                          <TableCell
                            className={`text-center hover:bg-amber-0 ${
                              parseFloat(optionChain.strikePrice) < currentPrice
                                ? "bg-green-100"
                                : ""
                            }`}
                          >
                            <span className="space-x-2 flex flex-row">
                              <button
                                onClick={() =>
                                  setGraph(
                                    optionChain.strikePrice,
                                    1,
                                    optionChain.CE_lastPrice,
                                    sell,
                                    "c",
                                    (
                                      100 *
                                      greeks.getDelta(
                                        currentPrice,
                                        optionChain.strikePrice,
                                        NoOfDaysForExpiry(selectedDate) / 365,
                                        optionChain.CE_impliedVolatility / 100,
                                        0.1,
                                        "call"
                                      )
                                    ).toFixed(2)
                                  )
                                }
                                className="bg-red-500 hover:bg-red-300 py-1 px-3 rounded-sm text-white"
                              >
                                S
                              </button>
                              <button
                                onClick={() =>
                                  setGraph(
                                    optionChain.strikePrice,
                                    1,
                                    optionChain.CE_lastPrice,
                                    buy,
                                    "c",
                                    (
                                      100 *
                                      greeks.getDelta(
                                        currentPrice,
                                        optionChain.strikePrice,
                                        NoOfDaysForExpiry(selectedDate) / 365,
                                        optionChain.CE_impliedVolatility / 100,
                                        0.1,
                                        "call"
                                      )
                                    ).toFixed(2)
                                  )
                                }
                                className="bg-green-500 hover:bg-green-300 py-1 px-3 rounded-sm text-white"
                              >
                                B
                              </button>
                            </span>
                          </TableCell>
                          <TableCell
                            className={`text-center hover:bg-amber-0  hidden md:table-cell ${
                              parseFloat(optionChain.strikePrice) < currentPrice
                                ? "bg-green-100"
                                : ""
                            }`}
                          >
                            {(
                              100 *
                              greeks.getDelta(
                                currentPrice,
                                optionChain.strikePrice,
                                NoOfDaysForExpiry(selectedDate) / 365,
                                optionChain.CE_impliedVolatility / 100,
                                0.1,
                                "call"
                              )
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-center hover:bg-amber-0  hidden lg:table-cell ${
                              parseFloat(optionChain.strikePrice) < currentPrice
                                ? "bg-green-100"
                                : ""
                            }`}
                          >
                            {(
                              200 *
                              greeks.getDelta(
                                currentPrice,
                                optionChain.strikePrice,
                                NoOfDaysForExpiry(selectedDate) / 365,
                                optionChain.CE_impliedVolatility / 100,
                                0.1,
                                "call"
                              )
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-center hover:bg-amber-0  hidden md:table-cell ${
                              parseFloat(optionChain.strikePrice) < currentPrice
                                ? "bg-green-100"
                                : ""
                            }`}
                          >
                            {parseFloat(
                              optionChain.CE_impliedVolatility
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell
                            className={`text-center hover:bg-amber-0 ${
                              parseFloat(optionChain.strikePrice) < currentPrice
                                ? "bg-green-100"
                                : ""
                            }`}
                          >
                            {optionChain.CE_lastPrice} (
                            <span
                              className={`${getColorBasedOnValue(
                                parseFloat(optionChain.CE_change)
                              )}`}
                            >
                              {parseFloat(optionChain.CE_change).toFixed(2)}
                            </span>
                            )
                          </TableCell>
                          <TableCell className="text-center hover:bg-amber-0 font-semibold bg-yellow-50">
                            {optionChain.strikePrice}
                          </TableCell>
                          <TableCell
                            className={`text-center  hover:bg-amber-0 ${
                              parseFloat(optionChain.strikePrice) > currentPrice
                                ? "bg-red-100"
                                : ""
                            }`}
                          >
                            {optionChain.PE_lastPrice}(
                            <span
                              className={` ${getColorBasedOnValue(
                                parseFloat(optionChain.PE_change)
                              )}`}
                            >
                              {parseFloat(optionChain.PE_change).toFixed(2)}
                            </span>
                            )
                          </TableCell>

                          <TableCell
                            className={`text-center hover:bg-amber-0  hidden md:table-cell ${
                              parseFloat(optionChain.strikePrice) > currentPrice
                                ? "bg-red-100"
                                : ""
                            }`}
                          >
                            {parseFloat(
                              optionChain.PE_impliedVolatility
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-center hover:bg-amber-0 hidden lg:table-cell ${
                              parseFloat(optionChain.strikePrice) > currentPrice
                                ? "bg-red-100"
                                : ""
                            }`}
                          >
                            {(
                              -200 *
                              greeks.getDelta(
                                currentPrice,
                                optionChain.strikePrice,
                                NoOfDaysForExpiry(selectedDate) / 365,
                                optionChain.PE_impliedVolatility / 100,
                                0.1,
                                "put"
                              )
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-center hover:bg-amber-0 hidden md:table-cell ${
                              parseFloat(optionChain.strikePrice) > currentPrice
                                ? "bg-red-100"
                                : ""
                            }`}
                          >
                            {(
                              100 *
                              greeks.getDelta(
                                currentPrice,
                                optionChain.strikePrice,
                                NoOfDaysForExpiry(selectedDate) / 365,
                                optionChain.PE_impliedVolatility / 100,
                                0.1,
                                "put"
                              )
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={`text-center hover:bg-amber-0 ${
                              parseFloat(optionChain.strikePrice) > currentPrice
                                ? "bg-red-100"
                                : ""
                            }`}
                          >
                            <span className="space-x-2 flex flex-row">
                              <button
                                onClick={() =>
                                  setGraph(
                                    optionChain.strikePrice,
                                    1,
                                    optionChain.PE_lastPrice,
                                    buy,
                                    "p",
                                    (
                                      -100 *
                                      greeks.getDelta(
                                        currentPrice,
                                        optionChain.strikePrice,
                                        NoOfDaysForExpiry(selectedDate) / 365,
                                        optionChain.PE_impliedVolatility / 100,
                                        0.1,
                                        "put"
                                      )
                                    ).toFixed(2)
                                  )
                                }
                                className="bg-green-500 hover:bg-green-300 py-1 px-3 rounded-sm text-white"
                              >
                                B
                              </button>

                              <button
                                onClick={() =>
                                  setGraph(
                                    optionChain.strikePrice,
                                    1,
                                    optionChain.PE_lastPrice,
                                    sell,
                                    "p",
                                    (
                                      -100 *
                                      greeks.getDelta(
                                        currentPrice,
                                        optionChain.strikePrice,
                                        NoOfDaysForExpiry(selectedDate) / 365,
                                        optionChain.PE_impliedVolatility / 100,
                                        0.1,
                                        "put"
                                      )
                                    ).toFixed(2)
                                  )
                                }
                                className="bg-red-500 hover:bg-red-300 py-1 px-3 rounded-sm text-white"
                              >
                                S
                              </button>
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
            {optionchain.length === 0 && (
              <div className=" my-10 h-[40vh] shadow-none mb-12 ">
                <Card className="w-full h-full">
                  <CardTitle className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl">
                    <span>Select Index and </span>
                    <span className="text-primary"> Exp. Date </span>
                  </CardTitle>
                </Card>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={toggleDrawer}
        />
      )}
    </>
  );
};

export default OptionChain;

const getColorBasedOnValue = (value) => {
  if (!value) return "text-black";
  return value < 0
    ? "font-semibold  text-red-500"
    : "font-semibold font-bold text-green-600";
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white rounded-md p-4 border border-gray-300 ">
        <p className="text-sm font-semibold">{`Price: ${label}`}</p>
        <ul className="flex flex-col justify-start text-xs">
          {payload.map((entry, index) => (
            <li key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name === "positiveExpiredOptionLine"
                ? "On Expiry"
                : entry.name === "negativeExpiredOptionLine"
                ? "On Expiry"
                : entry.name === "liveOptionLine"
                ? "Current P&L"
                : "Prob. of Touch"}
              : {entry.value}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
