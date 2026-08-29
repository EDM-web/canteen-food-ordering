"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { orderPath } from "@/lib/path";
import { signOut } from "@/features/auth/actions/sign-out";
import { ProfileDialog } from "./profile-dialog";
import { User, ShoppingBag, LogOut, ChevronDown } from "lucide-react";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  isMoblietype?: boolean;
}

export function ProfileDropdown({ user, isMoblietype = true }: UserNavProps) {
  const [openProfile, setOpenProfile] = useState(false);

  const userInitials = user.name
    ? user.name.slice(0, 2).toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-slate-100 px-2.5 py-1.5 rounded-full h-auto cursor-pointer"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="bg-orange-500 font-semibold text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[120px] font-medium text-slate-700 text-sm truncate">
              {user.name}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="space-y-1 shadow-sm p-2 border ring-0 w-48"
        >
          <DropdownMenuItem
            onClick={() => setOpenProfile(true)}
            className="cursor-pointer"
          >
            <User className="mr-2 w-4 h-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={orderPath} className="flex items-center w-full">
              <ShoppingBag className="mr-2 w-4 h-4" />
              <span>My Orders</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="p-0">
            <form action={signOut} className="w-full">
              <button
                type="submit"
                className="flex items-center px-2 py-1.5 w-full text-rose-600 hover:text-rose-700 text-sm cursor-pointer"
              >
                <LogOut className="mr-2 w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        user={user}
        open={openProfile}
        onOpenChange={setOpenProfile}
      />
    </>
  );
}

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { orderPath } from "@/lib/path";
// import { signOut } from "@/features/auth/actions/sign-out";
// import { ProfileDialog } from "./profile-dialog";
// import { User, ShoppingBag, LogOut } from "lucide-react";

// interface UserNavProps {
//   user: {
//     name?: string | null;
//     email?: string | null;
//     image?: string | null;
//   };
// }

// export function ProfileDropdown({ user }: UserNavProps) {
//   const [openProfile, setOpenProfile] = useState(false);

//   const userInitials = user.name
//     ? user.name.slice(0, 2).toUpperCase()
//     : user.email?.slice(0, 2).toUpperCase() || "U";

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1.5 rounded-full h-auto cursor-pointer"
//           >
//             <Avatar className="w-8 h-8">
//               <AvatarImage src={user.image || ""} alt={user.name || "User"} />
//               <AvatarFallback className="bg-orange-500 font-semibold text-white text-xs">
//                 {userInitials}
//               </AvatarFallback>
//             </Avatar>
//             <span className="max-w-[120px] font-medium text-slate-700 text-sm truncate">
//               {user.name || "User"}
//             </span>
//           </Button>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent align="end" className="w-56">
//           <DropdownMenuLabel className="font-normal">
//             <div className="flex flex-col space-y-1">
//               <p className="font-medium text-sm leading-none">{user.name}</p>
//               <p className="text-muted-foreground text-xs truncate leading-none">
//                 {user.email}
//               </p>
//             </div>
//           </DropdownMenuLabel>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem
//             onClick={() => setOpenProfile(true)}
//             className="cursor-pointer"
//           >
//             <User className="mr-2 w-4 h-4" />
//             <span>Profile Settings</span>
//           </DropdownMenuItem>

//           <DropdownMenuItem asChild className="cursor-pointer">
//             <Link href={orderPath} className="flex items-center w-full">
//               <ShoppingBag className="mr-2 w-4 h-4" />
//               <span>My Orders</span>
//             </Link>
//           </DropdownMenuItem>

//           <DropdownMenuSeparator />

//           <DropdownMenuItem asChild className="p-0">
//             <form action={signOut} className="w-full">
//               <button
//                 type="submit"
//                 className="flex items-center px-2 py-1.5 w-full text-rose-600 hover:text-rose-700 text-sm cursor-pointer"
//               >
//                 <LogOut className="mr-2 w-4 h-4" />
//                 <span>Sign Out</span>
//               </button>
//             </form>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       <ProfileDialog
//         user={user}
//         open={openProfile}
//         onOpenChange={setOpenProfile}
//       />
//     </>
//   );
// }
