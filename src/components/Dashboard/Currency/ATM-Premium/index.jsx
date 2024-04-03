"use client";
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

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  SelectExpDateToast,
  SelectIndexExpDateToast,
  SelectIndexExpDateStrikeToast,
  failedToLoadDateToast,
} from "@/lib/ToastComponent";

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
} from "recharts";
import { cn } from "@/lib/utils";
import { Timearray, sortByDateTime } from "@/lib/utils";

const MaxPain = () => {
  const [graphRange, setGraphRange] = useState(1);
  const [atmPremium, setAtmPremium] = useState(83);
  const [index, setIndex] = useState("usdinr");
  const [selectedDate, setSelectedDate] = useState();
  const [dates, setDates] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [oiData, setOiData] = useState([]);

  const [premiumArr, setPremiumArr] = useState([]);
  const [priceArr, setPriceArr] = useState([]);
  const [atmArr, setAtmArr] = useState([]);

  const { data, status } = useSelector((state) => state.expiryDates);

  const dataArray = Timearray.map((label) => ({
    name: label,
    uv: premiumArr[Timearray.indexOf(label)] || null,
    uw: priceArr[Timearray.indexOf(label)] || null,
    vw: atmArr[Timearray.indexOf(label)] || null,
  }));

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
        getAtm(currentPrice, value);
        console.log(`currentPrice ${currentPrice}`);
      } else {
        console.error("API Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const fetchOI = async (value) => {
    setSelectedDate(value);
    try {
      const url = `${domain}/api/intraDayData/${index.toUpperCase()}/${value}/${atmPremium}`;
      console.log(url);
      const response = await fetch(url);
      const fetchedOI = await response.json();
      const sortedData = sortByDateTime(fetchedOI);
      setOiData(sortedData);
      console.log(sortedData);

      const premium = [];
      const priceArry = [];
      const atmArray = [];

      for (const val of sortedData) {
        const strikePremium =
          parseFloat(val.CE_lastPrice) + parseFloat(val.PE_lastPrice);
        premium.push(strikePremium);

        const indexPrice = val.underlyingValue;
        priceArry.push(indexPrice);

        let a;
        if (index == "usdinr") {
          a = Math.floor(indexPrice / 0.125) * 0.125;
        }
        atmArray.push(a);
      }
      setPriceArr(priceArry);
      setAtmArr(atmArray);
      setPremiumArr(premium);
    } catch (e) {
      console.error("An error occurred while fetching data:", e);
    }
  };

  const fetchAll = async () => {
    if (selectedDate == null || index == null) {
      SelectIndexExpDateToast();
    } else {
      await fetchCurrentPrice(index);
      await fetchOI(selectedDate);
    }
  };

  const setSelectedIndex = (value) => {
    if (value == "usdinr") {
      setGraphRange(1);
    }
    setIndex(value);
    SelectExpDateToast();
  };

  const getAtm = (value, index) => {
    let a;
    if (index == "usdinr") {
      a = Math.floor(value / 0.125) * 0.125;
    }
    setAtmPremium(a);
    console.log(a);
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
    <div className="lg:space-y-4 lg:mb-5">
      <Card className="w-full">
        <div className="p-5  md:justify-between justify-center items-center flex md:flex-row flex-col">
          <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
            <Select onValueChange={setSelectedIndex}>
              <SelectTrigger className="md:w-[160px] w-[300px]">
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
            <Select onValueChange={fetchOI}>
              <SelectTrigger className="md:w-[180px] w-[300px]">
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

          <div className="md:mt-0 mt-2">
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
      </Card>
      <Card className="h-fit">
        <div className="flex justify-center items-center flex-col space-y-6 py-6 mb-5">
          <h2 className="text-base font-bold">ATM Premium</h2>{" "}
          <div className="xl:h-[60vh] md:h-[50vh] h-[40vh] w-full">
            {oiData.length === 0 ? (
              <div className="px-10 h-full w-full">
                <Card className="px-10 h-full w-full">
                  <CardTitle className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl">
                    <span>Select Index and </span>
                    <span className="text-primary"> Exp. Date </span>
                  </CardTitle>
                </Card>
              </div>
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
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={renderTooltip} />
                  <Legend content={renderLegend} />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    strokeWidth={1.5}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <h2 className="text-base font-bold">ATM and Price</h2>{" "}
          <div className="xl:h-[60vh] md:h-[50vh] h-[40vh] w-full">
            {oiData.length === 0 ? (
              <div className="px-10 h-full w-full">
                <Card className="px-10 h-full w-full">
                  <CardTitle className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl">
                    <span>Select Index and </span>
                    <span className="text-primary"> Exp. Date </span>
                  </CardTitle>
                </Card>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataArray}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[atmPremium - graphRange, atmPremium + graphRange]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={renderTooltipLine} />
                  <Legend content={renderLegendLine} />
                  <Line
                    type="monotone"
                    dataKey="uw"
                    stroke="#8884d8"
                    dot={false}
                    strokeWidth={1.5}
                  />
                  <Line
                    type="monotone"
                    dataKey="vw"
                    stroke="#888444"
                    dot={false}
                    strokeWidth={1.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const renderTooltipLine = (props) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-2 rounded shadow-md text-xs">
      <p>{payload[0].payload.name}</p>
      <ul>
        {payload.map((entry, index) => (
          <li
            key={`tooltip-${index}`}
            style={{ color: entry.color }}
            className="text-gray-700"
          >
            {entry.dataKey === "uw" ? "Price" : "ATM"}: {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderLegendLine = (props) => {
  const { payload } = props;

  return (
    <ul className="justify-center flex space-x-4 text-xs">
      {payload.map((entry, index) => (
        <li
          key={`legend-${index}`}
          style={{ color: entry.color }}
          className={"font-sm"}
        >
          {entry.value === "uw" ? "Price" : "ATM"}
        </li>
      ))}
    </ul>
  );
};

const renderLegend = ({ payload }) => {
  return (
    <ul className="flex justify-center space-x-4 text-xs">
      {payload.map(
        (entry, index) =>
          entry.value === "uv" && (
            <li
              key={`legend-${index}`}
              className={cn("font-sm")}
              style={{ color: entry.color }}
            >
              Atm Premium
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

  const uvEntry = payload.find((entry) => entry.dataKey === "uv");

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
          <span style={{ color: uvColor }}>Rs:{uvValue.toFixed(2)}</span>
        </li>
      </ul>
    </div>
  );
};

export default MaxPain;
