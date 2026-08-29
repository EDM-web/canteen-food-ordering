"use client";

import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { User } from "lucide-react";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const MoblieProfile = ({ user }: UserNavProps) => {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenProfile(true)}
        className="flex items-center gap-3 hover:bg-orange-500/10 px-3 py-2.5 rounded-lg font-medium text-slate-700 hover:text-orange-500 text-sm transition-all cursor-pointer"
      >
        <User className="w-5 h-5 text-slate-700" />
        Profile
      </button>
      <ProfileDialog
        user={user}
        open={openProfile}
        onOpenChange={setOpenProfile}
      />
    </>
  );
};

export default MoblieProfile;
