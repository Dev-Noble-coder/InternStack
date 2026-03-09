"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <button onClick={() => toast.success('Coming soon!')} className="hover:text-[#F3A712] transition-all duration-300">
              Company Directory
            </button>
            <button onClick={() => toast.success('Coming soon!')} className="hover:text-[#F3A712] transition-all duration-300">
              SIWES Wiki
            </button>
            <button onClick={() => toast.success('Coming soon!')} className="hover:text-[#F3A712] transition-all duration-300">
              Roadmaps
            </button>
          </div>

          {/* Auth Button */}
          <div className="pl-4 border-l border-[#F1F5F9]/20">
            <Link href='/'
              
              className="bg-[#F3A712] text-[#29335C] px-6 py-2.5 shadow-[4px_4px_0px_0px_#FFF] text-xs font-bold  hover:scale-105 transition-all duration-300"
            >
              Join the WaitList
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-[#F1F5F9] p-2 hover:bg-[#F1F5F9]/10 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#29335C]/60 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 -right-5 h-screen w-64 bg-[#29335C] border-l border-[#F1F5F9]/10 shadow-2xl z-50 px-4 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8 pt-3">
                <div className="text-xl font-bold tracking-tight flex items-center gap-1.5">
                  <Layers className="text-[#F3A712]" size={20} />
                  <div className='flex items-center'>
<span className="text-[#F0CEA0]">Intern</span>
                  <span className="text-[#F1F5F9]">Stack</span>
                  </div>
                  
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#F1F5F9] p-2 hover:bg-[#F1F5F9]/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-[#F1F5F9]/80 text-sm font-medium">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#F3A712] transition-colors"
                >
                  Home
                </Link>
                <button 
                  onClick={() => {
                    toast.success('Coming soon!');
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-left hover:text-[#F3A712] transition-colors"
                >
                  Company Directory
                </button>
                <button 
                  onClick={() => {
                    toast.success('Coming soon!');
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-left hover:text-[#F3A712] transition-colors"
                >
                  SIWES Wiki
                </button>
                <button 
                  onClick={() => {
                    toast.success('Coming soon!');
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-left hover:text-[#F3A712] transition-colors"
                >
                  Roadmaps
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-[#F1F5F9]/10">
                <Link 
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-[#F3A712] text-[#29335C] px-6 py-3 shadow-[4px_4px_0px_0px_#FFF] text-xs font-bold hover:scale-105 transition-transform"
                >
                  Join the WaitList
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;