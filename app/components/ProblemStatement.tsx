"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { AlertTriangle, FileQuestion, ScrollText, Building2, Ghost } from 'lucide-react';

// Explicitly typing the animation variants for TSX
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

const ProblemStatement: React.FC = () => {
    return (
        <section className="bg-white text-[#29335C] py-16 px-5 lg:px-10 overflow-hidden relative border-t border-[#F1F5F9]/20">


            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <mask id="diagonalMask">
                            <rect width="100%" height="100%" fill="white" />
                            <path d="M0,0 L100,0 L100,55 L0,100 Z" fill="black" />
                        </mask>
                    </defs>
                    <rect width="100%" height="100%" fill="#F0CEA0" mask="url(#diagonalMask)" />
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
                        Why does SIWES <br />
                        feel like a <span className="text-[#DB2B39] relative inline-block">
                            trap?
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#DB2B39]" preserveAspectRatio="none" viewBox="0 0 100 10">
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
                     className="col-span-1 md:col-span-6 bg-white 
               p-6 md:p-10 border-4 md:border-[6px] border-[#29335C] 
               shadow-[8px_8px_0px_0px_rgba(41,51,92,1)]  md:shadow-[12px_12px_0px_0px_rgba(41,51,92,1)] 
               relative overflow-hidden group
               rotate-0 md:-rotate-2 hover:rotate-0 transition-transform duration-300"
                    > 
                        {/* Corner Ribbon */}
                        <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            Level 0
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                            <div className="p-3 bg-[#DB2B39]/10 rounded-sm inline-flex border border-gray-200">
                                <FileQuestion className="text-[#DB2B39]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-3 tracking-tighter text-[#29335C] uppercase relative inline-block">
                                    The "Empty" CV
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#DB2B39]" />
                                </h3>
                                <p className="text-sm text-[#29335C] font-medium leading-relaxed max-w-xl">
                                    Feeling like you have nothing to show companies because you&apos;re &quot;just&quot; a student. You have skills, but how do you compete against people who have already &quot;deployed&quot; something?
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
                     className="col-span-1 md:col-span-6 bg-white 
               p-6 md:p-10 border-4 md:border-[6px] border-[#29335C] 
              shadow-[8px_8px_0px_0px_rgba(41,51,92,1)]  md:shadow-[12px_12px_0px_0px_rgba(41,51,92,1)] 
               relative overflow-hidden group 
               rotate-0 md:rotate-3 hover:rotate-0 transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            Chaos
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                            <div className="p-3 bg-[#DB2B39]/10 rounded-sm inline-flex border border-gray-200">
                                <ScrollText className="text-[#DB2B39]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-3 tracking-tighter text-[#29335C] uppercase relative inline-block">
                                    Paperwork Chaos
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#DB2B39]" />
                                </h3>
                                <p className="text-sm text-[#29335C] font-medium leading-relaxed max-w-sm">
                                    Confusion over endless forms, ITF requirements, and deadlines. One mistake can delay your entire placement and affect your SIWES.
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
               rotate-0 md:rotate-1 hover:rotate-0 transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            No Map !
                        </div>

                        <div className="flex flex-col  items-start gap-6 relative z-10 text-left">
                            <div className="p-3 bg-[#DB2B39]/10 rounded-sm inline-flex border border-gray-200">
                                <Building2 className="text-[#DB2B39]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-3 tracking-tighter text-[#29335C] uppercase relative inline-block">
                                    STUCK OR CONFUSED !
                                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#DB2B39]" />
                                </h3>
                                <p className="text-sm text-[#29335C] font-medium leading-relaxed max-w-xl">
                                    You don&apos;t know which companies to apply to, what they actually require,
                                    or how to even reach their HODs. It feels like navigating without a map.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ProblemStatement;