import Link from "next/link";
import { Button } from "./ui/button";
import { NavigationMenuItem } from "./ui/navigation-menu";
import { signInPath, signUpPath } from "@/lib/path";

export const SignUpAndSignInButtons = () => {
  return (
    <>
      <NavigationMenuItem>
        <Button variant={"ghost"} className="cursor-pointer" asChild>
          <Link href={signInPath}>Signin</Link>
        </Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button
          variant={"default"}
          className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
          asChild
        >
          <Link href={signUpPath}>Register</Link>
        </Button>
      </NavigationMenuItem>
    </>
  );
};
