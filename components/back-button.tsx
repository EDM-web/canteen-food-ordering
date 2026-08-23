import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  return (
    <Button
      size={"sm"}
      variant={"ghost"}
      className="text-muted-foreground hover:text-orange-500 cursor-pointer"
    >
      <Link href={"/"}>
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Categories
      </Link>
    </Button>
  );
};

export default BackButton;
