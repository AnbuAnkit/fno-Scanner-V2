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
import { RefreshCw, ArrowRight } from "lucide-react";
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
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { Timearray, sortByDateTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SelectDateCard } from "@/components/SelectDateCard";

const MaxPain = () => {
  //////////////////////////////////////
  const [ce1, setCe1] = useState(null);
  const [ce2, setCe2] = useState(null);
  const [ce3, setCe3] = useState(null);
  ////////////////////////////////////////
  const [pe1, setPe1] = useState(null);
  const [pe2, setPe2] = useState(null);
  const [pe3, setPe3] = useState(null);

  ///////////////////////////////////////
  const [index, setIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [dates, setDates] = useState([]);
  const [strikes, setStrikes] = useState([]);
  const { data, status } = useSelector((state) => state.expiryDates);

  const [dataLoaded, setDataLoaded] = useState(false);

  ////////////////////////////////////////
  const [CE1oi, setCE1oi] = useState([]);
  const [CE2oi, setCE2oi] = useState([]);
  const [CE3oi, setCE3oi] = useState([]);
  const [PE1oi, setPE1oi] = useState([]);
  const [PE2oi, setPE2oi] = useState([]);
  const [PE3oi, setPE3oi] = useState([]);
  /////////////////////////////////////////
  const [CE1oichange, setCE1oichange] = useState([]);
  const [CE2oichange, setCE2oichange] = useState([]);
  const [CE3oichange, setCE3oichange] = useState([]);
  const [PE1oichange, setPE1oichange] = useState([]);
  const [PE2oichange, setPE2oichange] = useState([]);
  const [PE3oichange, setPE3oichange] = useState([]);
  ////////////////////////////////////////

  const dataArray = Timearray.map((label) => ({
    name: label,
    CE1oi: CE1oi[Timearray.indexOf(label)] || null,
    CE2oi: CE2oi[Timearray.indexOf(label)] || null,
    CE3oi: CE3oi[Timearray.indexOf(label)] || null,
    PE1oi: PE1oi[Timearray.indexOf(label)] || null,
    PE2oi: PE2oi[Timearray.indexOf(label)] || null,
    PE3oi: PE3oi[Timearray.indexOf(label)] || null,
    CE1oichange: CE1oichange[Timearray.indexOf(label)] || null,
    CE2oichange: CE2oichange[Timearray.indexOf(label)] || null,
    CE3oichange: CE3oichange[Timearray.indexOf(label)] || null,
    PE1oichange: PE1oichange[Timearray.indexOf(label)] || null,
    PE2oichange: PE2oichange[Timearray.indexOf(label)] || null,
    PE3oichange: PE3oichange[Timearray.indexOf(label)] || null,
  }));

  const MaxOI = Math.max(
    ...CE1oi,
    ...CE2oi,
    ...CE3oi,
    ...PE1oi,
    ...PE2oi,
    ...PE3oi
  );
  const MinOI = Math.min(
    ...CE1oi,
    ...CE2oi,
    ...CE3oi,
    ...PE1oi,
    ...PE2oi,
    ...PE3oi
  );

  const MaxOIchange = Math.max(
    ...CE1oichange,
    ...CE2oichange,
    ...CE3oichange,
    ...PE1oichange,
    ...PE2oichange,
    ...PE3oichange
  );

  const MinOIchange = Math.min(
    ...CE1oichange,
    ...CE2oichange,
    ...CE3oichange,
    ...PE1oichange,
    ...PE2oichange,
    ...PE3oichange
  );

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

    for (let i = 30; i >= 1; i--) {
      multiples.push(base - mul * i); // Add below multiples
    }

    multiples.push(base);

    for (let i = 1; i <= 30; i++) {
      multiples.push(base + mul * i); // Add above multiples
    }

    setStrikes(multiples);
  };

  const fetchOI = async () => {
    try {
      if (index == null || selectedDate == null) {
        SelectIndexExpDateStrikeToast();
      } else {
        /////////////////////
        let ceArr1 = [];
        let ceArr2 = [];
        let ceArr3 = [];
        /////////////////////
        let peArr1 = [];
        let peArr2 = [];
        let peArr3 = [];
        /////////////////////
        let ceOiArr1 = [];
        let ceOiArr2 = [];
        let ceOiArr3 = [];

        /////////////////////
        let peOiArr1 = [];
        let peOiArr2 = [];
        let peOiArr3 = [];

        if (ce1 != null) {
          const urlCE = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${ce1}`;
          const response1 = await fetch(urlCE);
          const fetchedOI1 = await response1.json();
          const sortedData1 = sortByDateTime(fetchedOI1);

          for (const val of sortedData1) {
            const CE = parseFloat(val.CE_change);
            const CE2 = parseFloat(val.CE_lastPrice);
            ceArr1.push(CE.toFixed(2));
            ceOiArr1.push(CE2.toFixed(2));
          }
        }
        if (ce2 != null) {
          const urlCE = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${ce2}`;
          const response1 = await fetch(urlCE);
          const fetchedOI1 = await response1.json();
          const sortedData1 = sortByDateTime(fetchedOI1);

          for (const val of sortedData1) {
            const CE = parseFloat(val.CE_change);
            const CE2 = parseFloat(val.CE_lastPrice);

            ceArr2.push(CE.toFixed(2));
            ceOiArr2.push(CE2.toFixed(2));
          }
        }
        if (ce3 != null) {
          const urlCE = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${ce3}`;
          const response1 = await fetch(urlCE);
          const fetchedOI1 = await response1.json();
          const sortedData1 = sortByDateTime(fetchedOI1);

          for (const val of sortedData1) {
            const CE = parseFloat(val.CE_change);
            const CE2 = parseFloat(val.CE_lastPrice);

            ceArr3.push(CE.toFixed(2));
            ceOiArr3.push(CE2.toFixed(2));
          }
        }
        if (pe1 != null) {
          const urlPE = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${pe1}`;
          const response1 = await fetch(urlPE);
          const fetchedOI1 = await response1.json();
          const sortedData1 = sortByDateTime(fetchedOI1);

          for (const val of sortedData1) {
            const PE = parseFloat(val.PE_change);
            const PE2 = parseFloat(val.PE_lastPrice);

            peArr1.push(PE.toFixed(2));
            peOiArr1.push(PE2.toFixed(2));
          }
        }
        if (pe2 != null) {
          const urlPE = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${pe2}`;
          const response1 = await fetch(urlPE);
          const fetchedOI1 = await response1.json();
          const sortedData1 = sortByDateTime(fetchedOI1);

          for (const val of sortedData1) {
            const PE = parseFloat(val.PE_change);
            const PE2 = parseFloat(val.PE_lastPrice);

            peOiArr2.push(PE2.toFixed(2));
            peArr2.push(PE.toFixed(2));
          }
        }
        if (pe3 != null) {
          const urlPE = `${domain}/api/intraDayData/${index.toUpperCase()}/${selectedDate}/${pe3}`;
          const response1 = await fetch(urlPE);
          const fetchedOI1 = await response1.json();
          const sortedData1 = sortByDateTime(fetchedOI1);

          for (const val of sortedData1) {
            const PE = parseFloat(val.PE_change);
            const PE2 = parseFloat(val.PE_lastPrice);

            peOiArr3.push(PE2.toFixed(2));
            peArr3.push(PE.toFixed(2));
          }
        }

        setCE1oichange(ceArr1);
        setCE1oi(ceOiArr1);

        setCE2oichange(ceArr2);
        setCE2oi(ceOiArr2);

        setCE3oichange(ceArr3);
        setCE3oi(ceOiArr3);

        setPE1oichange(peArr1);
        setPE1oi(peOiArr1);

        setPE2oichange(peArr2);
        setPE2oi(peOiArr2);

        setPE3oichange(peArr3);
        setPE3oi(peOiArr3);

        setDataLoaded(true);
      }
    } catch (e) {
      console.error("An error occurred while fetching data:", e);
    }
  };

  const fetchAll = async () => {
    if (index == null || selectedDate == null) {
      SelectIndexExpDateStrikeToast();
    } else {
      await fetchOI();
    }
  };

  const setSelected = (value) => {
    setSelectedDate(value);
  };
  /////////////////////////////////////////
  const ceStrike1 = (value) => {
    setCe1(value);
  };
  const ceStrike2 = (value) => {
    setCe2(value);
  };
  const ceStrike3 = (value) => {
    setCe3(value);
  };
  //////////////////////////////////////////
  const peStrike1 = (value) => {
    setPe1(value);
  };
  const peStrike2 = (value) => {
    setPe2(value);
  };
  const peStrike3 = (value) => {
    setPe3(value);
  };
  //////////////////////////////////////////

  const setSelectedIndex = (value) => {
    setIndex(value);
    SelectExpDateToast();
    setDataLoaded(false);
  };

  const CustomTooltip = (props) => {
    const { active, payload } = props;

    if (!active || !payload || payload.length === 0) {
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
              className="text-gray-700 text-xs"
            >
              {getLabel(entry.dataKey)}: {entry.value}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getLabel = (dataKey) => {
    switch (dataKey) {
      case "CE1oichange":
        return `${ce1}CE Change in LTP`;
      case "CE2oichange":
        return `${ce2}CE Change in LTP`;
      case "CE3oichange":
        return `${ce3}CE Change in LTP`;
      case "PE1oichange":
        return `${pe1}PE Change in LTP`;
      case "PE2oichange":
        return `${pe2}PE Change in LTP`;
      case "PE3oichange":
        return `${pe3}PE Change in LTP`;
      case "CE1oi":
        return `${ce1}CE LTP`;
      case "CE2oi":
        return `${ce2}CE LTP`;
      case "CE3oi":
        return `${ce3}CE LTP`;
      case "PE1oi":
        return `${pe1}PE LTP`;
      case "PE2oi":
        return `${pe2}PE LTP`;
      case "PE3oi":
        return `${pe3}PE LTP`;
      default:
        return "";
    }
  };

  const CustomLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex justify-center space-x-4 text-xs">
        {payload.map((entry, index) => (
          <li
            key={`legend-${index}`}
            style={{ color: entry.color }}
            className="font-xs"
          >
            {getLabel(entry.value)}
          </li>
        ))}
      </ul>
    );
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
            <Select onValueChange={setSelected}>
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

          <div className="mt-2 md:mt-0">
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

      <div className=" w-full py-5 md:justify-between justify-center items-center flex flex-col xl:flex-row space-y-2 xl:space-y-0">
        <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
          <Select onValueChange={ceStrike1}>
            <SelectTrigger className="md:w-[120px] w-[300px]">
              <SelectValue placeholder="CE Strike" />
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
          <Select onValueChange={ceStrike2}>
            <SelectTrigger className="md:w-[120px] w-[300px]">
              <SelectValue placeholder="CE Strike" />
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
          <Select onValueChange={ceStrike3}>
            <SelectTrigger className="md:w-[120px] w-[300px]">
              <SelectValue placeholder="CE Strike" />
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
        <div className="flex md:flex-row flex-col md:space-x-4  space-y-2 md:space-y-0">
          <Select onValueChange={peStrike1}>
            <SelectTrigger className="md:w-[120px] w-[300px]">
              <SelectValue placeholder="PE Strike" />
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
          <Select onValueChange={peStrike2}>
            <SelectTrigger className="md:w-[120px] w-[300px]">
              <SelectValue placeholder="PE Strike" />
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
          <Select onValueChange={peStrike3}>
            <SelectTrigger className="md:w-[120px] w-[300px]">
              <SelectValue placeholder="PE Strike" />
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
        <Button
          variant="default"
          size="icon"
          onClick={fetchOI}
          className="w-[300px] md:w-10 md:px-0 mx-5"
        >
          <ArrowRight size={18} />
        </Button>
      </div>

      <Separator />

      <div className="flex justify-center items-center flex-col space-y-6 py-5 mb-5">
        <h2 className="text-base font-bold">Change in Premium</h2>{" "}
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {dataLoaded === false ? (
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
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[MinOIchange - 50, MaxOIchange + 50]}
                />
                <Tooltip content={CustomTooltip} />
                <Legend content={CustomLegend} />
                <ReferenceLine
                  y={0}
                  stroke="gray"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
                <Line
                  type="monotone"
                  dataKey="CE1oichange"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="CE2oichange"
                  stroke="#888444"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="CE3oichange"
                  stroke="#44d888"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="PE1oichange"
                  stroke="#d88844"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="PE2oichange"
                  stroke="#44d8d8"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="PE3oichange"
                  stroke="#d8d844"
                  dot={false}
                  strokeWidth={1.5}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <h2 className="text-base font-bold">Overall Premium</h2>{" "}
        <div className="xl:h-[70vh] md:h-[50vh] h-[40vh] w-full">
          {dataLoaded === false ? (
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
                <YAxis tick={{ fontSize: 12 }} domain={[0, MaxOI + 50]} />
                <Tooltip content={CustomTooltip} />
                <Legend content={CustomLegend} />
                <Line
                  type="monotone"
                  dataKey="CE1oi"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="CE2oi"
                  stroke="#888444"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="CE3oi"
                  stroke="#44d888"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="PE1oi"
                  stroke="#d88844"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="PE2oi"
                  stroke="#44d8d8"
                  dot={false}
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="PE3oi"
                  stroke="#d8d844"
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

export default MaxPain;
