// components/ui/LoadingSpinner.tsx
import { Utensils } from "lucide-react"; // lucide-react မရှိရင် သာမန် Text သို့ SVG သုံးနိုင်ပါတယ်

export default function LoadingSpinner({
  text = "Loading, please wait...",
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center space-y-4 min-h-[80vh]">
      <div className="relative flex justify-center items-center">
        {/* Outer Animated Spinner */}
        <div className="border-4 border-orange-200 border-t-orange-500 rounded-full w-16 h-16 animate-spin"></div>
        {/* Center Food Icon */}
        <div className="absolute text-orange-500 animate-pulse">
          <Utensils className="w-6 h-6" />
        </div>
      </div>
      <p className="font-medium text-gray-600 dark:text-gray-400 text-base animate-pulse">
        {text}
      </p>
    </div>
  );
}
