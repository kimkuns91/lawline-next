'use client';

import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';

import SideBar from '@/components/SideBar';
import { cn } from '@/utils/style';
import { useState } from 'react';
import { TbMinusVertical } from 'react-icons/tb';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={cn('absolute top-0 left-0', 'h-screen w-full', 'flex')}>
      <SideBar isSidebarVisible={isSidebarVisible} />
      <div
        className={cn(
          'flex-1 relative',
          'bg-[#f7fcf8]',
          'transition-all duration-300 ease-in-out',
          isSidebarVisible ? 'ml-64' : 'ml-0',
          'border-l border-slate-300'
        )}
      >
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center group text-slate-400"
          onClick={toggleSidebar}
        >
          <TbMinusVertical className="text-2xl" />
          {isSidebarVisible ? (
            <IoArrowBackOutline className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          ) : (
            <IoArrowForwardOutline className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>
        {children}
      </div>
    </div>
  );
}
