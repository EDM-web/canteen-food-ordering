"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 100);

  return (
    <div className="relative flex items-center w-full max-w-xl">
      <Search className="top-1/2 left-3 absolute w-4 h-4 text-slate-400 -translate-y-1/2" />
      <Input
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("search")?.toString()}
        className="bg-slate-50 pl-9.5 border-slate-200/80 focus:border-orange-500 rounded-full h-10 transition-all"
      />
    </div>
  );
}
