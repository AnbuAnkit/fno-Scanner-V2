import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "404",
};

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center space-y-4">
      <div className="space-y-2 text-center">
        <FileIcon className="mx-auto h-20 w-20" />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Uh oh! This page doesn&apos;t exist.
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          You&apos;ve hit a route that doesn&apos;t exist. The good news is, you
          can always go back to the homepage.
        </p>
      </div>
      <Link
        className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        href="/"
      >
        Go to the homepage
      </Link>
    </div>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
