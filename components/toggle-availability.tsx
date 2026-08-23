"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useTransition } from "react";
import { updateMenuAvailability } from "@/features/admin/menu/actions/update-menu-availability";

interface Props {
  id: string;
  isAvailable: boolean;
}

export function ToggleAvailability({ id, isAvailable }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (value: string) => {
    const nextState = value === "true";
    startTransition(async () => {
      const res = await updateMenuAvailability(id, nextState);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Select
      defaultValue={isAvailable ? "true" : "false"}
      onValueChange={handleValueChange}
      disabled={isPending}
    >
      <SelectTrigger className="bg-slate-100 hover:bg-slate-200 shadow-none border-none focus:ring-0 w-[120px] h-8 font-medium text-xs">
        <div className="flex items-center gap-1.5">
          {/* <span
            className={`h-2 w-2 rounded-full ${
              isAvailable ? "bg-emerald-500" : "bg-red-500"
            }`}
          /> */}
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="p-1">
        <SelectItem value="true" className="text-xs">
          <div className="flex items-center gap-2 font-medium text-emerald-600">
            <span className="bg-emerald-500 rounded-full w-2 h-2" />
            Available
          </div>
        </SelectItem>
        <SelectItem value="false" className="text-xs">
          <div className="flex items-center gap-2 font-medium text-red-500">
            <span className="bg-red-500 rounded-full w-2 h-2" />
            Unavailable
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
