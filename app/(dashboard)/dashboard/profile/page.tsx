"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useStudentProfile, useUpdateStudentProfile } from "../../../hooks/useStudent";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { SuccessModal } from "../../../components/ui/SuccessModal";
import toast from "react-hot-toast";

export default function StudentProfilePage() {
  const { data: profile, isLoading } = useStudentProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateStudentProfile();

  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
    institution: "",
    matricNumber: "",
    faculty: "",
    department: "",
    level: "300 Level",
    internshipType: "6-Month SIWES",
    internshipStartPeriod: "",
    internshipEndPeriod: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || "",
        bio: profile.bio || "",
        institution: profile.institution || "",
        matricNumber: profile.matricNumber || "",
        faculty: profile.faculty || "",
        department: profile.department || "",
        level: profile.level || "300 Level",
        internshipType: profile.internshipType || "6-Month SIWES",
        internshipStartPeriod: profile.internshipStartPeriod
          ? profile.internshipStartPeriod.split("T")[0]
          : "",
        internshipEndPeriod: profile.internshipEndPeriod
          ? profile.internshipEndPeriod.split("T")[0]
          : "",
      });
      setSkills(profile.skills || []);
      setPreferredLocations(profile.preferredLocations || []);
    }
  }, [profile]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddLocation = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const loc = locationInput.trim();
    if (loc && !preferredLocations.includes(loc)) {
      setPreferredLocations([...preferredLocations, loc]);
      setLocationInput("");
    }
  };

  const handleRemoveLocation = (locToRemove: string) => {
    setPreferredLocations(preferredLocations.filter((l) => l !== locToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        skills,
        preferredLocations,
      });
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to update profile. Please try again.");
    }
  };

  const completion = profile?.completionPercentage ?? 0;
  const isReady = profile?.isReadyToApply ?? false;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-[#131B2E] border border-slate-800 rounded-3xl" />
        <div className="h-96 bg-[#131B2E] border border-slate-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header & Completeness Bar */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[#F3A712] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Student Academic Profile
              </span>
              {isReady ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to Apply
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Incomplete Requirements
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Profile & Placement Credentials
            </h1>
            <p className="text-xs lg:text-sm text-slate-400 mt-1">
              Employers require your matric number, verified tertiary institution, and CV before reviewing applications.
            </p>
          </div>
        </div>

        <ProgressBar
          value={completion}
          label="Profile & Verification Score"
          size="md"
        />
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Academic Details Card */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F3A712]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Academic Information</h3>
              <p className="text-xs text-slate-400">Institutional details required for SIWES endorsement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Higher Institution / University / Polytechnic"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. University of Lagos (UNILAG)"
            />
            <Input
              label="Matriculation / Registration Number"
              required
              value={formData.matricNumber}
              onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
              placeholder="e.g. 190408012"
            />
            <Input
              label="Faculty"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              placeholder="e.g. Faculty of Engineering"
            />
            <Input
              label="Department / Course of Study"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Computer Engineering"
            />
            <Select
              label="Current Academic Level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              options={[
                { value: "200 Level", label: "200 Level" },
                { value: "300 Level", label: "300 Level" },
                { value: "400 Level", label: "400 Level" },
                { value: "500 Level", label: "500 Level" },
                { value: "Post-Graduate", label: "Post-Graduate" },
              ]}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +234 801 234 5678"
            />
          </div>
        </div>

        {/* Internship Preferences Card */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Internship Duration & Preferences</h3>
              <p className="text-xs text-slate-400">SIWES period and preferred work locations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Select
              label="Internship Scheme / Duration"
              value={formData.internshipType}
              onChange={(e) => setFormData({ ...formData, internshipType: e.target.value })}
              options={[
                { value: "3-Month SIWES", label: "3-Month SIWES" },
                { value: "6-Month SIWES", label: "6-Month SIWES" },
                { value: "1-Year IT", label: "1-Year IT" },
              ]}
            />
            <Input
              label="Preferred Start Period"
              type="date"
              value={formData.internshipStartPeriod}
              onChange={(e) => setFormData({ ...formData, internshipStartPeriod: e.target.value })}
            />
            <Input
              label="Preferred End Period"
              type="date"
              value={formData.internshipEndPeriod}
              onChange={(e) => setFormData({ ...formData, internshipEndPeriod: e.target.value })}
            />
          </div>

          {/* Preferred Locations Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Preferred States / Cities
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={handleAddLocation}
                placeholder="Type location (e.g. Lagos, Abuja) and press Enter..."
                className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712]"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl border border-slate-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {preferredLocations.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {preferredLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills & Bio Card */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Skills & Personal Statement</h3>
              <p className="text-xs text-slate-400">Highlight your technical proficiencies and background</p>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Key Skills & Tools
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type a skill (e.g. React, AutoCAD, Python, Financial Modeling) and press Enter..."
                className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#F3A712]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl border border-slate-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-[#F0CEA0] font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Textarea
            label="Brief Student Bio & Professional Objective"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell recruiters about your interests, key academic achievements, and internship aspirations..."
          />
        </div>

        {/* CV Snapshot Card */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Curriculum Vitae (CV)</h3>
              <p className="text-xs text-slate-400">Your master resume snapshot attached to applications</p>
            </div>
          </div>

          {profile?.cv?.url ? (
            <div className="p-4 bg-[#0F172A] border border-slate-700/80 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#F3A712]" />
                <div>
                  <p className="text-sm font-bold text-white">{profile.cv.filename || "Resume.pdf"}</p>
                  <p className="text-xs text-slate-400">
                    Uploaded:{" "}
                    {profile.cv.uploadedAt
                      ? new Date(profile.cv.uploadedAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
              <a
                href={profile.cv.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                <span>View CV</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-4 bg-amber-950/30 border border-amber-800/60 rounded-2xl flex items-center gap-3 text-xs text-amber-300">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                You have not linked your CV yet. A CV is required before 1-click apply becomes enabled.
              </span>
            </div>
          )}
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-sm uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile & Qualifications</span>
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Profile Updated Successfully!"
        message="Your academic credentials, internship preferences, and skills have been saved."
        actionLabel="Continue to Dashboard"
        onAction={() => {
          setSuccessModalOpen(false);
          window.location.href = "/dashboard";
        }}
      />
    </div>
  );
}
