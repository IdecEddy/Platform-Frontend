import React from 'react';
import Link from 'next/link';


export function DesktopNav({ activeItem } : { activeItem: String }) {
  const navbarItems = [
    { name: 'Home', href: '/panel' }, 
    { name: 'Clusters', href: '/clusters' },
    { name: 'Nodes', href: '/nodes' },
    { name: 'Configs', href: '/panel/configs' },
  ];
  return (
    <div className="w-64 h-screen bg-stone-400 flex flex-col">
      <div className="bg-stone-600 w-full h-16 flex justify-center items-center font-bold text-white">
        Platform
      </div>
      <div className="flex flex-col flex-grow">
        {navbarItems.map((item) => (
          <Link key={item.name} href={item.href} passHref className={`block p-3 hover:bg-stone-300 transition-colors duration-200 cursor-pointer ${activeItem === item.name ? 'bg-stone-500 text-white' : ''}`}>
              {item.name}
          </Link>
        ))}
      </div>
      <button
        className="w-full py-3 bg-stone-600 text-white font-bold hover:bg-stone-700 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
}
