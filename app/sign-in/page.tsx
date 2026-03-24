"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SignInPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="bg-[#0B1120] min-h-screen text-[#F1F5F9] relative flex flex-col justify-center items-center px-6 overflow-hidden">

            {/* 1. Back Button - Pinned Top Left */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 left-6 lg:left-10"
            >
                <Link href="/" className="group flex items-center gap-2 text-[#F1F5F9]/60 hover:text-[#D4AF37] transition-colors">
                    <div className="p-2 rounded-full border border-[#F1F5F9]/10 group-hover:border-[#D4AF37]/40 transition-all">
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Home</span>
                </Link>
            </motion.div>

            {/* 2. Decorative Background Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1E293B]/20 blur-[100px] rounded-full" />

            {/* 3. The Form Container */}
            <motion.div
                layout
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-7">
                    <motion.h2
                        key={isLogin ? 'login-h2' : 'signup-h2'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-[10px] mb-2"
                    >
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </motion.h2>
                    <motion.h1
                        layout
                        className="text-4xl font-extrabold tracking-tight"
                    >
                        {isLogin ? 'Login ' : 'Create an Account '}<span className="text-[#D4AF37]">Here</span>
                    </motion.h1>
                </div>

                {/* Social Login Button */}
                <button className="w-full bg-[#29335C] border border-[#F1F5F9]/20 py-3 flex items-center justify-center gap-3 hover:bg-[#F3A712] hover:text-[#29335C] transition-all duration-300 mb-8 cursor-pointer group shadow-[4px_4px_0px_0px_#F1F5F9]/10 hover:shadow-[6px_6px_0px_0px_#F1F5F9]/20 hover:-translate-y-1">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Continue with Google</span>
                </button>

                <div className="flex items-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-[#F1F5F9]/10" />
                    <span className="text-[10px] text-[#F1F5F9]/30 uppercase font-bold tracking-widest">Or with Email</span>
                    <div className="h-px flex-1 bg-[#F1F5F9]/10" />
                </div>

                {/* Main Form */}
                <form onSubmit={(e) => e.preventDefault()}>

                    {/* 1. Define the grid here. We use 'contents' on the motion wrapper so it doesn't break the grid flow */}
                    <div className="grid gap-x-6 gap-y-5 transition-all duration-500 grid-cols-1">





                        {/* Email Address - We use col-span-2 if we want it to take full width when in signup mode, or just let it flow */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">Email Address</label>
                            <input type="email" placeholder="john@university.edu" className="w-full text-xs bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors" />
                        </div>


                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">Password</label>
                            <input type="password" placeholder="••••••••" className="w-full text-xs bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors" />
                        </div>

                    </div>


                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#F3A712] text-[#29335C] py-3 font-semibold shadow-[6px_6px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-y-0 active:shadow-none transition-all duration-200 flex items-center justify-center gap-3 text-sm mt-8 cursor-pointer uppercase tracking-widest"
                    >
                        {isLogin ? 'Login' : 'Create Account'}
                        <ArrowRight size={16} />
                    </motion.button>
                </form>

                {/* Switch UI Toggle */}
                <div className="mt-7 text-center">
                    <p className="text-xs text-[#F1F5F9]/40">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#D4AF37] font-bold hover:text-[#F1F5F9] transition-colors cursor-pointer"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignInPage;
