"use client";
import React from 'react';
import Link from 'next/link';
import { Layers, Menu } from 'lucide-react';

const NavBar = () => {
  return (
<nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-7xl z-50 border border-[#F1F5F9]/10 bg-[#29335C]/90 backdrop-blur-md h-16 flex items-center justify-between  shadow-[4px_4px_0px_0px_#64748B] transition-all duration-300">
  <div className="flex justify-between items-center px-5  w-full ">
        
        {/* Logo Section */}
        <div className="text-2xl font-bold tracking-tight flex items-center gap-1.5 ">
          <Layers className="text-[#F3A712]" /> {/* Primary Orange Accent */}
          <Link href="/" className="flex items-center">
            <span className="text-[#F0CEA0]">Intern</span> {/* Soft Apricot */}
            <span className="text-[#F1F5F9]">Stack</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 1">
          <div className="flex items-center gap-8 text-[#F1F5F9]/80 text-xs font-medium">
            <Link href="/" className="hover:text-[#F3A712] transition-all duration-300">
              Home
            </Link>
            <Link href="/directory" className="hover:text-[#F3A712] transition-all duration-300">
              Company Directory
            </Link>
            <Link href="/wiki" className="hover:text-[#F3A712] transition-all duration-300">
              SIWES Wiki
            </Link>
            <Link href="/roadmap" className="hover:text-[#F3A712] transition-all duration-300">
              Roadmaps
            </Link>
          </div>

          {/* Auth Button */}
          <div className="pl-4 border-l border-[#F1F5F9]/20">
            <Link 
              href="/auth" 
              className="bg-[#F3A712] text-[#29335C] px-6 py-2.5 shadow-[4px_4px_0px_0px_#FFF] text-xs font-bold  hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button className="text-[#F1F5F9] p-2 hover:bg-[#F1F5F9]/10 rounded-lg transition-colors">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;