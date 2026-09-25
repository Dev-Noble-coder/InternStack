"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Globe,
  FileEdit,
  Sparkles,
  Link2,
  Building2,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  Plus,
  Check,
} from "lucide-react";
import { useStudentSubmissions, useSubmitListing } from "../../../hooks/useStudent";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { SuccessModal } from "../../../components/ui/SuccessModal";
import { Tabs } from "../../../components/ui/Tabs";
import { DataTable, Column } from "../../../components/ui/DataTable";
import { ListingSubmission } from "../../../types/student";
import toast from "react-hot-toast";

export default function StudentSubmissionsPage() {
  const [submissionType, setSubmissionType] = useState<"url" | "manual">("url");
  const [urlInput, setUrlInput] = useState("");
  const [manualForm, setManualForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    // workMode: "onsite",
    internshipType: "SIWES",
    startPeriod: "",
    endPeriod: "",
    deadline: "",
    requirements: "",
    skills: "",
    applicationUrl: "",
  });

  const [page, setPage] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const { data: submissionsData, isLoading: isLoadingSubmissions } = useStudentSubmissions({
    page,
    limit: 10,
  });

  const { mutateAsync: submitListing, isPending: isSubmitting } = useSubmitListing();

  // Smart role suggestions based on role title
  const getRoleSuggestions = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("front") || t.includes("react") || t.includes("web") || t.includes("vue") || t.includes("angular")) {
      return {
        skills: ["React", "JavaScript", "TypeScript", "HTML5/CSS3", "Tailwind CSS", "Next.js", "Git", "REST APIs"],
        requirements: ["React", "JavaScript", "Git", "Responsive UI", "SIWES Enrolled", "HTML/CSS"],
      };
    }
    if (t.includes("back") || t.includes("node") || t.includes("django") || t.includes("laravel") || t.includes("api") || t.includes("server")) {
      return {
        skills: ["Node.js", "Python", "Express.js", "PostgreSQL", "MongoDB", "REST APIs", "Docker", "Git"],
        requirements: ["Node.js", "Python", "REST APIs", "SQL / Databases", "Git", "SIWES Enrolled"],
      };
    }
    if (t.includes("data") || t.includes("ai") || t.includes("ml") || t.includes("analyst") || t.includes("machine") || t.includes("intelligence")) {
      return {
        skills: ["Python", "SQL", "Pandas", "Power BI", "Data Analysis", "Excel", "Machine Learning", "Git"],
        requirements: ["Python", "SQL", "Data Analysis", "Statistics", "Excel", "SIWES Enrolled"],
      };
    }
    if (t.includes("design") || t.includes("ui") || t.includes("ux") || t.includes("product design")) {
      return {
        skills: ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "Design Systems", "User Research", "Adobe XD"],
        requirements: ["Figma", "UI/UX Design", "Wireframing", "Design Portfolio", "SIWES Enrolled"],
      };
    }
    if (t.includes("mobile") || t.includes("flutter") || t.includes("android") || t.includes("ios") || t.includes("react native") || t.includes("app")) {
      return {
        skills: ["Flutter", "React Native", "Dart", "JavaScript", "Mobile UI", "REST APIs", "Git", "Firebase"],
        requirements: ["Flutter", "React Native", "Mobile UI", "REST APIs", "Git", "SIWES Enrolled"],
      };
    }
    if (t.includes("devops") || t.includes("cloud") || t.includes("security") || t.includes("cyber") || t.includes("linux")) {
      return {
        skills: ["Linux", "AWS", "Docker", "Git", "CI/CD", "Bash Scripting", "Networking", "Kubernetes"],
        requirements: ["Linux", "Cloud (AWS)", "Docker", "Networking", "Git", "SIWES Enrolled"],
      };
    }
    // Default general suggestions
    return {
      skills: ["React", "JavaScript", "Python", "Node.js", "SQL", "Git", "Figma", "HTML/CSS", "Tailwind CSS"],
      requirements: ["JavaScript", "Python", "Git & GitHub", "Problem Solving", "SIWES Enrolled", "HTML/CSS"],
    };
  };

  const suggestions = getRoleSuggestions(manualForm.title);

  const selectedSkillsList = manualForm.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const selectedReqsList = manualForm.requirements
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const toggleSkill = (skillName: string) => {
    const current = manualForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const index = current.findIndex((s) => s.toLowerCase() === skillName.toLowerCase());

    let updated: string[];
    if (index >= 0) {
      updated = current.filter((_, idx) => idx !== index);
    } else {
      updated = [...current, skillName];
    }
    setManualForm((prev) => ({
      ...prev,
      skills: updated.join(", "),
    }));
  };

  const toggleRequirement = (reqText: string) => {
    const current = manualForm.requirements
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const index = current.findIndex((r) => r.toLowerCase() === reqText.toLowerCase());

    let updated: string[];
    if (index >= 0) {
      updated = current.filter((_, idx) => idx !== index);
    } else {
      updated = [...current, reqText];
    }
    setManualForm((prev) => ({
      ...prev,
      requirements: updated.join(", "),
    }));
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      toast.error("Please enter a valid job URL");
      return;
    }

    try {
      await submitListing({
        type: "url",
        sourceUrl: urlInput.trim(),
      });
      setUrlInput("");
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to submit lead. Please try again.");
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.title || !manualForm.company) {
      toast.error("Please provide at least the position title and company name");
      return;
    }

    const skillsArray = manualForm.skills.trim()
      ? manualForm.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : manualForm.requirements.trim()
      ? manualForm.requirements.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const requirementsStr = manualForm.requirements.trim() || manualForm.skills.trim();

    try {
      await submitListing({
        type: "manual",
        company: manualForm.company.trim(),
        title: manualForm.title.trim(),
        description: manualForm.description.trim(),
        location: manualForm.location.trim(),
        // workMode: manualForm.workMode,
        internshipType: manualForm.internshipType,
        startPeriod: manualForm.startPeriod || undefined,
        endPeriod: manualForm.endPeriod || undefined,
        deadline: manualForm.deadline || undefined,
        requirements: requirementsStr,
        skills: skillsArray,
        applicationUrl: manualForm.applicationUrl.trim() || undefined,
      });
      setManualForm({
        title: "",
        company: "",
        description: "",
        location: "",
        // workMode: "onsite",
        internshipType: "SIWES",
        startPeriod: "",
        endPeriod: "",
        deadline: "",
        requirements: "",
        skills: "",
        applicationUrl: "",
      });
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || "Failed to submit listing. Please try again.");
    }
  };

  const submissions = submissionsData?.items || [];
  const pagination = submissionsData?.pagination;

  const columns: Column<ListingSubmission>[] = [
    {
      key: "title",
      header: "Opportunity Title",
      render: (item) => {
        const title =
          item.extractedData?.title ||
          item.manualData?.title ||
          (item.sourceUrl ? item.sourceUrl.replace(/^https?:\/\//, "").slice(0, 32) + "..." : "Submitted Lead");
        const company = item.extractedData?.companyName || item.manualData?.companyName || "Unknown Company";

        return (
          <div className="space-y-0.5">
            <p className="font-bold text-white line-clamp-1">{title}</p>
            <p className="text-xs text-slate-400">{company}</p>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-[11px] font-semibold text-slate-300">
          {item.type === "url" ? "Web Link" : "Manual Form"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Extraction / Review Status",
      render: (item) => (
        <div className="space-y-1">
          <StatusBadge status={item.status} size="sm" />
          {item.adminNote && (
            <p className="text-[11px] text-rose-300 font-medium max-w-xs">{item.adminNote}</p>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date Submitted",
      render: (item) => (
        <span className="text-xs text-slate-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Submit an Internship Lead
        </h1>
        <p className="text-xs lg:text-sm text-slate-400 mt-1">
          Found an industrial training or SIWES opening elsewhere? Submit it to help fellow students. Our AI crawler extracts details automatically.
        </p>
      </div>

      {/* Submission Form Card */}
      <div className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
        {/* Toggle Mode */}
        <div className="flex items-center gap-2 p-1 bg-[#0F172A] border border-slate-800 rounded-xl w-fit mb-6">
          <button
            type="button"
            onClick={() => setSubmissionType("url")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              submissionType === "url"
                ? "bg-[#F3A712] text-[#0B1120] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>URL Web Scraper (Fast)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubmissionType("manual")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              submissionType === "manual"
                ? "bg-[#F3A712] text-[#0B1120] shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Manual Form Entry</span>
          </button>
        </div>

        {/* URL Scraper Mode */}
        {submissionType === "url" ? (
          <form onSubmit={handleUrlSubmit} className="space-y-4 max-w-2xl">
            <div className="p-4 bg-[#0F172A]/80 border border-slate-700/80 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
              <Sparkles className="w-5 h-5 text-[#F3A712] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">AI Web Intelligence Crawler:</span>
                <p className="mt-0.5 text-slate-400">
                  Paste any job opening link (LinkedIn, Twitter, company career portals). Our crawler automatically extracts the job title, company, requirements, and deadline for review.
                </p>
              </div>
            </div>

            <Input
              label="Opportunity Web Link / URL"
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://company.com/careers/internship-2026..."
              icon={<Link2 className="w-4 h-4" />}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Extract & Submit Lead</span>
            </button>
          </form>
        ) : (
          /* Manual Entry Mode */
          <form onSubmit={handleManualSubmit} className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Position / Role Title"
                required
                value={manualForm.title}
                onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
                placeholder="e.g. Frontend Developer Intern"
              />
              <Input
                label="Company Name"
                required
                value={manualForm.company}
                onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
                placeholder="e.g. Example Technologies"
              />
            </div>

            <Textarea
              label="Job Description & Summary"
              rows={3}
              value={manualForm.description}
              onChange={(e) => setManualForm({ ...manualForm, description: e.target.value })}
              placeholder="Provide a short description of the internship opportunity..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location / State"
                value={manualForm.location}
                onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                placeholder="e.g. Lagos, Abuja, Port Harcourt"
                icon={<MapPin className="w-4 h-4" />}
              />
              <Select
                label="Internship Type"
                value={manualForm.internshipType}
                onChange={(e) => setManualForm({ ...manualForm, internshipType: e.target.value })}
                options={[
                  { value: "SIWES", label: "SIWES" },
                  { value: "3-Month SIWES", label: "3-Month SIWES" },
                  { value: "6-Month SIWES", label: "6-Month SIWES" },
                  { value: "1-Year IT", label: "1-Year IT" },
                  { value: "Direct Internship", label: "Direct Internship" },
                ]}
              />
              {/* Work Mode - Commented out for now, will be added later
              <Select
                label="Work Mode"
                value={manualForm.workMode}
                onChange={(e) => setManualForm({ ...manualForm, workMode: e.target.value })}
                options={[
                  { value: "onsite", label: "Onsite" },
                  { value: "remote", label: "Remote" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
              />
              */}
            </div>

            {/* Requirements with Click-to-add Suggestions */}
            <div className="space-y-2">
              <Input
                label="Requirements"
                value={manualForm.requirements}
                onChange={(e) => setManualForm({ ...manualForm, requirements: e.target.value })}
                placeholder="e.g. React, JavaScript, Git (or click suggestions below)"
              />
              <div className="p-3 bg-[#0F172A]/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Sparkles className="w-3 h-3 text-[#F3A712]" />
                  <span>Suggested Requirements (click to add/remove or type manually above):</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {suggestions.requirements.map((req) => {
                    const isSelected = selectedReqsList.some(
                      (r) => r.toLowerCase() === req.toLowerCase()
                    );
                    return (
                      <button
                        key={req}
                        type="button"
                        onClick={() => toggleRequirement(req)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F3A712]/20 text-[#F3A712] border-[#F3A712]/50 shadow-sm"
                            : "bg-slate-800/80 text-slate-300 border-slate-700/70 hover:border-slate-500 hover:text-white"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3 h-3 text-[#F3A712]" />
                        ) : (
                          <Plus className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{req}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Skills with Click-to-add Suggestions */}
            <div className="space-y-2">
              <Input
                label="Skills (Comma-separated)"
                value={manualForm.skills}
                onChange={(e) => setManualForm({ ...manualForm, skills: e.target.value })}
                placeholder="e.g. React, JavaScript, Git (or click suggestions below)"
              />
              <div className="p-3 bg-[#0F172A]/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Sparkles className="w-3 h-3 text-[#F3A712]" />
                  <span>Suggested Skills for role (click to add/remove or type manually above):</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {suggestions.skills.map((skill) => {
                    const isSelected = selectedSkillsList.some(
                      (s) => s.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F3A712]/20 text-[#F3A712] border-[#F3A712]/50 shadow-sm"
                            : "bg-slate-800/80 text-slate-300 border-slate-700/70 hover:border-slate-500 hover:text-white"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3 h-3 text-[#F3A712]" />
                        ) : (
                          <Plus className="w-3 h-3 text-slate-400" />
                        )}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Start Period"
                type="date"
                value={manualForm.startPeriod}
                onChange={(e) => setManualForm({ ...manualForm, startPeriod: e.target.value })}
              />
              <Input
                label="End Period"
                type="date"
                value={manualForm.endPeriod}
                onChange={(e) => setManualForm({ ...manualForm, endPeriod: e.target.value })}
              />
              <Input
                label="Application Deadline"
                type="date"
                value={manualForm.deadline}
                onChange={(e) => setManualForm({ ...manualForm, deadline: e.target.value })}
              />
            </div>

            <Input
              label="External Application Link (Optional)"
              type="url"
              value={manualForm.applicationUrl}
              onChange={(e) => setManualForm({ ...manualForm, applicationUrl: e.target.value })}
              placeholder="https://example.com/apply"
              icon={<Link2 className="w-4 h-4" />}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#F3A712] hover:bg-[#F3A712]/90 text-[#0B1120] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-[2px_2px_0px_0px_#FFFFFF] flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Opportunity</span>
            </button>
          </form>
        )}
      </div>

      {/* Submissions History Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              My Submitted Opportunities
            </h3>
            <p className="text-xs text-slate-400">
              Live updates as our crawler extracts and administrators approve your submissions into listings.
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={submissions}
          keyExtractor={(item) => item._id}
          isLoading={isLoadingSubmissions}
          emptyTitle="No submissions yet"
          emptyDescription="When you submit an internship URL or manual lead, it will appear here for tracking."
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Lead Submitted Successfully!"
        message="Thank you for contributing! Our crawler has queued your submission for processing and verification."
        actionLabel="Done"
      />
    </div>
  );
}
