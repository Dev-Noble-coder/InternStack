"use client";
import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
    ArrowRight,
    UserCheck,
    FileText,
    BookOpen,
    Building2,
    Rocket,
    CheckCircle2,
    RocketIcon,
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const fadeUp = (delay: number = 0): Variants => ({
    initial: { opacity: 0, y: 40 },
    whileInView: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
    },
});

const steps = [
    {
        number: "01",
        ribbon: "START",
        icon: UserCheck,
        title: "Create Your Profile",
        description:
            "Sign up in seconds. Tell InternStack your school, department, skill set, and SIWES duration. We use this to personalise everything from your CV to the companies we recommend.",
        highlights: ["Free to join", "2-minute setup", "Fully personalised"],
        rotate: "md:-rotate-1",
        direction: "left" as const,
    },
    {
        number: "02",
        ribbon: "BUILD",
        icon: FileText,
        title: "Generate Your CV",
        description:
            "Our AI-powered builder transforms your projects, coursework, and skills into a professional, industry-ready CV. No design skills needed just fill in your details and export.",
        highlights: ["ATS-friendly format", "Multiple templates", "Instant PDF export"],
        rotate: "md:rotate-1",
        direction: "right" as const,
    },
    {
        number: "03",
        ribbon: "LOG",
        icon: BookOpen,
        title: "Master Your Logbook",
        description:
            "Stop struggling with logbook entries. InternStack guides you through daily and weekly entries, auto-formats them to meet ITF and university standards, and reminds you of submission deadlines.",
        highlights: ["ITF-compliant entries", "Deadline reminders", "Supervisor-ready reports"],
        rotate: "md:-rotate-1",
        direction: "left" as const,
    },
    {
        number: "04",
        ribbon: "FIND",
        icon: Building2,
        title: "Discover SIWES Companies",
        description:
            "Browse our verified database of tech companies that actively accept SIWES students. Filter by location, department, and stack. See exactly what each company requires and how to apply.",
        highlights: ["Verified listings", "Filter by skills & location", "Direct application paths"],
        rotate: "md:rotate-1",
        direction: "right" as const,
    },
    {
        number: "05",
        ribbon: "LAUNCH",
        icon: Rocket,
        title: "Deploy Your Career",
        description:
            "Apply with confidence. Track your applications, follow up with companies, and complete your SIWES journey with a portfolio that speaks for itself ready for the job market.",
        highlights: ["Application tracking", "Portfolio showcase", "Post-SIWES job-readiness"],
        rotate: "md:-rotate-1",
        direction: "up" as const,
    },
];

