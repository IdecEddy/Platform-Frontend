import React from "react";
import Link from "next/link";

export function DesktopNav({ activeItem }: { activeItem: String }) {
  const navbarItems = [
    { name: "Home", href: "/panel" },
    { name: "Clusters", href: "/clusters" },
    { name: "Nodes", href: "/nodes" },
    { name: "Configs", href: "/panel/configs" },
  ];
  return (
    <div className="flex h-screen w-64 flex-col bg-stone-400">
      <div className="flex h-16 w-full items-center justify-center bg-stone-600 font-bold text-white">
        Platform
      </div>
      <div className="flex flex-grow flex-col">
        {navbarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            passHref
            className={`block cursor-pointer p-3 transition-colors duration-200 hover:bg-stone-300 ${activeItem === item.name ? "bg-stone-500 text-white" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <button className="w-full bg-stone-600 py-3 font-bold text-white transition-colors duration-200 hover:bg-stone-700">
        Logout
      </button>
    </div>
  );
}
