"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const NavLink = () => {
  const pathname = usePathname();

  const getLinkClassOptions = (path) => {
    // Check if the current path starts with "/options"
    const isOptionsPath = pathname.startsWith("/dashboard/options");

    return isOptionsPath
      ? cn(buttonVariants({ variant: "default", size: "sm" }))
      : pathname === path
      ? cn(buttonVariants({ variant: "default", size: "sm" }))
      : cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hover:text-primary"
        );
  };

  const getLinkClassFutures = (path) => {
    // Check if the current path starts with "/futures"
    const isOptionsPath = pathname.startsWith("/dashboard/futures");

    return isOptionsPath
      ? cn(buttonVariants({ variant: "default", size: "sm" }))
      : pathname === path
      ? cn(buttonVariants({ variant: "default", size: "sm" }))
      : cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hover:text-primary"
        );
  };

  const getLinkClassCurrency = (path) => {
    // Check if the current path starts with "/currency"
    const isOptionsPath = pathname.startsWith("/dashboard/currency");

    return isOptionsPath
      ? cn(buttonVariants({ variant: "default", size: "sm" }))
      : pathname === path
      ? cn(buttonVariants({ variant: "default", size: "sm" }))
      : cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hover:text-primary"
        );
  };

  const getLinkClass = (path) => {
    return pathname === path
      ? cn(buttonVariants({ variant: "default", size: "sm" }))
      : cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hover:text-primary"
        );
  };

  return (
    <ul className="xl:flex space-x-2 text-slate-600 text-sm font-semibold items-center hidden">
      <Link href="/" className={cn(getLinkClass("/"))}>
        Home
      </Link>
      <Link
        href="/dashboard/strategy-builder"
        className={cn(getLinkClass("/dashboard/strategy-builder"))}
      >
        Strategy-Builder
      </Link>
      <Link
        href="/dashboard/options/option-chain"
        className={cn(getLinkClassOptions("/dashboard/options/option-chain"))}
      >
        Options
      </Link>
      <Link
        href="/dashboard/futures/long-vs-short"
        className={cn(getLinkClassFutures("/dashboard/futures/long-vs-short"))}
      >
        Futures
      </Link>
      <Link
        href="/dashboard/currency/option-chain"
        className={cn(getLinkClassCurrency("/dashboard/currency/option-chain"))}
      >
        Currency
      </Link>
    </ul>
  );
};

export default NavLink;
