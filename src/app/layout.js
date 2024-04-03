import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import GoToTop from "@/components/GoToTop";
import Providers from "@/redux/provider";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL("https://fnoscanner.com"),
  title: {
    default:
      "Fno Scanner - Most Advanced Option Analysing tool and Paper Trading",
    template: "%s | Fno Scanner",
  },
  description:
    "Fno Scanner revolutionizes option chain analysis in the Indian stock market. Discover real-time data insights and unleash the power of options trading with our comprehensive tool. Seamlessly develop winning strategies with our strategy builder and test them risk-free with our paper trading feature. Stay ahead with advanced analytics and join a community of savvy traders",

  twitter: {
    title: {
      default:
        "Fno Scanner - Most Advanced Option Analysing tool and Paper-Trading",
      template: " %s | Fno Scanner ",
    },
    card: "summary_large_image",
  },
  applicationName: "Fno Scanner",
  keywords: [
    "options paper trading",
    "paper trading",
    "option strategies",
    "nse option strategy builder",
    "option chain",
    "option chain nse",
    "fnoScanner",
    "strategy",
    "stratrgy builder",
    "options",
    "optionchain",
    "bse",
    "options strategy builder",
    "options strategy builder fnoscanner",
    "sensibull",
    "opstra",
    "sensibull alternative strategy builder",
    "opstra alternative strategy builder",
    "gocharting",
    "stock market",
    "nse india",
    "bse india",
    "nifty",
    "banknifty",
    "finnifty",
    "midcpnifty",
    "option strategy builder free",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          {children}
          <GoToTop />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