const HowItWorksPage: React.FC = () => {
    return (
        <>
            <NavBar />

            {/* Hero Banner */}
            <section className="bg-[#29335C] text-[#F1F5F9] pt-32 pb-20 px-5 lg:px-10 overflow-hidden relative">
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(#F3A712 1px, transparent 1px), linear-gradient(90deg, #F3A712 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Floating elements */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 left-[10%] opacity-10 hidden lg:block"
                >
                    <RocketIcon size={120} className="text-[#F3A712]" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-60 right-[10%] opacity-10 hidden lg:block"
                >
                    <UserCheck size={100} className="text-[#F3A712]" />
                </motion.div>

                <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3A712]/10 border border-[#F3A712]/20 text-[#F3A712] text-xs font-semibold uppercase tracking-wider mb-4"
                    >
                        <Rocket size={14} />
                        <span>Simple. Structured (v1.0). Yours.</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-3"
                    >
                        How <span className="text-[#F3A712]">InternStack</span> <br className="hidden md:block" /> Works
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm  text-[#F1F5F9]/80 max-w-xl leading-relaxed mb-5"
                    >
                        Five clear steps that take you from &quot;I don&apos;t know where to start&quot;
                        to a completed, confident SIWES journey. No more guesswork, just progress.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="https://forms.gle/PzStD7NhaBzTJwgv5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F3A712] text-[#29335C] px-10 py-2.5 font-medium text-sm  tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFF] active:translate-y-0 active:shadow-none transition-all duration-200"
                        >
                            Join the Waitlist <ArrowRight size={18} strokeWidth={3} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Steps */}
            <section className="bg-white text-[#29335C] py-16 lg:py-20 px-5 lg:px-10 overflow-hidden relative">
                {/* Decorative background */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <mask id="howMask">
                                <rect width="100" height="100" fill="white" />
                                <path d="M0,0 L50,30 L100,0 L100,100 L0,100 Z" fill="black" />
                            </mask>
                        </defs>
                        <rect width="100" height="100" fill="#F1F5F9" mask="url(#howMask)" />
                    </svg>
                </div>

                <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col gap-12">

                    {/* Section heading */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.8 }}
                        className="text-center space-y-4"
                    >
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#29335C] uppercase italic">
                            Your 5-Step{" "}
                            <span className="text-[#F3A712] relative inline-block not-italic">
                                SIWES Blueprint
                                <svg className="absolute -bottom-3 left-0 w-full h-3 text-[#F3A712]" preserveAspectRatio="none" viewBox="0 0 100 10">
                                    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h2>
                        <p className="text-base text-[#29335C]/70 font-bold max-w-lg mx-auto">
                            The battle-tested framework to go from lost student to industry-ready professional.
                        </p>
                    </motion.div>

                    {/* Step cards */}
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.number}
                                variants={fadeUp(i * 0.1)}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={{ once: true, amount: 0.25 }}
                                className={`bg-white p-6 md:p-10 border-4 md:border-[6px] border-[#29335C]
                  shadow-[8px_8px_0px_0px_rgba(41,51,92,1)] md:shadow-[16px_16px_0px_0px_rgba(41,51,92,1)]
                  relative overflow-hidden group
                  rotate-0 ${step.rotate} hover:rotate-0 hover:-translate-y-2 hover:shadow-[20px_20px_0px_0px_rgba(41,51,92,1)] transition-all duration-300`}
                            >
                                {/* Corner ribbon */}
                                <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                                    {step.ribbon}
                                </div>

                                {/* Step number watermark */}
                                <div className="absolute -bottom-4 -left-2 text-[#F1F5F9] font-black text-8xl select-none pointer-events-none leading-none">
                                    {step.number}
                                </div>

                                <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
                                    {/* Icon */}
                                    <div className="p-3 bg-[#F3A712]/10 rounded-sm inline-flex border border-gray-200 shrink-0">
                                        <Icon className="text-[#F3A712]" size={24} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-black mb-3 tracking-tighter text-[#29335C] uppercase relative inline-block">
                                            {step.title}
                                            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#29335C]" />
                                        </h3>
                                        <p className="text-sm text-[#29335C]/80 font-medium leading-relaxed mb-5">
                                            {step.description}
                                        </p>

                                        {/* Highlights */}
                                        <ul className="flex flex-wrap gap-3">
                                            {step.highlights.map((h) => (
                                                <li
                                                    key={h}
                                                    className="flex items-center gap-1.5 text-xs font-bold text-[#29335C] bg-[#F3A712]/10 border border-[#F3A712]/30 px-3 py-1"
                                                >
                                                    <CheckCircle2 size={12} className="text-[#F3A712]" />
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <section className="px-5 lg:px-10"
            >
                <div className="max-w-7xl mx-auto bg-[#0B1120]/90 backdrop-blur-md px-7 py-12 md:p-20  relative overflow-hidden my-16 border-4 border-[#1E293B] shadow-[8px_8px_0px_0px_#64748B]">
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
                                href="https://forms.gle/PzStD7NhaBzTJwgv5"
                                target="_blank"
                                rel="noopener noreferrer"
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


            <Footer />
        </>
    );
};

export default HowItWorksPage;
