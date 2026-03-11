"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const UNIVERSITIES = [
  "Federal University of Oye",
  "Achievers University Owo",
  "Abuad University",
  "Landmark University",
  "Ekiti State University",
  "University of Ibadan",
  "Federal University of Technology Akure",
  "University of Lagos",
  "Obafemi Awolowo University Ife"
];

const LEVELS = ["100 lvl", "200 lvl", "300 lvl", "400 lvl"];
const DURATIONS = ["3 months", "6 months"];
const CHALLENGES = [
  "Finding a company that accepts SIWES students",
  "Writing professional CVs that get noticed.",
  "Keeping up with daily/weekly logbook entries.",
  "Understanding ITF requirements and submission."
];
const SOURCES = ["From a friend", "WhatsApp Status", "University Group", "Other"];

interface FormData {
  email: string;
  fullName: string;
  whatsappNumber: string;
  university: string;
  level: string;
  duration: string;
  challenges: string[];
  source: string;
  otherSource?: string;
}

export default function WaitlistPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    whatsappNumber: '',
    university: '',
    level: '',
    duration: '',
    challenges: [],
    source: '',
    otherSource: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChallengeChange = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([{
          email: formData.email,
          full_name: formData.fullName,
          whatsapp_number: formData.whatsappNumber,
          university: formData.university,
          current_level: formData.level,
          siwes_duration: formData.duration,
          challenges: formData.challenges,
          referral_source: formData.source === 'Other' ? formData.otherSource : formData.source
        }]);

      if (supabaseError) throw supabaseError;

      setIsSubmitted(true);
      toast.success('Successfully joined the waitlist!');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      toast.error('Failed to join waitlist. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#29335C] text-[#F1F5F9] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#1A2341]/50 p-10 border border-[#F1F5F9]/10 shadow-[8px_8px_0px_0px_#F3A712]"
        >
          <CheckCircle2 className="w-16 h-16 text-[#F3A712] mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold mb-4">Thanks for joining!</h1>
          <p className="text-[#F1F5F9]/80 mb-8 leading-relaxed text-sm">
            We've received your details and we can't wait to have you on board.
            We'll reach out to you soon with next steps and exclusive early-bird updates.
          </p>
          <div className="pt-6 border-t border-[#F1F5F9]/10">
            <p className="text-sm font-medium text-[#F1F5F9]/80">
              <span className='text-[#F0CEA0]'>Intern<span className='text-white'>Stack</span></span> | Build your career, layer by layer.
            </p>
          </div>
          <Link
            href="/"
            className="mt-8 inline-block bg-[#F3A712] text-[#29335C] px-8 py-3 font-medium text-sm shadow-[4px_4px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFF] transition-all duration-200"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#29335C] text-[#F1F5F9] py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="flex items-center gap-2 mb-6 text-xs text-[#F1F5F9]/60 hover:text-[#F3A712] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <Link href="/" className="inline-flex items-center gap-2 mb-12  transition-colors group">
          <Layers className="text-[#F3A712]" />
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#F0CEA0]">Intern</span>
            <span>Stack</span>
          </span>
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
            InternStack: Join the 2026 SIWES Waitlist 🚀
          </h1>
          <div className="h-1 w-20 bg-[#F3A712] mb-8" />

          <div className="space-y-4 text-sm text-[#F1F5F9]/80 font-medium leading-relaxed">
            <p>
              Stop guessing and start building. <span className="text-[#F1F5F9] font-bold">InternStack</span> is the ultimate engine for Nigerian students to master their SIWES journey.
            </p>
            <p>By joining the waitlist, you'll get early access to:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-xl">✨</span>
                <span><span className="font-bold text-[#F1F5F9]">AI CV Builder:</span> Tech-ready resumes in minutes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📓</span>
                <span><span className="font-bold text-[#F1F5F9]">Logbook Assistant:</span> Error-free daily entries that meet ITF standards.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">🏢</span>
                <span><span className="font-bold text-[#F1F5F9]">Verified Directory:</span> Direct access to top tech companies accepting interns.</span>
              </li>
            </ul>
            <p className="mt-8 font-semibold italic text-[#F0CEA0]">
              Secure your spot and be the first to know when we launch ( soon ) !
            </p>
            <p className="text-sm bg-black/20 p-4 border-l-4 border-blue-400">
              If you encounter any issue while filling the form, Contact Us via <a href="https://wa.me/2347075688609" className="text-blue-400 underline" target="_blank">07075688609 via WhatsApp</a>.
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8 bg-[#1A2341]/50 p-8 md:p-12 border border-[#F1F5F9]/10 shadow-[8px_8px_0px_0px_#F1F5F9]/10"
        >
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-100 flex items-center gap-3">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Email */}
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">Email Address *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">Full Name *</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-3 lg:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">WhatsApp Number *</label>
              <input
                required
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors"
                placeholder="e.g. +234 812 345 6789"
              />
            </div>
          </div>

          {/* University */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">University *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UNIVERSITIES.map((uni) => (
                <label key={uni} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="university"
                      value={uni}
                      checked={formData.university === uni}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{uni}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Current Level */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">Current Level / Year *</label>
            <div className="flex flex-wrap gap-6">
              {LEVELS.map((lvl) => (
                <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="level"
                      value={lvl}
                      checked={formData.level === lvl}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{lvl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SIWES Duration */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">SIWES Duration *</label>
            <div className="flex flex-wrap gap-8">
              {DURATIONS.map((dur) => (
                <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="duration"
                      value={dur}
                      checked={formData.duration === dur}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{dur}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">What is your biggest challenge with SIWES right now? *</label>
            <div className="space-y-4">
              {CHALLENGES.map((challenge) => (
                <label key={challenge} className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={formData.challenges.includes(challenge)}
                      onChange={() => handleChallengeChange(challenge)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <CheckCircle2 className="absolute w-4 h-4 text-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm leading-relaxed group-hover:text-[#F3A712] transition-colors">{challenge}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Referral Source */}
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">How did you hear about InternStack? *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOURCES.map((src) => (
                <label key={src} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="source"
                      value={src}
                      checked={formData.source === src}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{src}</span>
                </label>
              ))}
            </div>
            {formData.source === 'Other' && (
              <motion.input
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                required
                type="text"
                placeholder="Please specify..."
                value={formData.otherSource}
                onChange={(e) => setFormData({ ...formData, otherSource: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors mt-2"
              />
            )}
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-[#F3A712] text-[#29335C] py-3 font-semibold shadow-[6px_6px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#FFF] active:translate-y-0 active:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" /> Submitting...
              </>
            ) : (
              'Join the Waitlist'
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
