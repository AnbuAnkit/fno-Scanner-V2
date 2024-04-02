"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const SideBarLink = ({ links }) => {
  const pathname = usePathname();

  return (
    <ul className="flex w-60 flex-col justify-center space-y-1 mx-5 mt-20 ">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={cn(
              "w-full flex items-center gap-2 py-2.5 px-4 rounded-md hover:bg-accent hover:text-accent-foreground",
              pathname === link.href ? "bg-accent" : "bg-transparent",
              index === 4 ? "mb-1" : "",
              index === 7 ? "mb-1" : ""
            )}
          >
            <span className={cn("text-primary")}>{link.icon}</span>
            <span className="text-sm text-slate-600 font-medium">
              {link.label}
            </span>
          </Link>
          {index === 5 ? (
            <Separator className=" mt-2 mb-1 bg-gray-200" />
          ) : null}
          {index === 8 ? (
            <Separator className=" mt-2 mb-1 bg-gray-200" />
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default SideBarLink;
