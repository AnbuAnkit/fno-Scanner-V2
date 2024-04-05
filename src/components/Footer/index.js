import React from "react";
import Link from "next/link";
import { IoLogoYoutube } from "react-icons/io";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const index = ({ cssprop }) => {
  const size = 20;

  return (
    <footer className="bottom-0 left-0 right-0 border-t-[1px] py-5 bg-background justify-between flex flex-row mt-10">
      <div
        className={cn(
          "justify-start px-14 text-slate-500 hidden lg:block",
          cssprop
        )}
      >
        <Link
          href="https://www.youtube.com"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "px-6 hover:text-slate-700"
          )}
        >
          <IoLogoYoutube size={size} />
        </Link>
        <Link
          href="https://www.x.com"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "px-6 hover:text-slate-700"
          )}
        >
          <FaXTwitter size={size} />
        </Link>
        <Link
          href="https://www.discord.com/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "px-6 hover:text-slate-700"
          )}
        >
          <FaDiscord size={size} />
        </Link>
      </div>
      <div className="justify-end items-center space-x-5 text-xs h-full px-14 text-slate-600 font-semibold py-3">
        <Link href="/contactus" className="hover:underline">
          Contact
        </Link>
        <Link href="/disclaimer" className="hover:underline">
          Disclaimer
        </Link>
        <Link href="/privacypolicy" className="hover:underline">
          Privacy
        </Link>
      </div>
    </footer>
  );
};

export default index;
