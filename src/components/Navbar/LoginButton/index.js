import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";

const index = () => {
  return (
    <Link
      href="/login"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      <LogIn size={16} />
      <span className="pl-2">Login</span>
    </Link>
  );
};

export default index;
