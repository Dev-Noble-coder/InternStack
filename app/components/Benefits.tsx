"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { GraduationCap, Briefcase, BookOpen, Scale, Building2 } from 'lucide-react';

const cardVariants = (delay: number): Variants => ({
    initial: { opacity: 0, y: 30 },
    whileInView: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay, ease: "easeOut" }
    },
});

const Benefits: React.FC = () => {
    return (
        <section className="bg-[#29335C] text-[#F1F5F9] py-20 px-4 md:px-10 overflow-hidden relative">
            
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#F3A712 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

            <div className="max-w-7xl mx-auto w-full z-10 flex flex-col items-center relative">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    className="text-center mb-16 space-y-4 max-w-3xl"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight uppercase text-white">
                        Why Choose <br />
                        <span className="text-[#F3A712] relative inline-block">
                            Intern<span className='text-white'>Stack</span> ?
                            <svg className="absolute -bottom-2 right-0 w-full h-3 text-[#F3A712]" preserveAspectRatio="none" viewBox="0 0 100 10">
                                <path d="M100,8 Q75,0 50,8 T0,8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-[#F1F5F9]/80 font-medium text-sm md:text-base leading-relaxed mt-6">
                        Bridging the gap between academic theory and industry practice, benefiting both students searching for real experience and companies looking for fresh talent.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                    
                    {/* Student Benefits Card */}
                    <motion.div 
                        variants={cardVariants(0.1)}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-white text-[#29335C] p-8 md:p-12 border-4 md:border-[6px] border-[#F0CEA0] shadow-[8px_8px_0px_0px_#F0CEA0] md:shadow-[12px_12px_0px_0px_#F0CEA0] relative overflow-hidden group rotate-0 md:-rotate-1 hover:rotate-0 transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 bg-[#F0CEA0] text-[#29335C] px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            STUDENTS
                        </div>

                        <div className="p-3 bg-[#F3A712]/10 rounded-sm inline-flex border border-gray-200 mb-6">
                            <GraduationCap className="text-[#F3A712]"  size={20} />
                        </div>
                        
                        <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase">What Students Benefit</h3>
                        
                        <ul className="list-disc list-outside pl-6 space-y-4 text-sm font-semibold leading-relaxed">
                            <li>
                                Turn academic knowledge into practical, hireable skills with verified companies.
                            </li>
                            <li>
                                Automate and streamline your logbook, eliminating paperwork confusion.
                            </li>
                            <li>
                                Direct access to a database of SIWES-accepting employers, removing the "ghosting" problem.
                            </li>
                        </ul>
                    </motion.div>

                    {/* Company Benefits Card */}
                    <motion.div 
                        variants={cardVariants(0.3)}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-white text-[#29335C] p-8 md:p-12 border-4 md:border-[6px] border-[#F3A712] shadow-[8px_8px_0px_0px_#F3A712] md:shadow-[12px_12px_0px_0px_#F3A712] relative overflow-hidden group rotate-0 md:rotate-1 hover:rotate-0 transition-transform duration-300"
                    >
                        <div className="absolute top-0 right-0 bg-[#F3A712] text-[#29335C] px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                            COMPANIES
                        </div>

                        <div className="p-3 bg-[#F3A712]/10 rounded-sm inline-flex border border-gray-200 mb-6">
                            <Building2 className="text-[#F3A712]"  size={20} />
                        </div>
                        
                        <h3 className="text-2xl font-black mb-6 tracking-tighter uppercase">What Companies Benefit</h3>
                        
                        <ul className="list-disc list-outside pl-6 space-y-4 text-sm font-semibold leading-relaxed">
                            <li>
                                Access to a curated pool of eager, tech-ready student talent.
                            </li>
                            <li>
                                Simplify the onboarding and evaluation of interns through structured performance tracking.
                            </li>
                            <li>
                                Build your employer brand with the upcoming generation of top tech professionals.
                            </li>
                        </ul>
                    </motion.div>

                </div>

                {/* ITF Alert Decal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 w-full max-w-4xl bg-[#DB2B39] text-white p-6 border-4 border-white shadow-[8px_8px_0px_0px_#F1F5F9] md:flex items-center gap-6"
                >
                    <div className="bg-white text-[#DB2B39] p-3 shrink-0 rounded-sm inline-flex mb-4 md:mb-0 border border-gray-200">
                        <Scale size={20} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-wider mb-1">Remember the ITF Law</h4>
                        <p className="text-sm font-medium leading-relaxed opacity-90">
                            The Industrial Training Fund (ITF) mandates students in relevant disciplines to undergo the Student Industrial Work Experience Scheme (SIWES). InternStack ensures full compliance with ITF requirements, keeping your training recognized and certified.
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Benefits;
