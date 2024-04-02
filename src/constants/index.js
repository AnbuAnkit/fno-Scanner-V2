import { Home, Sheet } from "lucide-react";
import { BsTable } from "react-icons/bs";
import { FaRegChartBar } from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { MdOutlineHistory } from "react-icons/md";
import { MdOutlineSsidChart } from "react-icons/md";
import { FaExclamation } from "react-icons/fa6";
import { MdSignalCellularAlt2Bar } from "react-icons/md";
import { BsGraphDown } from "react-icons/bs";
import { LiaChartLineSolid } from "react-icons/lia";
import Straddle from "@/components/Icon/Straddle";
import Strangle from "@/components/Icon/Strangle";
import { PiArrowsDownUpFill } from "react-icons/pi";
import PriceVsOi from "@/components/Icon/PriceVsOi";

const size = 20;

const futuresSideBar = [
  {
    href: "/dashboard/futures/long-vs-short",
    label: "Long Vs Short",
    icon: <PiArrowsDownUpFill size={22} />,
  },
  {
    href: "/dashboard/futures/price-vs-oi",
    label: "Price Vs OI",
    icon: <PriceVsOi size={20} />,
  },
];

const optionsSideBar = [
  {
    href: "/dashboard/options/option-chain",
    label: "Option-Chain",
    icon: <BsTable size={size} />,
  },
  {
    href: "/dashboard/options/greeks",
    label: "Option-Greeks",
    icon: <Sheet size={size} />,
  },
  {
    href: "/dashboard/options/oi-analysis",
    label: "OI-Analysis",
    icon: <FaRegChartBar size={size} />,
  },
  {
    href: "/dashboard/options/oi-buildup",
    label: "OI-Buildup",
    icon: <IoMdTrendingUp size={size} />,
  },
  {
    href: "/dashboard/options/oi-history",
    label: "OI-History",
    icon: <MdOutlineHistory size={22} />,
  },
  {
    href: "/dashboard/options/multi-strike-oi",
    label: "Multi Strike-OI",
    icon: <MdOutlineSsidChart size={size} />,
  },
  {
    href: "/dashboard/options/max-pain",
    label: "Max-Pain",
    icon: <FaExclamation size={size} />,
  },
  {
    href: "/dashboard/options/put-call-ratio",
    label: "Put-Call Ratio",
    icon: <Home size={size} />,
  },
  {
    href: "/dashboard/options/call-vs-put-oi",
    label: "Call vs Put",
    icon: <MdSignalCellularAlt2Bar size={size} />,
  },
  {
    href: "/dashboard/options/atm-premium",
    label: "ATM Premium",
    icon: <BsGraphDown size={size} />,
  },
  {
    href: "/dashboard/options/straddle-premium",
    label: "Straddle Premium",
    icon: <Straddle size={size} />,
  },
  {
    href: "/dashboard/options/strangle-premium",
    label: "Strangle Premium",
    icon: <Strangle size={size} />,
  },
  {
    href: "/dashboard/options/multi-strike-premium",
    label: "Multi Strike-Premium",
    icon: (
      <LiaChartLineSolid
        size={size}
        // className="transform rotate-180"
        className="transform scale-x-[-1] rotate-12"
      />
    ),
  },
];

const currencySideBar = [
  {
    href: "/dashboard/currency/option-chain",
    label: "Option-Chain",
    icon: <BsTable size={size} />,
  },
  {
    href: "/dashboard/currency/greeks",
    label: "Option-Greeks",
    icon: <Sheet size={size} />,
  },
  {
    href: "/dashboard/currency/oi-analysis",
    label: "OI-Analysis",
    icon: <FaRegChartBar size={size} />,
  },
  {
    href: "/dashboard/currency/oi-buildup",
    label: "OI-Buildup",
    icon: <IoMdTrendingUp size={size} />,
  },
  {
    href: "/dashboard/currency/oi-history",
    label: "OI-History",
    icon: <MdOutlineHistory size={22} />,
  },
  {
    href: "/dashboard/currency/multi-strike-oi",
    label: "Multi Strike-OI",
    icon: <MdOutlineSsidChart size={size} />,
  },
  {
    href: "/dashboard/currency/max-pain",
    label: "Max-Pain",
    icon: <FaExclamation size={size} />,
  },
  {
    href: "/dashboard/currency/put-call-ratio",
    label: "Put-Call Ratio",
    icon: <Home size={size} />,
  },
  {
    href: "/dashboard/currency/call-vs-put-oi",
    label: "Call vs Put",
    icon: <MdSignalCellularAlt2Bar size={size} />,
  },
  {
    href: "/dashboard/currency/atm-premium",
    label: "ATM Premium",
    icon: <BsGraphDown size={size} />,
  },
  {
    href: "/dashboard/currency/straddle-premium",
    label: "Straddle Premium",
    icon: <Straddle size={size} />,
  },
  {
    href: "/dashboard/currency/strangle-premium",
    label: "Strangle Premium",
    icon: <Strangle size={size} />,
  },
  {
    href: "/dashboard/currency/multi-strike-premium",
    label: "Multi Strike-Premium",
    icon: (
      <LiaChartLineSolid
        size={size}
        // className="transform rotate-180"
        className="transform scale-x-[-1] rotate-12"
      />
    ),
  },
];

export { futuresSideBar, optionsSideBar, currencySideBar };
