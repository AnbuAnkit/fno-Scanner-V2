import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-screen justify-center items-center">
      <Button href={"/dashboard/strategy-builder"}>Go To Dashboard</Button>
    </main>
  );
}
