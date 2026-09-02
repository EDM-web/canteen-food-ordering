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
import {
  homePath,
  menuPath,
  orderPath,
  signInPath,
  signUpPath,
} from "@/lib/path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CartIcon } from "./cart-icon";
import { ProfileDropdown } from "@/features/profile/components/profile-dropdown";
import { Menu, Home, Utensils, LogOut, ShoppingBag } from "lucide-react";
import { signOut } from "@/features/auth/actions/sign-out";
import MoblieProfile from "./mobile-profile";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const navItems = [
    { title: "Home", url: homePath, icon: Home },
    { title: "Menu", url: menuPath, icon: Utensils },
  ];

  const moblieNavItems = [
    { title: "Home", url: homePath, icon: Home },
    { title: "Menu", url: menuPath, icon: Utensils },
  ];

  return (
    <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center mx-auto md:p-0 px-3 h-16 container">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl lg:text-3xl"
        >
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
                    className="px-3 py-2 rounded-md font-medium text-slate-700 hover:text-orange-500 text-sm transition-colors"
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
              <ProfileDropdown isMoblie={false} user={session.user} />
            ) : (
              <SignUpAndSignInButtons />
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden flex items-center gap-2">
          {/* Moblie register button  */}
          {!session && (
            <Button
              size={"lg"}
              variant={"default"}
              className="bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 px-4 ring-0 cursor-pointer"
              asChild
            >
              <Link href={signUpPath}>Register</Link>
            </Button>
          )}

          {session && <CartIcon />}

          {session?.user && <ProfileDropdown user={session.user} />}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="w-9 h-9">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="flex flex-col justify-between p-2"
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
                  {moblieNavItems.map((nav) => {
                    const Icon = nav.icon;
                    return (
                      <Link
                        key={nav.title}
                        href={nav.url}
                        className="flex items-center gap-3 hover:bg-orange-500/10 px-3 py-2.5 rounded-lg font-medium text-slate-700 hover:text-orange-500 text-sm transition-all"
                      >
                        <Icon className="w-5 h-5 text-slate-700" />
                        {nav.title}
                      </Link>
                    );
                  })}
                  {session?.user && (
                    <Link
                      href={orderPath}
                      className="flex items-center gap-3 hover:bg-orange-500/10 px-3 py-2.5 rounded-lg font-medium text-slate-700 hover:text-orange-500 text-sm transition-all"
                    >
                      <ShoppingBag className="w-5 h-5 text-slate-700" />
                      My Orders
                    </Link>
                  )}
                  {session?.user && <MoblieProfile user={session?.user} />}
                </nav>
              </div>

              {/* Bottom Profile / Auth Section */}
              <div className="pt-4 border-t">
                {session?.user ? (
                  <SignOutButton />
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
      <div className="flex flex-row gap-2">
        <Button
          variant={"secondary"}
          className="flex-1 ring-0 w-fit cursor-pointer"
          asChild
        >
          <Link href={signInPath}>Signin</Link>
        </Button>
        <Button
          variant={"default"}
          className="flex-1 bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 ring-0 w-fit cursor-pointer"
          asChild
        >
          <Link href={signUpPath}>Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size={"lg"}
        variant={"secondary"}
        className="cursor-pointer"
        asChild
      >
        <Link href={signInPath}>Signin</Link>
      </Button>
      <Button
        size={"lg"}
        variant={"default"}
        className="bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/25 px-4 ring-0 cursor-pointer"
        asChild
      >
        <Link href={signUpPath}>Register</Link>
      </Button>
    </div>
  );
};

const SignOutButton = () => {
  return (
    <form action={signOut} className="w-full">
      <button
        type="submit"
        className="flex items-center hover:bg-rose-500/10 px-3 py-2.5 rounded-lg w-full text-rose-600 text-sm cursor-pointer"
      >
        <LogOut className="mr-2 w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </form>
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
