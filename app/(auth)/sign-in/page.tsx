"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-[10px] ${met ? 'text-green-400' : 'text-[#F1F5F9]/40'} transition-colors`}>
        {met ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
        <span>{text}</span>
    </div>
);

const SignInPage = () => {
    const router = useRouter();
    const { loginMutation, registerMutation } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const requirements = [
        { met: formData.password.length >= 8, text: '8+ characters' },
        { met: /[A-Z]/.test(formData.password), text: 'Uppercase letter' },
        { met: /[a-z]/.test(formData.password), text: 'Lowercase letter' },
        { met: /[0-9]/.test(formData.password), text: 'Number' },
    ];
    
    const strength = requirements.filter(req => req.met).length;
    const isPasswordValid = strength === 4;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && !isPasswordValid) {
            toast.error("Please ensure your password meets all requirements.");
            return;
        }

        try {
            if (isLogin) {
                await loginMutation.mutateAsync({
                    email: formData.email,
                    password: formData.password
                });
                toast.success('Logged in successfully!');
                router.push('/dashboard');
            } else {
                await registerMutation.mutateAsync({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                });
                toast.success('Account created! Please verify your email.');
                router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'An error occurred. Please try again.');
        }
    };

    const isLoading = loginMutation.isPending || registerMutation.isPending;

    return (
        <div className="bg-[#0B1120] min-h-screen text-[#F1F5F9] relative flex flex-col justify-center items-center px-6 overflow-hidden py-12">
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

            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1E293B]/20 blur-[100px] rounded-full pointer-events-none" />

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

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-[#F1F5F9]/10" />
                    <span className="text-[10px] text-[#F1F5F9]/30 uppercase font-bold tracking-widest">Sign in with Email</span>
                    <div className="h-px flex-1 bg-[#F1F5F9]/10" />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-x-6 gap-y-5 transition-all duration-500 grid-cols-1">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        required={!isLogin}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Ada" 
                                        className="w-full text-xs bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName"
                                        required={!isLogin}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Lovelace" 
                                        className="w-full text-xs bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors" 
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@university.edu" 
                                className="w-full text-xs bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors" 
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-[#F0CEA0]">Password</label>
                                {isLogin && (
                                    <Link href="/forgot-password" className="text-[10px] text-[#F1F5F9]/60 hover:text-[#D4AF37] transition-colors">
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••" 
                                    className="w-full text-xs bg-[#29335C] border border-[#F1F5F9]/20 p-3 pr-10 focus:border-[#F3A712] outline-none transition-colors" 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F1F5F9]/40 hover:text-[#F3A712] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator (Only for Create Account) */}
                            {!isLogin && formData.password.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pt-2 space-y-2 overflow-hidden"
                                >
                                    {/* Progress Bar */}
                                    <div className="h-1 w-full bg-[#1E293B] rounded-full overflow-hidden flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div 
                                                key={level}
                                                className={`h-full flex-1 transition-all duration-500 ${
                                                    strength >= level 
                                                        ? strength <= 2 ? 'bg-red-400' : strength === 3 ? 'bg-yellow-400' : 'bg-green-400'
                                                        : 'bg-transparent'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {requirements.map((req, idx) => (
                                            <PasswordRequirement key={idx} met={req.met} text={req.text} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading || (!isLogin && !isPasswordValid)}
                        className="w-full bg-[#F3A712] text-[#29335C] py-3 font-semibold shadow-[6px_6px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-[6px_6px_0px_0px_#FFF] transition-all duration-200 flex items-center justify-center gap-3 text-sm mt-8 cursor-pointer uppercase tracking-widest"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>
                                {isLogin ? 'Login' : 'Create Account'}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-7 text-center">
                    <p className="text-xs text-[#F1F5F9]/40">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({ firstName: '', lastName: '', email: '', password: '' });
                            }}
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
