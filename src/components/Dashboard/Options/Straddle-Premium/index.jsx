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
  SelectStrikeToast,
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
import { Separator } from "@/components/ui/separator";
import { SelectDateCard } from "@/components/SelectDateCard";

const MaxPain = () => {
  const [index, setIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [dates, setDates] = useState([]);
  const [strikes, setStrikes] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStrike, setCurrentStrike] = useState(0);
  const [oiData, setOiData] = useState([]);
  const [premiumArr, setPremiumArr] = useState([]);
  const [CEpremium, setCEpremium] = useState([]);
  const [PEpremium, setPEpremium] = useState([]);

  const dataArray = Timearray.map((label) => ({
    name: label,
    prem: premiumArr[Timearray.indexOf(label)] || null,
    CEprem: CEpremium[Timearray.indexOf(label)] || null,
    PEprem: PEpremium[Timearray.indexOf(label)] || null,
  }));

  const { data, status } = useSelector((state) => state.expiryDates);

  useEffect(() => {
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
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
        console.log(`currentPrice ${fetchedData} ${currentPrice}`);
      } else {
        console.error("API Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  function findMultiples50Around(num, index) {
    const multiples = [];
    let mul;

    if (index == "nifty") {
      mul = 50;
    } else if (index == "banknifty") {
      mul = 100;
    } else if (index == "finnifty") {
      mul = 50;
    } else if (index == "midcpnifty") {
      mul = 25;
    }

    const base = Math.floor(num / mul) * mul;

    for (let i = 20; i >= 1; i--) {
      multiples.push(base - mul * i); // Add below multiples
    }

    multiples.push(base);

    for (let i = 1; i <= 20; i++) {
      multiples.push(base + mul * i); // Add above multiples
    }

    setStrikes(multiples);
  }

  const SetSelected = (value) => {
    setSelectedDate(value);
    SelectStrikeToast();
  };

  const fetchOI = async (value) => {
    setCurrentStrike(value);
    try {
      if (value == null || index == null || selectedDate == null) {
        refeshDataToast();
      } else {
        const url = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${value}`;
        const response = await fetch(url);
        const fetchedOI = await response.json();
        const sortedData = sortByDateTime(fetchedOI);
        setOiData(sortedData);
        console.log(sortedData);

        const premium = [];
        const CEpremium = [];
        const PEpremium = [];

        for (const val of fetchedOI) {
          const strikePremium =
            parseFloat(val.CE_lastPrice) + parseFloat(val.PE_lastPrice);
          premium.push(strikePremium);

          const CE = parseFloat(val.CE_lastPrice);
          const PE = parseFloat(val.PE_lastPrice);

          CEpremium.push(CE);
          PEpremium.push(PE);
        }

        setPremiumArr(premium);
        setCEpremium(CEpremium);
        setPEpremium(PEpremium);
      }
    } catch (e) {
      console.error("An error occurred while fetching data:", e);
    }
  };

  const fetchAll = async () => {
    if (selectedDate == null || index == null || selectedDate == null) {
      SelectIndexExpDateStrikeToast();
    } else {
      await fetchCurrentPrice(index);
      await fetchOI(currentStrike);
    }
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
            <Select onValueChange={SetSelected}>
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
            <Select onValueChange={fetchOI}>
              <SelectTrigger className="md:w-[160px] w-[300px]">
                <SelectValue placeholder="Select a Strike" />
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
      </div>

      <Separator />

      <div className="flex justify-center items-center flex-col space-y-6 py-5 mb-5">
        <h2 className="text-base font-bold">Straddle Premium</h2>{" "}
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {oiData.length === 0 ? (
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
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={renderTooltip} />
                <Legend content={renderLegend} />
                <Area
                  type="monotone"
                  dataKey="prem"
                  stroke="#8884d8"
                  strokeWidth={1.5}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <h2 className="text-base font-bold">CE and PE Premium</h2>{" "}
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {oiData.length === 0 ? (
            <SelectDateCard />
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
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={renderTooltipLine} />
                <Legend content={renderLegendLine} />
                <Line
                  type="monotone"
                  dataKey="CEprem"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="PEprem"
                  stroke="#888444"
                  dot={false}
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
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
            {entry.dataKey === "CEprem" ? "CE Premium" : "PE Premium "}:
            {entry.value}
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
          {entry.value === "CEprem" ? "CE Premium" : "PE Premium "}
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
          entry.value === "prem" && (
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

  const uvEntry = payload.find((entry) => entry.dataKey === "prem");

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
