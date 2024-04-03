import { Card, CardTitle } from "@/components/ui/card";

const SelectDateCard = () => {
  return (
    <div className="px-10 h-full w-full">
      <Card className="px-10 h-full w-full shadow-none">
        <CardTitle className=" flex justify-center items-center h-full w-full space-x-2 text-base md:text-2xl">
          <span>Select Index and </span>
          <span className="text-primary"> Exp. Date </span>
        </CardTitle>
      </Card>
    </div>
  );
};

export { SelectDateCard };
