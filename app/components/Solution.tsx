"use client";
import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, FileQuestion, ScrollText, Building2 } from 'lucide-react';

const breakVariants = (direction: 'left' | 'right' | 'up'): Variants => ({
    initial: {
        opacity: 0,
        x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
        y: direction === 'up' ? 60 : 0
    },
    whileInView: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
});

const Solution: React.FC = () => {
    return (
        <section className="bg-white text-[#29335C] py-16 px-4 md:px-10 overflow-hidden relative">

            {/* Dynamic "V" Background Mask */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <mask id="solutionMask">
                            <rect width="100" height="100" fill="white" />
                            {/* Inverted V-Shape path */}
                            <path d="M0,0 L50,40 L100,0 L100,100 L0,100 Z" fill="black" />
                        </mask>
                    </defs>
                    <rect width="100" height="100" fill="#F1F5F9" mask="url(#solutionMask)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto w-full z-10 flex flex-col items-center relative">


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    className="text-center mb-14 sm:mb-24 space-y-4 max-w-2xl"
                >

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#29335C]">
                        How InternStack Fixes the <br />
                        <span className="text-[#F3A712] relative inline-block">
                            SIWES Experience
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#F3A712]" preserveAspectRatio="none" viewBox="0 0 100 10">
                                <path d="M0,8 Q25,0 50,8 T100,8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>
                </motion.div>

                {/* CSS GRID BROKEN LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 w-full relative ">



                    {/* Problem 1: Empty CV */}
                    <motion.div
                        variants={breakVariants('left')}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.3 }}
                        className="col-span-1 md:col-span-12 bg-white 
               p-6 md:p-10 border-4 md:border-[6px] border-[#29335C] 
               shadow-[8px_8px_0px_0px_rgba(41,51,92,1)]  md:shadow-[12px_12px_0px_0px_rgba(41,51,92,1)] 
               relative overflow-hidden group
               rotate-0 md:-rotate-1 hover:rotate-0 transition-transform duration-300"
                    >
                        {/* Corner Ribbon */}
                        <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            PORTFOLIO
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                            <div className="p-3 bg-[#F3A712]/10 rounded-sm inline-flex border border-gray-200">
                                <FileQuestion className="text-[#F3A712]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-3 tracking-tighter text-[#29335C] uppercase relative inline-block">
                                    Fixing the “Empty” CV
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#29335C]" />
                                </h3>
                                <p className="text-sm text-[#29335C] font-medium leading-relaxed ">
                                    InternStack helps students transform class projects and personal experiments into portfolio-ready work that companies can understand.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Problem 2: Chaos */}
                    <motion.div
                        variants={breakVariants('right')}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.4 }}
                        className="col-span-1 md:col-span-12 bg-white 
               p-6 md:p-10 border-4 md:border-[6px] border-[#29335C] 
              shadow-[8px_8px_0px_0px_rgba(41,51,92,1)]  md:shadow-[12px_12px_0px_0px_rgba(41,51,92,1)] 
               relative overflow-hidden group 
               rotate-0 md:rotate-1 hover:rotate-0 transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            ORGANISED
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                            <div className="p-3 bg-[#F3A712]/10 rounded-sm inline-flex border border-gray-200">
                                <ScrollText className="text-[#F3A712]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-3 tracking-tighter text-[#29335C] uppercase relative inline-block">
                                    Fixing Paperwork Chaos
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#29335C]" />
                                </h3>
                                <p className="text-sm text-[#29335C] font-medium leading-relaxed ">
                                    InternStack simplifies the entire SIWES documentation process by generating accurate, ready-to-submit forms that meet ITF and university requirements. No more confusion about what to fill, where to sign, or when to submit the platform ensures students complete their paperwork correctly and on time.
                                </p>
                            </div>

                        </div>
                    </motion.div>

                    {/* Problem 3: Ghosting */}
                    <motion.div
                        variants={breakVariants('up')}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.5 }}
                        className="col-span-1  md:col-span-12 bg-white 
               p-6 md:p-10 border-4 md:border-[6px] border-[#29335C] 
              shadow-[8px_8px_0px_0px_rgba(41,51,92,1)] md:shadow-[12px_12px_0px_0px_rgba(41,51,92,1)] 
               relative overflow-hidden group 
               rotate-0 md:-rotate-1 hover:rotate-0 transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            ACCESS
                        </div>

                        <div className="flex flex-col  items-start gap-6 relative z-10 text-left">
                            <div className="p-3 bg-[#F3A712]/10 rounded-sm inline-flex border border-gray-200">
                                <Building2 className="text-[#F3A712]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-3 tracking-tighter text-[#29335C] uppercase relative inline-block">
                                    Fixing the “No Map” Problem
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#29335C]" />
                                </h3>
                                <p className="text-sm text-[#29335C] font-medium leading-relaxed ">
                                    InternStack provides a verified database of tech companies that accept SIWES students, including their application paths and requirements. Instead of guessing where to apply, students gain a clear roadmap to companies that match their skills and career interests.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto bg-[#0B1120]/90 backdrop-blur-md px-7 py-12 md:p-20 relative overflow-hidden mt-25 border-4 border-[#1E293B] shadow-[8px_8px_0px_0px_#64748B]">
                {/* Decorative Terminal Dots */}
                <div className="absolute top-4 left-6 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#DB2B39]" />
                    <div className="w-3 h-3 rounded-full bg-[#F3A712]" />
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
                            Ready to <span className="text-[#F3A712]">Deploy</span> your career?
                        </h2>
                        <p className="text-[#94A3B8] font-medium max-w-xl mx-auto text-sm ">
                            Join students already making their SIWES journey easier.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto text-sm">
                        <Link
                            href="/"
                            className="bg-[#F3A712] text-[#29335C] px-10 py-2.5  uppercase tracking-widest flex items-center justify-center gap-2 
                   border-2 border-white
                   shadow-[4px_4px_0px_0px_#FFF] 
                   hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFF] 
                   active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#FFF] 
                   transition-all duration-200"
                        >
                            JOIN THE WAITLIST <ArrowRight size={20} strokeWidth={3} />
                        </Link>

                    </div>
                </div>

                {/* Background "Code" Decal */}
                <div className="absolute -bottom-10 -right-10 text-[#1E293B] font-mono text-9xl font-black select-none opacity-20 pointer-events-none rotate-12">
                    STK
                </div>
            </div>
        </section>
    );
};

export default Solution;