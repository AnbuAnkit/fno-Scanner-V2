import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-[90vh] justify-center items-center flex-col space-y-4">
      <div className="text-3xl font-bold">
        For Now Just <span className="text-primary">Go to Dashboard</span>, to
        Use it.
      </div>

      <Link
        href="/dashboard/strategy-builder"
        className={cn(buttonVariants({ variant: "default", size: "lg" }))}
      >
        Go To Dashboard
      </Link>
    </main>
  );
}
