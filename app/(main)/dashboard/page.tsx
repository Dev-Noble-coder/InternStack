"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { Loader2, LayoutDashboard, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isInitializing } = useAuthStore();
    const { logoutMutation } = useAuth();

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            router.push('/sign-in');
        }
    }, [isAuthenticated, isInitializing, router]);

    if (isInitializing || !isAuthenticated) {
        return (
            <div className="bg-[#0B1120] min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
            </div>
        );
    }

    return (
        <div className="bg-[#0B1120] min-h-screen text-[#F1F5F9] pt-24 pb-12 px-6 lg:px-20 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutDashboard className="text-[#D4AF37]" size={28} />
                            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                        </div>
                        <p className="text-[#F1F5F9]/60 text-sm">Welcome back to your InternStack workspace.</p>
                    </div>

                    <button 
                        onClick={() => logoutMutation.mutateAsync()}
                        disabled={logoutMutation.isPending}
                        className="flex items-center gap-2 bg-[#29335C] border border-[#F1F5F9]/10 px-5 py-2.5 rounded hover:bg-[#F3A712] hover:text-[#29335C] transition-colors disabled:opacity-50"
                    >
                        {logoutMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
                        <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
                    </button>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* User Profile Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#29335C]/50 border border-[#F1F5F9]/10 p-6 rounded-xl flex flex-col items-center text-center backdrop-blur-sm"
                    >
                        <div className="w-20 h-20 bg-[#F3A712]/20 rounded-full flex items-center justify-center mb-4 border border-[#F3A712]/50">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <UserIcon className="text-[#F3A712]" size={32} />
                            )}
                        </div>
                        <h2 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h2>
                        <p className="text-xs text-[#F1F5F9]/50 mb-2">{user?.email}</p>
                        <div className="inline-block px-3 py-1 bg-[#0B1120] rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mt-2">
                            {user?.role || 'Student'}
                        </div>
                    </motion.div>

                    {/* Placeholder Card 1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#29335C]/50 border border-[#F1F5F9]/10 p-6 rounded-xl backdrop-blur-sm flex flex-col justify-center items-center md:col-span-2 border-dashed"
                    >
                        <div className="text-center space-y-3">
                            <h3 className="text-[#D4AF37] font-bold tracking-widest uppercase text-xs">Applications</h3>
                            <p className="text-[#F1F5F9]/40 text-sm">You haven't applied to any internships yet.</p>
                            <button className="bg-[#F3A712] text-[#29335C] px-6 py-2 font-bold text-xs uppercase tracking-widest hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_#FFF]">
                                Browse Placements
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
