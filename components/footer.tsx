import Link from "next/link";
import { homePath, menuPath } from "@/lib/path";
import { Utensils, Clock, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 border-t text-slate-600 dark:text-slate-400 transition-colors">
      <div className="mx-auto px-4 sm:px-6 py-8 container">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-orange-600 dark:text-orange-500 text-xl">
              <Utensils className="w-6 h-6" />
              <span>CU Canteen</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              Fast, easy, and convenient food ordering system for university
              students and staff.
            </p>
          </div>

          <div className="grid grid-cols-2">
            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link
                    href={homePath}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href={menuPath}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Food Menu
                  </Link>
                </li>
              </ul>
            </div>

            {/* Service Hours & Location */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">
                Canteen Info
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {/* <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <div>
                  <span>Monday - Friday</span>
                  <p>8:00 AM - 4:00 PM</p>
                </div>
              </li> */}
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>CU Myeik</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>+95 9764632605</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-slate-200 dark:border-slate-800 border-t text-xs text-center">
          <p>
            © {new Date().getFullYear()} CU Canteen Food Ordering. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
