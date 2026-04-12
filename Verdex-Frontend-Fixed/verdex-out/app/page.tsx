"use client";

import { motion } from "framer-motion";
import { Download, Copy, Edit3, Share2, TrendingUp, CheckCircle, Scale, Lock, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Hardcoded particles — fixes hydration error (no Math.random on server) ───
const PARTICLES = [
    { top: "8%",  left: "12%" }, { top: "15%", left: "72%" },
    { top: "23%", left: "38%" }, { top: "31%", left: "88%" },
    { top: "44%", left: "5%"  }, { top: "52%", left: "55%" },
    { top: "61%", left: "20%" }, { top: "67%", left: "80%" },
    { top: "74%", left: "45%" }, { top: "82%", left: "30%" },
    { top: "88%", left: "65%" }, { top: "94%", left: "10%" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────
interface DraftResponse {
    documentText: string;
    subject: string;
    applicableLaws: string[];
    registeredPostHeader: string;
    dateFormatted: string;
    noticeType: string;
    senderName: string;
    recipientBlock: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function DraftPage() {
    const [activeTab, setActiveTab]       = useState("Salary Notice");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError]               = useState<string | null>(null);
    const [draft, setDraft]               = useState<DraftResponse | null>(null);
    const [todayDate, setTodayDate]       = useState(""); // client-only — avoids hydration mismatch
    const [isEditing, setIsEditing]       = useState(false);
    const [editedText, setEditedText]     = useState("");
    const [isMounted, setIsMounted]       = useState(false); // particles only render client-side
    const textareaRef                     = useRef<HTMLTextAreaElement>(null);

    // Form state
    const [form, setForm] = useState({
        yourName:       "Rahul Sharma",
        oppositeParty:  "ABC Pvt. Ltd.",
        issueSummary:   "My employer has not paid my salary for the last 2 months.",
        sinceWhen:      "January 2024",
        amountInvolved: "₹40,000",
        additionalNotes: "",
    });

    // Set date only on client (DD/MM/YYYY — Indian format) + mark mounted for particles
    useEffect(() => {
        const d = new Date();
        const dd   = String(d.getDate()).padStart(2, "0");
        const mm   = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        setTodayDate(`${dd}/${mm}/${yyyy}`);
        setIsMounted(true);
    }, []);

    const tabs = [
        "Salary Notice",
        "Tenant Notice",
        "Consumer Complaint",
        "FIR Draft",
        "RTI Application",
    ];

    const actionButtons = [
        { icon: Download, label: "Download PDF", action: handleDownload },
        { icon: Copy,     label: "Copy Text",    action: handleCopy    },
        { icon: Edit3,    label: "Edit Draft",   action: handleEdit    },
        { icon: Share2,   label: "Share",        action: handleShare   },
    ];

    // ── Generate ──────────────────────────────────────────────────────────────
    async function generateNotice(e: React.FormEvent) {
        e.preventDefault();
        setIsGenerating(true);
        setError(null);
        setDraft(null);
        setIsEditing(false);

        try {
            const res = await fetch("http://localhost:8080/api/v1/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    noticeType:     activeTab,
                    yourName:       form.yourName,
                    oppositeParty:  form.oppositeParty,
                    issueSummary:   form.issueSummary,
                    sinceWhen:      form.sinceWhen,
                    amountInvolved: form.amountInvolved,
                    additionalNotes: form.additionalNotes,
                    language: "EN",
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${res.status}`);
            }

            const data: DraftResponse = await res.json();
            setDraft(data);
            setEditedText(data.documentText);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error occurred";
            setError(msg);
        } finally {
            setIsGenerating(false);
        }
    }

    // ── Action handlers ───────────────────────────────────────────────────────
    function handleCopy() {
        const text = isEditing ? editedText : (draft?.documentText ?? "");
        if (!text) return;
        navigator.clipboard.writeText(
            `${draft?.registeredPostHeader ?? "REGISTERED POST WITH A/D"}\nDate: ${draft?.dateFormatted ?? todayDate}\n\n${draft?.recipientBlock ?? ""}\n\nSubject: ${draft?.subject ?? ""}\n\n${text}`
        );
    }

    function handleDownload() {
        if (!draft) return;
        const full = [
            draft.registeredPostHeader,
            `Date: ${draft.dateFormatted}`,
            "",
            draft.recipientBlock,
            "",
            `Subject: ${draft.subject}`,
            "",
            isEditing ? editedText : draft.documentText,
        ].join("\n");

        const blob = new Blob([full], { type: "text/plain" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `VERDEX_${activeTab.replace(/\s+/g, "_")}_${draft.dateFormatted.replace(/\//g, "-")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleEdit() {
        if (!draft) return;
        setIsEditing((v) => !v);
        if (!isEditing && textareaRef.current) {
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }

    function handleShare() {
        if (!draft) return;
        if (navigator.share) {
            navigator.share({
                title: `Legal Notice — ${activeTab}`,
                text: `${draft.subject}\n\n${isEditing ? editedText : draft.documentText}`,
            });
        } else {
            handleCopy();
            alert("Copied to clipboard (Web Share not supported on this browser).");
        }
    }

    // ── Static placeholder shown before first generation ─────────────────────
    const placeholderContent = (
        <div className="font-serif leading-relaxed text-base pt-12 flex-1 relative z-10 font-[500] text-black">
            <div className="flex justify-between items-end mb-12 border-b-2 border-black/10 pb-8">
                <div className="space-y-1 text-sm font-sans tracking-wide">
                    <p className="font-bold uppercase tracking-widest text-[#C9A45C]">REGISTERED POST WITH A/D</p>
                    <p>Date: {todayDate}</p>
                </div>
            </div>

            <p className="mb-6 font-bold leading-normal">
                To,<br />
                The HR Manager,<br />
                ABC Pvt. Ltd.<br />
                [Company Address]
            </p>

            <p className="mb-10 font-bold underline underline-offset-4 decoration-2 decoration-[#C9A45C] block">
                Subject: Legal Notice for Non-Payment of Salary
            </p>

            <p className="mb-8">Dear Sir/Madam,</p>

            <p className="mb-6 indent-8 text-justify">
                Under instructions from and on behalf of my client <strong>Rahul Sharma</strong>, I serve you with the following legal notice:
            </p>

            <p className="mb-6 indent-8 text-justify bg-[#C9A45C]/10 p-4 rounded-sm border-l-4 border-[#C9A45C]">
                That this is to formally notify you that my client's salary for the months of January and February has not been paid despite repeated requests and written emails directed to your department.
            </p>

            <p className="mb-6 indent-8 text-justify">
                That your actions amount to a clear violation of the statutory obligations under the <strong>Payment of Wages Act, 1936</strong> and other relevant labour laws. My client has been subjected to immense monetary hardship due to this unlawful withholding of rightfully earned remuneration.
            </p>

            <p className="mb-6 indent-8 text-justify">
                You are hereby called upon to clear the outstanding amount of{" "}
                <strong className="text-red-800 bg-red-100 px-2 py-0.5 rounded-sm">₹40,000</strong>{" "}
                within <strong>7 days</strong> from the receipt of this notice.
            </p>

            <p className="mb-16 indent-8 text-justify">
                Please note that failure to comply shall compel my client to initiate appropriate civil and criminal proceedings before the competent court of law, entirely at your risk, cost, and consequence.
            </p>

            <div className="w-1/3 mb-6 border-b border-black" />
            <p className="font-bold">Rahul Sharma</p>
            <p className="text-sm font-sans text-black/60 italic">Complainant / Employee</p>
        </div>
    );

    // ── Generated document content ────────────────────────────────────────────
    const generatedContent = draft && (
        <div className="font-serif leading-relaxed text-base pt-12 flex-1 relative z-10 font-[500] text-black">
            {/* Header */}
            <div className="flex justify-between items-end mb-10 border-b-2 border-black/10 pb-8">
                <div className="space-y-1 text-sm font-sans tracking-wide">
                    <p className="font-bold uppercase tracking-widest text-[#C9A45C]">
                        {draft.registeredPostHeader}
                    </p>
                    <p>Date: {draft.dateFormatted}</p>
                </div>
            </div>

            {/* Recipient */}
            <p className="mb-6 font-bold leading-normal whitespace-pre-line">
                {draft.recipientBlock}
            </p>

            {/* Subject */}
            <p className="mb-8 font-bold underline underline-offset-4 decoration-2 decoration-[#C9A45C] block">
                Subject: {draft.subject}
            </p>

            {/* Body — editable or read-only */}
            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full min-h-[400px] bg-transparent border border-[#C9A45C]/40 rounded-lg p-4 text-black font-serif text-base outline-none focus:border-[#C9A45C] resize-y leading-relaxed"
                />
            ) : (
                <div className="whitespace-pre-wrap text-justify leading-loose">
                    {editedText}
                </div>
            )}

            {/* Applicable laws tags */}
            {draft.applicableLaws?.length > 0 && (
                <div className="mt-10 pt-6 border-t border-black/10">
                    <p className="text-xs font-sans uppercase tracking-widest text-[#C9A45C] font-bold mb-3">
                        Applicable Laws Cited
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {draft.applicableLaws.map((law, i) => (
                            <span
                                key={i}
                                className="text-[10px] font-sans bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#3B2B28] px-3 py-1 rounded-full"
                            >
                                {law}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <main className="pt-[80px] md:pt-[100px] h-screen bg-[#050505] text-[#F5F1EC] font-sans flex flex-col lg:flex-row relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-[#C9A45C]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] bg-[#3B2B28]/30 rounded-full blur-[150px]" />
                {isMounted && PARTICLES.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 0, opacity: 0.1 }}
                        animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-1 h-1 bg-[#C9A45C] rounded-full blur-[1px]"
                        style={{ top: p.top, left: p.left }}
                    />
                ))}
            </div>

            {/* ── Left Panel ── */}
            <div className="w-full lg:w-[35%] border-r border-[#C9A45C]/20 bg-[#050505]/80 backdrop-blur-3xl z-10 flex flex-col h-auto lg:h-[calc(100vh-100px)] overflow-y-auto no-scrollbar shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                <div className="p-8 lg:p-10 flex flex-col h-full mx-auto w-full max-w-lg lg:max-w-none">

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-[1px] bg-[#C9A45C]" />
                        <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">
                            LEGAL DOCUMENT GENERATOR
                        </span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black mb-4 font-serif leading-tight">
                        Create your legal notice.
                    </h1>
                    <p className="text-[rgba(245,241,236,0.72)] font-light text-sm mb-10 leading-relaxed">
                        VERDEX drafts ready-to-file legal notices, complaints, and applications based on your situation.
                    </p>

                    {/* Notice Type Tabs */}
                    <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-10 pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setDraft(null); setError(null); setIsEditing(false); }}
                                className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                                    activeTab === tab
                                        ? "bg-[#C9A45C] text-[#050505] border-[#C9A45C] shadow-[0_0_15px_rgba(201,164,92,0.3)]"
                                        : "bg-[#161314] text-[#F5F1EC]/60 border-[#C9A45C]/20 hover:border-[#C9A45C]/50 hover:text-[#F5F1EC]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Form Card */}
                    <div className="bg-gradient-to-br from-[#161314] to-[#3B2B28]/40 border border-[#C9A45C]/20 rounded-[28px] p-8 relative overflow-hidden shadow-2xl flex-shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A45C]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3" />

                        <form onSubmit={generateNotice} className="space-y-5 relative z-10 flex flex-col h-full">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-[#C9A45C] uppercase tracking-widest font-bold">Your Full Name</label>
                                    <input
                                        type="text"
                                        value={form.yourName}
                                        onChange={(e) => setForm({ ...form, yourName: e.target.value })}
                                        required
                                        className="w-full bg-[#050505]/50 border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-3.5 text-[#F5F1EC] text-sm outline-none transition-all focus:bg-[#3B2B28]/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-[#C9A45C] uppercase tracking-widest font-bold">Opposite Party</label>
                                    <input
                                        type="text"
                                        value={form.oppositeParty}
                                        onChange={(e) => setForm({ ...form, oppositeParty: e.target.value })}
                                        required
                                        className="w-full bg-[#050505]/50 border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-3.5 text-[#F5F1EC] text-sm outline-none transition-all focus:bg-[#3B2B28]/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-[#C9A45C] uppercase tracking-widest font-bold">Issue Summary</label>
                                <textarea
                                    value={form.issueSummary}
                                    onChange={(e) => setForm({ ...form, issueSummary: e.target.value })}
                                    required
                                    className="w-full h-[80px] resize-none bg-[#050505]/50 border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-3.5 text-[#F5F1EC] text-sm outline-none transition-all focus:bg-[#3B2B28]/20"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-[#C9A45C] uppercase tracking-widest font-bold">Since When?</label>
                                    <input
                                        type="text"
                                        value={form.sinceWhen}
                                        onChange={(e) => setForm({ ...form, sinceWhen: e.target.value })}
                                        className="w-full bg-[#050505]/50 border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-3.5 text-[#F5F1EC] text-sm outline-none transition-all focus:bg-[#3B2B28]/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-[#C9A45C] uppercase tracking-widest font-bold">Amount Involved</label>
                                    <input
                                        type="text"
                                        value={form.amountInvolved}
                                        onChange={(e) => setForm({ ...form, amountInvolved: e.target.value })}
                                        className="w-full bg-[#050505]/50 border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-3.5 text-[#F5F1EC] text-sm outline-none transition-all focus:bg-[#3B2B28]/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-[#C9A45C] uppercase tracking-widest font-bold">Additional Notes</label>
                                <input
                                    type="text"
                                    value={form.additionalNotes}
                                    onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                                    placeholder="Optional details..."
                                    className="w-full bg-[#050505]/50 border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-3.5 text-[#F5F1EC] text-sm outline-none transition-all focus:bg-[#3B2B28]/20"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center space-x-2 text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-[#C9A45C]/10 flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="w-full bg-[#C9A45C] hover:bg-[#C9A45C]/90 text-[#050505] py-4 rounded-[12px] font-black uppercase tracking-widest text-xs transition-all shadow-[0_4px_20px_rgba(201,164,92,0.2)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
                                >
                                    {isGenerating ? (
                                        <div className="w-5 h-5 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                                    ) : (draft ? "Re-Generate Draft" : "Generate Draft")}
                                </button>
                                <button
                                    type="button"
                                    disabled
                                    className="w-full bg-transparent border border-[#C9A45C]/40 text-[#C9A45C]/40 py-4 rounded-[12px] font-black uppercase tracking-widest text-xs cursor-not-allowed"
                                >
                                    Save Template
                                </button>
                            </div>

                            <div className="flex justify-center items-center mt-4 space-x-2 text-[#F5F1EC]/40 text-xs font-light">
                                <Lock className="w-3 h-3" />
                                <span>Your draft is private and never shared.</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── Right Preview Panel ── */}
            <div className="w-full lg:w-[65%] z-10 h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] overflow-hidden relative flex flex-col p-6 lg:p-12">

                <Scale className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-[#F5F1EC] opacity-[0.02] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 flex w-full relative z-10 max-w-4xl mx-auto"
                >
                    {/* Paper Preview */}
                    <div className="flex-1 bg-[#F5F1EC] text-[#161314] rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-y-auto no-scrollbar relative flex flex-col p-10 lg:p-16 border border-[#C9A45C]/30 h-full">

                        {/* Generating overlay */}
                        {isGenerating && (
                            <div className="absolute inset-0 bg-[#F5F1EC]/80 backdrop-blur-sm rounded-[20px] z-20 flex flex-col items-center justify-center space-y-6">
                                <div className="w-12 h-12 border-4 border-[#C9A45C] border-t-transparent rounded-full animate-spin" />
                                <div className="text-center">
                                    <p className="text-[#161314] font-bold font-serif text-lg">Drafting your notice...</p>
                                    <p className="text-[#C9A45C] text-sm font-sans mt-1">Applying Indian judiciary format & laws</p>
                                </div>
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className={`absolute top-8 right-8 flex items-center space-x-2 px-4 py-1.5 rounded-full border ${
                            isEditing
                                ? "bg-blue-500/10 border-blue-500/40 text-blue-600"
                                : "bg-[#5D8A66]/10 border-[#5D8A66]/40 text-[#5D8A66]"
                        }`}>
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-black tracking-widest">
                                {isEditing ? "EDITING" : "READY TO FILE"}
                            </span>
                        </div>

                        {draft ? generatedContent : placeholderContent}
                    </div>

                    {/* Floating Action Toolbar */}
                    <div className="hidden lg:flex flex-col ml-6 space-y-4 pt-16">
                        {actionButtons.map((btn, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                onClick={btn.action}
                                disabled={!draft && btn.label !== "Copy Text"}
                                className="group relative w-12 h-12 rounded-[14px] bg-[#3B2B28]/80 border border-[#C9A45C]/30 flex items-center justify-center hover:bg-[#161314] hover:border-[#C9A45C] transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <btn.icon className="w-5 h-5 text-[#C9A45C]" />
                                <div className="absolute right-full mr-4 bg-[#C9A45C] text-[#050505] px-3 py-1.5 rounded-sm text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {btn.label}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom Insight Strip */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-6 flex items-center justify-between p-4 px-6 rounded-[16px] border border-[#C9A45C]/30 bg-gradient-to-r from-[#161314] to-[#3B2B28]/30 backdrop-blur-md shadow-lg max-w-4xl mx-auto w-full z-10"
                >
                    <div className="flex items-center space-x-4">
                        <TrendingUp className="w-5 h-5 text-[#C9A45C]" />
                        <span className="text-[#F5F1EC] text-sm font-light tracking-wide">
                            <strong className="text-[#C9A45C] font-semibold text-base mr-1">91%</strong>
                            of unpaid salary disputes are resolved after sending a formal legal notice.
                        </span>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}