"use client";
import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Layers, Rocket, ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  const floatVariants = (duration: number = 3, delay: number = 0): Variants => ({
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      },
    },
  });

  return (
    <section className="bg-[#29335C] text-[#F1F5F9] min-h-screen flex flex-col items-center pt-32 pb-20 px-5 lg:px-10 overflow-hidden relative" style={{ overflowAnchor: 'none' }}>

      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#F3A712 1px, transparent 1px), linear-gradient(90deg, #F3A712 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />


      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10 ">

        {/* Badge */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3A712]/10 border border-[#F3A712]/20 text-[#F3A712] text-xs font-semibold uppercase tracking-wider mb-2"
        >
          <Rocket size={14} />
          <span>Launch your career in 2026</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-3"
        >
          Build your career, <br />
          <span className="text-[#F3A712]">layer by layer.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-[#F1F5F9]/80 max-w-2xl leading-relaxed mb-5"
        >
          The ultimate SIWES engine for students. Generate professional CVs,
          master your logbook, and access SIWES opportunities from top Nigerian companies.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row-reverse gap-4 w-full sm:w-auto text-sm"
        >
          <Link
            href="https://forms.gle/PzStD7NhaBzTJwgv5"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F3A712] text-[#29335C] px-10 py-2.5 font-bold flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFF] active:translate-y-0 active:shadow-none transition-all duration-200"
          >
            Join the Waitlist <ArrowRight size={18} />
          </Link>
          <Link
            href="/how-it-works"
            className="border-2 border-[#F3A712] text-[#F3A712] px-10 py-2.5 font-bold flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(243,167,18,0.3)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(243,167,18,0.4)] active:translate-y-0 active:shadow-none transition-all duration-200"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Visual Browser Mockup (Center Stack) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative w-full mt-16 group"
        >
          {/* Browser Top Bar */}
          <div className="w-full bg-[#F0CEA0] h-10 rounded-t-lg flex items-center px-4 gap-1.5 border-b border-[#534D41]/10">
            <div className="w-3 h-3 rounded-full bg-[#DB2B39]" />
            <div className="w-3 h-3 rounded-full bg-[#F3A712]" />
            <div className="w-3 h-3 rounded-full bg-[#29335C]/20" />
          </div>

          {/* Browser Content / Video Placeholder */}
          <div className="w-full aspect-video bg-[#F0CEA0] rounded-b-2xl shadow-2xl flex items-center justify-center relative overflow-hidden border-x border-b border-[#534D41]/10">
            {/* Play Button Overlay */}
            <div className="w-20 h-20 rounded-full bg-[#29335C]/90 backdrop-blur-md flex items-center justify-center text-[#F3A712] shadow-xl group-hover:scale-110 transition-transform duration-300 cursor-pointer z-20">
              <Play size={32} fill="currentColor" />
            </div>

            {/* Decorative Background for Mockup */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-dashed border-[#534D41]/30 rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;