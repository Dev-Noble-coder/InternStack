"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll locking logic
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
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
              <Link href="/how-it-works" className="hover:text-[#F3A712] transition-all duration-300">
                How It Works
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
                className="bg-[#F3A712] text-[#29335C] px-6 py-2.5 shadow-[4px_4px_0px_0px_#FFF] text-xs font-bold hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFF] active:translate-y-0 active:shadow-none transition-all duration-200 block"
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
      </nav>

      {/* Mobile Sidebar Overlay - Moved outside of the <nav> element for proper backdrop behavior */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#29335C]/60 backdrop-blur-md"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 right-0 h-full w-72 bg-[#29335C] border-l border-[#F1F5F9]/10 shadow-2xl px-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10 pt-8">
                <div className="text-2xl font-bold tracking-tight flex items-center gap-1.5">
                  <Layers className="text-[#F3A712]" size={24} />
                  <div className='flex items-center'>
                    <span className="text-[#F0CEA0]">Intern</span>
                    <span className="text-[#F1F5F9]">Stack</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#F1F5F9] p-2 hover:bg-[#F1F5F9]/10 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-8 text-[#F1F5F9]/80 text-base font-medium">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#F3A712] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#F3A712] transition-colors"
                >
                  How It Works
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

              <div className="mt-auto pb-10">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-[#F3A712] text-[#29335C] px-6 py-4 shadow-[4px_4px_0px_0px_#FFF] text-sm font-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFF] active:translate-y-0 active:shadow-none transition-all duration-200"
                >
                  JOIN THE WAITLIST
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;