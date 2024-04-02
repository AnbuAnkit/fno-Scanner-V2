import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { futuresSideBar, optionsSideBar, currencySideBar } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogIn } from "lucide-react";

export default function PrivateNavSheet() {
  const isSignedIn = false;

  const About = [
    { label: "About !", href: "/about" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Contact", href: "/contactus" },
    { label: "Privacy Policy", href: "/privacypolicy" },
  ];

  return (
    <div className="xl:hidden">
      <Sheet className="h-screen">
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu size={20} />
          </Button>
        </SheetTrigger>

        <SheetContent side={"left"} className="w-full md:w-[540px]">
          <ScrollArea className="h-[93vh] w-full">
            <div className="w-full my-10" />
            <Separator className="my-1 bg-slate-200" />
            <SheetClose asChild>
              <Link
                href="/"
                className="w-full hover:bg-slate-200 hover:text-primary px-5 py-3 rounded-md text-sm font-semibold flex items-center space-x-2 text-slate-600"
              >
                Home
              </Link>
            </SheetClose>
            <Separator className="my-1 bg-slate-200" />
            <SheetClose asChild>
              <Link
                href="/dashboard/strategy-builder"
                className="w-full hover:bg-slate-200 hover:text-primary px-5 py-3 rounded-md text-sm font-semibold flex items-center space-x-2 text-slate-600"
              >
                Dashboard
              </Link>
            </SheetClose>
            <Separator className="my-1 bg-slate-200" />

            <div className="space-y-2">
              <Accordion type="single" collapsible>
                <AccordionItem value="about">
                  <div className="my-1">
                    <AccordionTrigger
                      className={
                        "w-full hover:bg-slate-200 px-5 py-3 rounded-md text-sm font-semibold hover:text-primary text-slate-600"
                      }
                    >
                      About
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-5 py-2">
                        {About.map((link, index) => (
                          <SheetClose key={index} asChild>
                            <Link
                              href={link.href}
                              className="w-full hover:text-primary hover:bg-slate-200 px-5 py-3 rounded-md text-sm font-semibold flex items-center space-x-2 text-slate-600"
                            >
                              {link.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>

              {isSignedIn == false && (
                <div className="flex flex-col space-y-2">
                  <SheetClose asChild>
                    <Link
                      href="/sign-in"
                      className={
                        "w-full  hover:bg-slate-200 px-5 py-3 rounded-md border text-sm font-semibold flex flex-row items-center"
                      }
                    >
                      <LogIn size={16} />
                      <span className="pl-2">Login</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/sign-up"
                      className={
                        "w-full  bg-primary text-white px-5 py-3 rounded-md border text-sm font-semibold"
                      }
                    >
                      Sign Up
                    </Link>
                  </SheetClose>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
