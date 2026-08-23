import { signOut } from "@/features/auth/actions/sign-out";
import { Button } from "./ui/button";

export const SignOutbutton = () => {
  return (
    <form action={signOut}>
      <Button variant={"destructive"} className="cursor-pointer">
        Signout
      </Button>
    </form>
  );
};
