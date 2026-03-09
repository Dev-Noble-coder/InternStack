"use client";
import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Layers } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t-4 border-[#29335C] pt-16 pb-8 px-5 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-6">
                           <div className="text-2xl font-bold tracking-tight flex items-center gap-1.5 ">
          <Layers className="text-[#F3A712]" /> {/* Primary Orange Accent */}
          <Link href="/" className="flex items-center">
            <span className="text-[#F3A712]/50">Intern</span> {/* Soft Apricot */}
            <span className="text-[#29335C]">Stack</span>
          </Link>
        </div>
                        <p className="text-[#29335C]/70 font-medium max-w-sm leading-relaxed text-sm">
                         The ultimate SIWES engine for students. Generate professional CVs, master your logbook, and access SIWES opportunities from top Nigerian companies.
                        </p>
                        <div className="flex gap-4">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="p-2 border-2 border-[#29335C] text-[#29335C]  transition-colors shadow-[3px_3px_0px_0px_#29335C] active:translate-y-0.5 active:shadow-none">
                                    <Icon size={20} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-black uppercase text-xs tracking-widest text-[#29335C]">Company</h4>
                            <ul className="space-y-2 text-sm  text-[#29335C]/80">
                                <li><Link href="#" className="hover:text-[#F3A712]">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black uppercase text-xs tracking-widest text-[#29335C]">Support</h4>
                            <ul className="space-y-2 text-sm  text-[#29335C]/80">
                                <li><Link href="#" className="hover:text-[#F3A712]">FAQ</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t-2 border-[#F1F5F9] text-center text-[#94A3B8] text-xs">
                    <p>© {currentYear} InternStack | ALL_RIGHTS_RESERVED</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;