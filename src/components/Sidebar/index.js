import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import SideBarLink from "./SideBarLink";

const SideBar = ({ links }) => {
  return (
    <aside className="hidden xl:block bg-background fixed w-72 left-0 top-0 h-screen justify-center item-center border-r-[1px] ">
      <ScrollArea className="h-[85vh]">
        <SideBarLink links={links} />
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 border-t-[1px] p-5 ">
        <Button variant="outline" className="w-full">
          Log Out
        </Button>
      </div>
    </aside>
  );
};

export default SideBar;
