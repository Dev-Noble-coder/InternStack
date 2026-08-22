"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';

const VerifyEmailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyEmailMutation } = useAuth();
    
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error("Verification code must be exactly 6 digits.");
            return;
        }

        try {
            await verifyEmailMutation.mutateAsync({ email, code });
            toast.success('Email verified successfully! Please log in.');
            router.push('/sign-in');
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'Invalid verification code.');
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Please enter your email to resend the code.');
            return;
        }
        
        setIsResending(true);
        try {
            await authService.resendVerification({ email });
            toast.success('If the account exists, a verification code was sent.');
        } catch (error: any) {
            toast.error('Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const isLoading = verifyEmailMutation.isPending;

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
                        <Mail className="text-[#D4AF37]" size={28} />
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-[10px] mb-2"
                    >
                        Security Check
                    </motion.h2>
                    <motion.h1
                        layout
                        className="text-4xl font-extrabold tracking-tight"
                    >
                        Verify your <span className="text-[#D4AF37]">Email</span>
                    </motion.h1>
                    <p className="text-xs text-[#F1F5F9]/60 mt-4 leading-relaxed max-w-[80%]">
                        We sent a 6-digit verification code to your email. Enter it below to activate your account.
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

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">Verification Code (6 Digits)</label>
                            <input 
                                type="text" 
                                required
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456" 
                                className="w-full text-center tracking-[0.5em] text-lg font-bold bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors" 
                            />
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading || code.length !== 6}
                        className="w-full bg-[#F3A712] text-[#29335C] py-3 font-semibold shadow-[6px_6px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-[6px_6px_0px_0px_#FFF] transition-all duration-200 flex items-center justify-center gap-3 text-sm mt-8 cursor-pointer uppercase tracking-widest"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>
                                Verify Account
                                <ArrowRight size={16} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-7 text-center">
                    <p className="text-xs text-[#F1F5F9]/40">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-[#D4AF37] font-bold hover:text-[#F1F5F9] transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="bg-[#0B1120] min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#D4AF37]" size={32} /></div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
