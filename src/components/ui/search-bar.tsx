import { Search } from "lucide-react";
import { Input } from "./input";

export function SearchBar({ placeholder = "ابحث عن دورة..." }: { placeholder?: string }) {
  return (
    <form action="/courses" method="get" className="relative w-full max-w-md">
      <Input name="search" type="search" placeholder={placeholder} className="pe-12" />
      <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 text-brand" aria-label="بحث">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
