import React from "react";
import Link from "next/link";
import IconDashboard from "./icons/dashboard";
import IconPieChart from "./icons/pieChart";

export function DesktopNav({ activeItem }: { activeItem: String }) {
  const navbarItems = [
    { 
      name: "Home", 
      href: "/panel",
      icon: IconPieChart,
    },
    { 
      name: "Clusters",
      href: "/clusters",
      icon: IconDashboard,
    },
    { 
      name: "Nodes",
      href: "/nodes",
      icon: IconDashboard,
    },
    { 
      name: "Configs",
      href: "/panel/configs",
      icon: IconDashboard,
    },
  ];
  return (
    <div className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <div className="flex h-16 w-full items-center justify-center bg-stone-600 font-bold text-white">
          Platform
        </div>
        <div className="flex flex-grow flex-col">
          {navbarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              passHref
              className={`block cursor-pointer p-3 transition-colors duration-200 hover:bg-stone-300 ${activeItem === item.name ? "bg-stone-300 text-white" : ""}`}
            >
            <span className="flex item-center text-stone-800 font-bold">
              <item.icon/><p className="pl-2">{item.name}</p>
            </span>
            </Link>
          ))}
        </div>
        <button className="w-full bg-stone-600 py-3 font-bold text-white transition-colors duration-200 hover:bg-stone-700">
          Logout
        </button>
      </div>
    </div>
  );
}
