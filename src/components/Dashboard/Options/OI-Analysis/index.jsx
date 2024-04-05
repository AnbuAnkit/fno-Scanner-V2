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
import {
  SelectExpDateToast,
  SelectIndexExpDateToast,
  SelectIndexExpDateStrikeToast,
  failedToLoadDateToast,
} from "@/lib/ToastComponent";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";

import { domain } from "@/lib/url";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { SelectDateCard } from "@/components/SelectDateCard";

const MaxPain = () => {
  const [priceRange, setPriceRange] = useState(700);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [index, setIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [dates, setDates] = useState([]);
  const [optionChain, setOptionChain] = useState([]);
  const [atm, setAtm] = useState(0);

  const processedData = optionChain.map((item) => ({
    ...item,
    CEOILTP: item.CE_OI * item.CE_lastPrice,
    PEOILTP: item.PE_OI * item.PE_lastPrice,
    CEChangeOILTP: item.CE_changeinOpenInterest * item.CE_lastPrice,
    PEChangeOILTP: item.PE_changeinOpenInterest * item.PE_lastPrice,
  }));

  const { data, status } = useSelector((state) => state.expiryDates);

  useEffect(() => {
    if (index && data.data && data.data[index]) {
      setDates(data.data[index]);
    } else {
      setDates([]);
    }
  }, [index, data]);

  const fetchOI = async (value) => {
    setSelectedDate(value);

    const params = `${index}-optionChain-${value}`;
    try {
      const oiUrl = `${domain}/api/optionChain/${params}`;
      const response = await fetch(oiUrl);

      if (response.ok) {
        const fetchedOI = await response.json();
        const newFetchedOI = fetchedOI.data;
        console.log("OI fetched");

        if (newFetchedOI.length > 0 && newFetchedOI[0].underlyingValue) {
          const underlyingValue = parseFloat(newFetchedOI[0].underlyingValue);
          if (!isNaN(underlyingValue)) {
            setCurrentPrice(underlyingValue);
            setAtm(RoundOff(underlyingValue));
          }
        }
        setOptionChain(newFetchedOI);
      } else {
        console.error("API Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const fetchAll = () => {
    if (selectedDate == null || index == null) {
      SelectIndexExpDateToast();
    } else {
      fetchOI(selectedDate);
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

  const RoundOff = (number) => {
    if (index == "nifty") {
      return Math.floor(number / 50) * 50;
    } else if (index == "midcpnifty") {
      return Math.floor(number / 25) * 25;
    } else if (index == "banknifty") {
      return Math.floor(number / 100) * 100;
    } else if (index == "finnifty") {
      return Math.floor(number / 50) * 50;
    }
  };

  const filteredOptionChain = processedData.filter(
    (data) =>
      data.strikePrice >= currentPrice - priceRange &&
      data.strikePrice <= currentPrice + priceRange
  );

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
    <div className="w-full h-fit xl:pr-5 pb-5 px-3 xl:px-0">
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
          <Select onValueChange={fetchOI}>
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
            <SelectTrigger className="md:w-[140px]  w-[300px]">
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
          <div className="space-x-5 lg:flex flex-row text-gray-600 text-xs font-semibold hidden">
            <div className="py-3">
              SPOT Price: <span className="text-blue-500">{currentPrice}</span>{" "}
            </div>
          </div>
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
      <Separator />
      <div className="flex justify-center items-center flex-col space-y-6 py-5">
        <h2 className="text-base font-bold">Open-Intrests</h2>
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {optionChain.length === 0 ? (
            <SelectDateCard />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={filteredOptionChain}
                margin={{
                  top: 40,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="strikePrice" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={renderTooltip} />
                <Legend content={renderLegend} />
                <Bar dataKey="CE_OI" fill="#17A589" />
                <Bar dataKey="PE_OI" fill="#EC7063" />
                <ReferenceLine
                  x={atm}
                  stroke="gray"
                  strokeDasharray="5 5"
                  label={{
                    value: `Current ATM: ${atm}`,
                    position: "top",
                    fill: "Gray",
                    fontSize: "12px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <h2 className="text-base font-bold">Open-Intrests * LTP</h2>{" "}
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {optionChain.length === 0 ? (
            <SelectDateCard />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={filteredOptionChain}
                margin={{
                  top: 40,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="strikePrice" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={TooltipforOILTP} />
                <Legend content={LegendforOILTP} />
                <Bar dataKey="CEOILTP" fill="#17A589" className="w-[5px]" />
                <Bar dataKey="PEOILTP" fill="#EC7063" className="w-[5px]" />
                <ReferenceLine
                  x={atm}
                  stroke="gray"
                  strokeDasharray="5 5"
                  label={{
                    value: `Current ATM: ${atm}`,
                    position: "top",
                    fill: "Gray",
                    fontSize: "12px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <h2 className="text-base font-bold">Change in Open-Intrests</h2>{" "}
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {optionChain.length === 0 ? (
            <SelectDateCard />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={filteredOptionChain}
                margin={{
                  top: 40,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="strikePrice" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={renderTooltipChangeOI} />
                <Legend content={renderLegendChangeOI} />
                <Bar
                  dataKey="CE_changeinOpenInterest"
                  fill="#17A589"
                  className="w-[5px]"
                />
                <Bar
                  dataKey="PE_changeinOpenInterest"
                  fill="#EC7063"
                  className="w-[5px]"
                />
                <ReferenceLine
                  x={atm}
                  stroke="gray"
                  strokeDasharray="5 5"
                  label={{
                    value: `Current ATM: ${atm}`,
                    position: "top",
                    fill: "Gray",
                    fontSize: "12px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <h2 className="text-base font-bold">Change in Open-Intrests * LTP</h2>{" "}
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {optionChain.length === 0 ? (
            <SelectDateCard />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={filteredOptionChain}
                margin={{
                  top: 40,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="strikePrice" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={TooltipforOIChangeLTP} />
                <Legend content={LegendforOIChangeLTP} />
                <Bar
                  dataKey="CEChangeOILTP"
                  fill="#17A589"
                  className="w-[5px]"
                />
                <Bar
                  dataKey="PEChangeOILTP"
                  fill="#EC7063"
                  className="w-[5px]"
                />
                <ReferenceLine
                  x={atm}
                  stroke="gray"
                  strokeDasharray="5 5"
                  label={{
                    value: `Current ATM: ${atm}`,
                    position: "top",
                    fill: "Gray",
                    fontSize: "12px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const renderLegend = (props) => {
  const { payload } = props;

  return (
    <ul className="justify-center flex space-x-4 text-sm">
      {payload.map((entry, index) => (
        <li
          key={`legend-${index}`}
          style={{ color: entry.color }}
          className={cn("font-sm")}
        >
          {entry.value === "CE_OI" ? "CE OI" : "PE OI"}
        </li>
      ))}
    </ul>
  );
};

const renderTooltip = (props) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  const ceOi = payload.find((entry) => entry.dataKey === "CE_OI").value;
  const peOi = payload.find((entry) => entry.dataKey === "PE_OI").value;
  const pcr = peOi !== 0 ? (ceOi / peOi).toFixed(2) : "Infinity";

  return (
    <div className="bg-white p-2 rounded shadow-md text-xs">
      {" "}
      {/* Apply Tailwind CSS classes */}
      <p>{payload[0].payload.strikePrice}</p>
      <ul>
        {payload.map((entry, index) => (
          <li
            key={`tooltip-${index}`}
            style={{ color: entry.color }}
            className="text-gray-700" // Customize text color
          >
            {entry.dataKey === "CE_OI"
              ? "CE Open Interest"
              : "PE Open Interest"}
            : {entry.value}
          </li>
        ))}
        <li className="text-gray-700">PCR: {pcr}</li>{" "}
        {/* Include PCR in the tooltip */}
      </ul>
    </div>
  );
};

const renderLegendChangeOI = (props) => {
  const { payload } = props;

  return (
    <ul className="justify-center flex space-x-4 text-sm">
      {payload.map((entry, index) => (
        <li
          key={`legend-${index}`}
          style={{ color: entry.color }}
          className={cn("font-sm")}
        >
          {entry.value === "CE_changeinOpenInterest"
            ? "CE OI Change"
            : "PE OI Change"}
        </li>
      ))}
    </ul>
  );
};

const renderTooltipChangeOI = (props) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  const ceOi = payload.find(
    (entry) => entry.dataKey === "CE_changeinOpenInterest"
  ).value;
  const peOi = payload.find(
    (entry) => entry.dataKey === "PE_changeinOpenInterest"
  ).value;
  const pcr = peOi !== 0 ? (ceOi / peOi).toFixed(2) : "Infinity";

  return (
    <div className="bg-white p-2 rounded shadow-md text-xs">
      {" "}
      {/* Apply Tailwind CSS classes */}
      <p>{payload[0].payload.strikePrice}</p>
      <ul>
        {payload.map((entry, index) => (
          <li
            key={`tooltip-${index}`}
            style={{ color: entry.color }}
            className="text-gray-700" // Customize text color
          >
            {entry.dataKey === "CE_OI"
              ? "CE Open Interest"
              : "PE Open Interest"}
            : {entry.value}
          </li>
        ))}
        <li className="text-gray-700">PCR: {pcr}</li>{" "}
        {/* Include PCR in the tooltip */}
      </ul>
    </div>
  );
};

const TooltipforOILTP = (props) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  const ceOi = payload.find((entry) => entry.dataKey === "CEOILTP").value;
  const peOi = payload.find((entry) => entry.dataKey === "PEOILTP").value;
  const pcr = peOi !== 0 ? (ceOi / peOi).toFixed(2) : "Infinity";

  return (
    <div className="bg-white p-2 rounded shadow-md text-xs">
      {" "}
      {/* Apply Tailwind CSS classes */}
      <p>{payload[0].payload.strikePrice}</p>
      <ul>
        {payload.map((entry, index) => (
          <li
            key={`tooltip-${index}`}
            style={{ color: entry.color }}
            className="text-gray-700" // Customize text color
          >
            {entry.dataKey === "CE_OI" ? "CE OI * LTP" : "PE OI * LTP"}:{" "}
            {entry.value.toFixed(2)}
          </li>
        ))}
        <li className="text-gray-700">PCR: {pcr}</li>{" "}
        {/* Include PCR in the tooltip */}
      </ul>
    </div>
  );
};

const LegendforOILTP = (props) => {
  const { payload } = props;

  return (
    <ul className="justify-center flex space-x-4 text-sm">
      {payload.map((entry, index) => (
        <li
          key={`legend-${index}`}
          style={{ color: entry.color }}
          className={cn("font-sm")}
        >
          {entry.value === "CEOILTP" ? "CE OI * LTP" : "CE OI * LTP"}
        </li>
      ))}
    </ul>
  );
};

const TooltipforOIChangeLTP = (props) => {
  const { payload } = props;

  if (!payload || payload.length === 0) {
    return null;
  }

  const ceOi = payload.find((entry) => entry.dataKey === "CEChangeOILTP").value;
  const peOi = payload.find((entry) => entry.dataKey === "PEChangeOILTP").value;
  const pcr = peOi !== 0 ? (ceOi / peOi).toFixed(2) : "Infinity";

  return (
    <div className="bg-white p-2 rounded shadow-md text-xs">
      {" "}
      {/* Apply Tailwind CSS classes */}
      <p>{payload[0].payload.strikePrice}</p>
      <ul>
        {payload.map((entry, index) => (
          <li
            key={`tooltip-${index}`}
            style={{ color: entry.color }}
            className="text-gray-700" // Customize text color
          >
            {entry.dataKey === "CEChangeOILTP"
              ? "CE OIChange * LTP"
              : "PE OIChange * LTP"}
            : {entry.value.toFixed(2)}
          </li>
        ))}
        <li className="text-gray-700">PCR: {pcr}</li>{" "}
        {/* Include PCR in the tooltip */}
      </ul>
    </div>
  );
};

const LegendforOIChangeLTP = (props) => {
  const { payload } = props;

  return (
    <ul className="justify-center flex space-x-4 text-sm">
      {payload.map((entry, index) => (
        <li
          key={`legend-${index}`}
          style={{ color: entry.color }}
          className={cn("font-sm")}
        >
          {entry.value === "CEChangeOILTP"
            ? "CE OIChange * LTP"
            : "CE OIChange * LTP"}
        </li>
      ))}
    </ul>
  );
};

export default MaxPain;
