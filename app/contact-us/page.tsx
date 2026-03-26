import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactUs() {
  return (
    <>
      <NavBar />
      <main className="bg-[#F1F5F9] min-h-screen pt-32 pb-20 px-4 md:px-10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#29335C] uppercase mb-4">
              Get in <span className="text-[#F3A712] relative inline-block">
                Touch
              </span>
            </h1>
            <p className="text-sm text-[#29335C]/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Have questions about InternStack, partnerships, or the SIWES process? We're here to help you deploy your career.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-stretch">
            
            {/* Left Column: Form Section */}
            <div className="bg-white p-8 md:p-12 border-4 md:border-[6px] border-[#29335C] shadow-[8px_8px_0px_0px_rgba(41,51,92,1)] md:shadow-[12px_12px_0px_0px_rgba(41,51,92,1)] relative overflow-hidden group rotate-0 md:-rotate-1 hover:rotate-0 transition-transform duration-300 h-full flex flex-col justify-center">
              
              <div className="absolute top-0 right-0 bg-[#29335C] text-white px-10 py-2 translate-x-[35px] translate-y-[20px] rotate-45 font-black text-[10px] tracking-widest uppercase z-20">
                MESSAGE
              </div>
              
              <h2 className="text-2xl font-black uppercase text-[#29335C] tracking-tighter mb-8">
                Send a Message
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#29335C] uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Enter your name" 
                    className="w-full bg-[#F1F5F9] border-2 border-[#29335C] p-3 md:p-4 text-sm focus:outline-none focus:ring-0 focus:border-[#F3A712] shadow-[4px_4px_0px_0px_rgba(41,51,92,0.2)] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#29335C] uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-[#F1F5F9] border-2 border-[#29335C] p-3 md:p-4 text-sm focus:outline-none focus:ring-0 focus:border-[#F3A712] shadow-[4px_4px_0px_0px_rgba(41,51,92,0.2)] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-[#29335C] uppercase tracking-wider mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    placeholder="What is this regarding?" 
                    className="w-full bg-[#F1F5F9] border-2 border-[#29335C] p-3 md:p-4 text-sm focus:outline-none focus:ring-0 focus:border-[#F3A712] shadow-[4px_4px_0px_0px_rgba(41,51,92,0.2)] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-[#29335C] uppercase tracking-wider mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    placeholder="Type your message here..." 
                    className="w-full bg-[#F1F5F9] border-2 border-[#29335C] p-3 md:p-4 text-sm resize-none focus:outline-none focus:ring-0 focus:border-[#F3A712] shadow-[4px_4px_0px_0px_rgba(41,51,92,0.2)] transition-colors"
                  ></textarea>
                </div>
                
                <button 
                  type="button" 
                  className="w-full bg-[#F3A712] text-[#29335C] px-8 py-3 font-semibold uppercase tracking-widest flex items-center justify-center gap-3 border-2 border-[#29335C] shadow-[4px_4px_0px_0px_#29335C] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#29335C] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#29335C] transition-all duration-200 mt-4"
                >
                  Send Message <Send size={18} />
                </button>
              </form>
            </div>

            {/* Right Column: Info & Image Section */}
            <div className="flex flex-col gap-8 h-full">
              
              {/* Illustration Card */}
              <div className="hidden lg:block w-full grow bg-[#F0CEA0] border-4 md:border-[6px] border-[#29335C] shadow-[8px_8px_0px_0px_rgba(41,51,92,1)] md:shadow-[12px_12px_0px_0px_rgba(41,51,92,1)] relative overflow-hidden group rotate-0 md:rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="absolute inset-0 z-10 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(#DB2B39 1px, transparent 1px), linear-gradient(90deg, #DB2B39 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                <Image 
                  src="/contact-us-image.png"
                  alt="Students and Professionals Connecting"
                  fill
                  className="object-cover relative z-0 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Contact Info Card */}
              <div className="bg-[#29335C] text-white p-8 md:p-10 border-4 border-[#1E293B] shadow-[8px_8px_0px_0px_#DB2B39] relative">
                
                <h3 className="text-xl font-black uppercase text-[#F3A712] tracking-tighter mb-6">
                  Direct Contact
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 shrink-0">
                      <Mail className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Email</p>
                      <a href="mailto:hello@internstack.com.ng" className="text-sm font-semibold hover:text-[#F3A712] transition-colors">hello@internstack.com.ng</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 shrink-0">
                      <Phone className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Phone / WhatsApp</p>
                      <a href="https://wa.me/2347075688609" className="text-sm font-semibold hover:text-[#F3A712] transition-colors">+234 (0) 707 568 8609</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white/10 shrink-0">
                      <MapPin className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Location</p>
                      <p className="text-sm font-semibold text-white/90">Nigeria</p>
                    </div>
                  </div>
                </div>

                {/* Decorative terminal dots */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#DB2B39]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F3A712]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
