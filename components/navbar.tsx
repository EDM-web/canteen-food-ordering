import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { homePath, menuPath, signInPath, signUpPath } from "@/lib/path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CartIcon } from "./cart-icon";
import { ProfileDropdown } from "@/features/profile/components/profile-dropdown";
import { Menu, Home, Utensils, LogIn, UserPlus } from "lucide-react";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const navItems = [
    { title: "Home", url: homePath, icon: Home },
    { title: "Menu", url: menuPath, icon: Utensils },
  ];

  return (
    <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center mx-auto md:p-0 px-3 h-16 container">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-orange-500">Canteen</span>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-2">
              {navItems.map((nav) => (
                <NavigationMenuItem key={nav.title}>
                  <Link
                    href={nav.url}
                    className="px-3 py-2 rounded-md font-medium text-muted-foreground hover:text-orange-500 text-sm transition-colors"
                  >
                    {nav.title}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            {session && <CartIcon />}
            {session?.user ? (
              <ProfileDropdown user={session.user} />
            ) : (
              <SignUpAndSignInButtons />
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden flex items-center gap-3">
          {/* Moblie register button  */}
          {!session && (
            <Button
              size={"sm"}
              variant={"default"}
              className="bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 cursor-pointer"
              asChild
            >
              <Link href={signUpPath}>Register</Link>
            </Button>
          )}

          {session && <CartIcon />}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 h-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex flex-col justify-between p-6 w-[280px] sm:w-[320px]"
            >
              <div className="flex flex-col gap-6">
                {/* Header Section */}
                <SheetHeader className="pb-4 border-b text-left">
                  <SheetTitle className="font-bold text-orange-500 text-lg">
                    CU Canteen
                  </SheetTitle>
                </SheetHeader>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1">
                  {navItems.map((nav) => {
                    const Icon = nav.icon;
                    return (
                      <Link
                        key={nav.title}
                        href={nav.url}
                        className="flex items-center gap-3 hover:bg-orange-500/10 px-3 py-2.5 rounded-lg font-medium text-foreground hover:text-orange-500 text-sm transition-all"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {nav.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Profile / Auth Section */}
              <div className="pt-4 border-t">
                {session?.user ? (
                  <div className="flex justify-between items-center bg-muted/50 p-2 rounded-lg">
                    <ProfileDropdown user={session.user} />
                  </div>
                ) : (
                  <SignUpAndSignInButtons isMobile />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

export const SignUpAndSignInButtons = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => {
  if (isMobile) {
    return (
      <div className="flex flex-row gap-2 w-full">
        <Button
          variant={"secondary"}
          className="w-[50%] cursor-pointer"
          asChild
        >
          <Link href={signInPath}>Signin</Link>
        </Button>
        <Button
          variant={"default"}
          className="bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 w-[50%] cursor-pointer"
          asChild
        >
          <Link href={signUpPath}>Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button size={"lg"} variant={"ghost"} className="cursor-pointer" asChild>
        <Link href={signInPath}>Signin</Link>
      </Button>
      <Button
        size={"lg"}
        variant={"default"}
        className="bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 px-4 cursor-pointer"
        asChild
      >
        <Link href={signUpPath}>Register</Link>
      </Button>
    </div>
  );
};

// export const SignUpAndSignInButtons = () => {
//   return (
//     <div className="flex items-center gap-2">
//       <Button variant={"ghost"} className="cursor-pointer" asChild>
//         <Link href={signInPath}>Signin</Link>
//       </Button>
//       <Button
//         size={"lg"}
//         variant={"default"}
//         className="bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 px-4 cursor-pointer"
//         asChild
//       >
//         <Link href={signUpPath}>Register</Link>
//       </Button>
//     </div>
//   );
// };
