"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsLoading(true);
        try {
            await authService.forgotPassword({ email });
            toast.success('If the account exists, a reset code was sent.');
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0B1120] min-h-screen text-[#F1F5F9] relative flex flex-col justify-center items-center px-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 left-6 lg:left-10"
            >
                <Link href="/sign-in" className="group flex items-center gap-2 text-[#F1F5F9]/60 hover:text-[#D4AF37] transition-colors">
                    <div className="p-2 rounded-full border border-[#F1F5F9]/10 group-hover:border-[#D4AF37]/40 transition-all">
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Back to Login</span>
                </Link>
            </motion.div>

            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1E293B]/20 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                layout
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-7 flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#29335C] rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#F1F5F9]/10">
                        <KeyRound className="text-[#D4AF37]" size={28} />
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-[10px] mb-2"
                    >
                        Account Recovery
                    </motion.h2>
                    <motion.h1
                        layout
                        className="text-4xl font-extrabold tracking-tight"
                    >
                        Forgot <span className="text-[#D4AF37]">Password</span>
                    </motion.h1>
                    <p className="text-xs text-[#F1F5F9]/60 mt-4 leading-relaxed max-w-[80%]">
                        Enter your email address and we'll send you a 6-digit code to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-x-6 gap-y-5 transition-all duration-500 grid-cols-1">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@university.edu" 
                                className="w-full text-xs bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors" 
                            />
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading || !email}
                        className="w-full bg-[#F3A712] text-[#29335C] py-3 font-semibold shadow-[6px_6px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-[6px_6px_0px_0px_#FFF] transition-all duration-200 flex items-center justify-center gap-3 text-sm mt-8 cursor-pointer uppercase tracking-widest"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>
                                Send Reset Code
                                <ArrowRight size={16} />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
