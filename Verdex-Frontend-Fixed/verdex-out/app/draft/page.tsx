"use client";

import { motion } from "framer-motion";
import { Download, Copy, Edit3, Share2, TrendingUp, CheckCircle, Scale, Lock, AlertCircle, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const PARTICLES = [
    { top: "8%",  left: "12%" }, { top: "15%", left: "72%" },
    { top: "23%", left: "38%" }, { top: "31%", left: "88%" },
    { top: "44%", left: "5%"  }, { top: "52%", left: "55%" },
    { top: "61%", left: "20%" }, { top: "67%", left: "80%" },
    { top: "74%", left: "45%" }, { top: "82%", left: "30%" },
    { top: "88%", left: "65%" }, { top: "94%", left: "10%" },
];

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

type FieldConfig = {
    label: string;
    placeholder: string;
    type: "text" | "textarea";
    span: 1 | 2;
};

const SCHEMAS: Record<string, FieldConfig[]> = {
    "Salary Notice": [
        { label: "Full Name", placeholder: "Applicant Name", type: "text", span: 1 },
        { label: "Employer Name", placeholder: "Company Name", type: "text", span: 1 },
        { label: "Job Role", placeholder: "Designation", type: "text", span: 1 },
        { label: "Joining Date", placeholder: "Date of joining", type: "text", span: 1 },
        { label: "Unpaid Months", placeholder: "e.g. Jan & Feb 2024", type: "text", span: 1 },
        { label: "Amount", placeholder: "Total unpaid amount", type: "text", span: 1 },
        { label: "Issue Description", placeholder: "Describe the issue...", type: "textarea", span: 2 },
    ],
    "Tenant Notice": [
        { label: "Tenant Name", placeholder: "Tenant Name", type: "text", span: 1 },
        { label: "Landlord Name", placeholder: "Landlord Name", type: "text", span: 1 },
        { label: "Property Address", placeholder: "Full property address", type: "text", span: 2 },
        { label: "Agreement Date", placeholder: "Date of agreement", type: "text", span: 2 },
        { label: "Issue", placeholder: "E.g., Unpaid rent... ", type: "textarea", span: 2 },
    ],
    "Consumer Complaint": [
        { label: "Customer Name", placeholder: "Customer Name", type: "text", span: 1 },
        { label: "Company Name", placeholder: "Company Name", type: "text", span: 1 },
        { label: "Product/Service", placeholder: "Product/Service", type: "text", span: 1 },
        { label: "Purchase Date", placeholder: "Purchase Date", type: "text", span: 1 },
        { label: "Amount", placeholder: "Amount", type: "text", span: 2 },
        { label: "Issue Description", placeholder: "Describe the product defect or service issue...", type: "textarea", span: 2 },
    ],
    "FIR Draft": [
        { label: "Complainant Name", placeholder: "Complainant Name", type: "text", span: 1 },
        { label: "Incident Date", placeholder: "Incident Date", type: "text", span: 1 },
        { label: "Location", placeholder: "Location of Incident", type: "text", span: 2 },
        { label: "Accused", placeholder: "Leave blank if unknown", type: "text", span: 2 },
        { label: "Full Incident Description", placeholder: "Factual narrative...", type: "textarea", span: 2 },
    ],
    "RTI Application": [
        { label: "Applicant Name", placeholder: "Applicant Name", type: "text", span: 1 },
        { label: "Department", placeholder: "Public Authority", type: "text", span: 1 },
        { label: "Information Required", placeholder: "Specific files, notes, details...", type: "textarea", span: 2 },
        { label: "Address", placeholder: "Applicant Address", type: "textarea", span: 2 },
    ]
};

export default function DraftPage() {
    const { lang, t } = useLanguage();
    const [activeTab, setActiveTab]       = useState("Salary Notice");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError]               = useState<string | null>(null);
    const [draft, setDraft]               = useState<DraftResponse | null>(null);
    const [todayDate, setTodayDate]       = useState("");
    const [isEditing, setIsEditing]       = useState(false);
    const [editedText, setEditedText]     = useState("");
    const [isMounted, setIsMounted]       = useState(false);
    const [dynamicForm, setDynamicForm]   = useState<Record<string, string>>({});
    const textareaRef                     = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const d    = new Date();
        const dd   = String(d.getDate()).padStart(2, "0");
        const mm   = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        setTodayDate(`${dd}/${mm}/${yyyy}`);
        setIsMounted(true);
    }, []);

    // Tab labels — EN/HI
    const tabKeys = [
        { en: "Salary Notice",       hi: "वेतन नोटिस"         },
        { en: "Tenant Notice",       hi: "किरायेदार नोटिस"    },
        { en: "Consumer Complaint",  hi: "उपभोक्ता शिकायत"    },
        { en: "FIR Draft",           hi: "एफआईआर ड्राफ्ट"     },
        { en: "RTI Application",     hi: "आरटीआई आवेदन"       },
    ];

    const actionButtons = [
        { icon: Download, label: t("draft.btn.download"), action: handleDownload },
        { icon: Copy,     label: t("draft.btn.copy"),     action: handleCopy    },
        { icon: Edit3,    label: lang === "HI" ? "ड्राफ्ट संपादित करें" : "Edit Draft", action: handleEdit },
        { icon: Share2,   label: lang === "HI" ? "शेयर करें" : "Share", action: handleShare },
    ];

    const handleTabSwitch = (enTab: string) => {
        setActiveTab(enTab);
        setDraft(null);
        setError(null);
        setIsEditing(false);
        setDynamicForm({}); // Reset form for new tab
    }

    async function generateNotice(e: React.FormEvent) {
        e.preventDefault();
        setIsGenerating(true);
        setError(null);
        setDraft(null);
        setIsEditing(false);

        let mappedPayload = {
            noticeType: activeTab,
            yourName: "",
            oppositeParty: "",
            issueSummary: "",
            sinceWhen: "",
            amountInvolved: "",
            additionalNotes: "",
            language: lang === "HI" ? "HI" : "EN"
        };

        if (activeTab === "Salary Notice") {
            mappedPayload.yourName = dynamicForm["Full Name"] || "";
            mappedPayload.oppositeParty = dynamicForm["Employer Name"] || "";
            mappedPayload.sinceWhen = dynamicForm["Unpaid Months"] || "";
            mappedPayload.amountInvolved = dynamicForm["Amount"] || "";
            mappedPayload.additionalNotes = `Job Role: ${dynamicForm["Job Role"] || "N/A"}, Joining Date: ${dynamicForm["Joining Date"] || "N/A"}`;
            mappedPayload.issueSummary = dynamicForm["Issue Description"] || "";
        } else if (activeTab === "Tenant Notice") {
            mappedPayload.yourName = dynamicForm["Tenant Name"] || "";
            mappedPayload.oppositeParty = dynamicForm["Landlord Name"] || "";
            mappedPayload.sinceWhen = dynamicForm["Agreement Date"] || "";
            mappedPayload.amountInvolved = "";
            mappedPayload.additionalNotes = `Property Address: ${dynamicForm["Property Address"] || ""}`;
            mappedPayload.issueSummary = dynamicForm["Issue"] || "";
        } else if (activeTab === "Consumer Complaint") {
            mappedPayload.yourName = dynamicForm["Customer Name"] || "";
            mappedPayload.oppositeParty = dynamicForm["Company Name"] || "";
            mappedPayload.sinceWhen = dynamicForm["Purchase Date"] || "";
            mappedPayload.amountInvolved = dynamicForm["Amount"] || "";
            mappedPayload.additionalNotes = `Product/Service: ${dynamicForm["Product/Service"] || ""}`;
            mappedPayload.issueSummary = dynamicForm["Issue Description"] || "";
        } else if (activeTab === "FIR Draft") {
            mappedPayload.yourName = dynamicForm["Complainant Name"] || "";
            mappedPayload.oppositeParty = dynamicForm["Accused"] || "";
            mappedPayload.sinceWhen = dynamicForm["Incident Date"] || "";
            mappedPayload.amountInvolved = "";
            mappedPayload.additionalNotes = `Location: ${dynamicForm["Location"] || ""}`;
            mappedPayload.issueSummary = dynamicForm["Full Incident Description"] || "";
        } else if (activeTab === "RTI Application") {
            mappedPayload.yourName = dynamicForm["Applicant Name"] || "";
            mappedPayload.oppositeParty = dynamicForm["Department"] || "";
            mappedPayload.sinceWhen = dynamicForm["Address"] || "";
            mappedPayload.amountInvolved = "";
            mappedPayload.additionalNotes = "";
            mappedPayload.issueSummary = dynamicForm["Information Required"] || "";
        }

        try {
            const res = await fetch("http://localhost:8081/api/v1/draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mappedPayload),
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
            draft.registeredPostHeader, `Date: ${draft.dateFormatted}`, "",
            draft.recipientBlock, "", `Subject: ${draft.subject}`, "",
            isEditing ? editedText : draft.documentText,
        ].join("\n");
        const blob = new Blob([full], { type: "text/plain" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url;
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
            navigator.share({ title: `Legal Notice — ${activeTab}`, text: `${draft.subject}\n\n${isEditing ? editedText : draft.documentText}` });
        } else {
            handleCopy();
            alert("Copied to clipboard.");
        }
    }

    const paperHeading = "font-bold uppercase tracking-[0.18em] text-[10px] text-[#C9A45C] mb-1";

    const emptyStateContent = (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 pointer-events-none select-none h-full min-h-[400px]">
            <div className="w-20 h-20 mb-6 rounded-full bg-[#C9A45C]/10 border border-[#C9A45C]/20 flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#C9A45C]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-black/80 mb-2">
                {lang === "HI" ? "तैयार दस्तावेज़ यहाँ दिखेगा" : "Your Draft Will Appear Here"}
            </h3>
            <p className="text-sm text-black/50 max-w-xs leading-relaxed font-sans">
                {lang === "HI" 
                    ? "बाईं ओर दिए गए फ़ॉर्म को भरें और कानूनी दस्तावेज़ बनाने के लिए नीचे दिए गए बटन पर क्लिक करें।" 
                    : "Fill out the required details on the left to instantly generate a professionally formatted legal document."}
            </p>
        </div>
    );

    const generatedContent = draft && (
        <div className="font-serif leading-relaxed text-[15px] flex-1 relative z-10 text-black">
            <div className="flex justify-between items-end mb-10 border-b border-black/10 pb-7">
                <div className="space-y-0.5">
                    <p className={paperHeading}>{draft.registeredPostHeader}</p>
                    <p className="text-sm text-black/60 font-sans font-light">Date: {draft.dateFormatted}</p>
                </div>
            </div>
            <p className="mb-5 font-bold leading-7 text-sm whitespace-pre-line">{draft.recipientBlock}</p>
            <p className="mb-8 font-bold text-sm underline underline-offset-4 decoration-[#C9A45C] decoration-2">
                Subject: {draft.subject}
            </p>
            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full min-h-[400px] bg-transparent border border-[#C9A45C]/40 rounded-lg p-4 text-black font-serif text-sm outline-none focus:border-[#C9A45C] resize-y leading-7"
                />
            ) : (
                <div className="whitespace-pre-wrap text-justify leading-[1.9] text-sm">{editedText}</div>
            )}
            {draft.applicableLaws?.length > 0 && (
                <div className="mt-10 pt-6 border-t border-black/10">
                    <p className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#C9A45C] font-bold mb-3">
                        {lang === "HI" ? "उद्धृत लागू कानून" : "Applicable Laws Cited"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {draft.applicableLaws.map((law, i) => (
                            <span key={i} className="text-[10px] font-sans bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#3B2B28] px-3 py-1 rounded-full">
                                {law}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const currentSchema = SCHEMAS[activeTab] || SCHEMAS["Salary Notice"];

    return (
        <main className="pt-[80px] md:pt-[100px] h-screen bg-[#050505] text-[#F5F1EC] font-sans flex flex-col lg:flex-row relative overflow-hidden">

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

            {/* ── LEFT PANEL ── */}
            <div className="w-full lg:w-[38%] border-r border-[#C9A45C]/15 bg-[#050505]/90 backdrop-blur-3xl z-10 flex flex-col h-auto lg:h-[calc(100vh-100px)] shadow-[10px_0_40px_rgba(0,0,0,0.6)]">
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="p-8 lg:p-10 mx-auto w-full max-w-lg lg:max-w-none">

                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-5">
                            <div className="w-6 h-px bg-[#C9A45C]" />
                            <span className="text-[#C9A45C] font-bold tracking-[0.18em] uppercase text-[10px]">
                                {t("draft.badge")}
                            </span>
                        </div>

                        {/* Tabs */}
                        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 mt-2 pb-1">
                            {tabKeys.map((tab) => (
                                <button
                                    key={tab.en}
                                    onClick={() => handleTabSwitch(tab.en)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200 border ${
                                        activeTab === tab.en
                                            ? "bg-[#C9A45C] text-[#050505] border-[#C9A45C] shadow-[0_0_14px_rgba(201,164,92,0.25)]"
                                            : "bg-[#161314] text-[#F5F1EC]/50 border-[#C9A45C]/15 hover:border-[#C9A45C]/45 hover:text-[#F5F1EC]/80"
                                    }`}
                                >
                                    {lang === "HI" ? tab.hi : tab.en}
                                </button>
                            ))}
                        </div>

                        {/* Form */}
                        <div className="bg-gradient-to-br from-[#161314] to-[#3B2B28]/35 border border-[#C9A45C]/15 rounded-2xl p-7 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-28 h-28 bg-[#C9A45C]/4 rounded-full blur-[35px] -translate-y-1/2 translate-x-1/3" />
                            <form onSubmit={generateNotice} className="space-y-4 relative z-10 grid grid-cols-2 gap-x-4 gap-y-4">
                                {currentSchema.map((field, idx) => (
                                    <div key={idx} className={`space-y-1.5 ${field.span === 2 ? 'col-span-2' : 'col-span-1'}`}>
                                        <label className="text-[9px] text-[#C9A45C] uppercase tracking-[0.18em] font-bold block">
                                            {field.label}
                                        </label>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                value={dynamicForm[field.label] || ""}
                                                onChange={(e) => setDynamicForm({ ...dynamicForm, [field.label]: e.target.value })}
                                                required rows={3}
                                                placeholder={field.placeholder}
                                                className="w-full resize-none bg-[#050505]/60 border border-[#C9A45C]/15 focus:border-[#C9A45C]/60 rounded-xl px-4 py-3 text-[#F5F1EC] text-sm outline-none transition-all placeholder:text-[#F5F1EC]/20 focus:bg-[#3B2B28]/20"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={dynamicForm[field.label] || ""}
                                                onChange={(e) => setDynamicForm({ ...dynamicForm, [field.label]: e.target.value })}
                                                required
                                                placeholder={field.placeholder}
                                                className="w-full bg-[#050505]/60 border border-[#C9A45C]/15 focus:border-[#C9A45C]/60 rounded-xl px-4 py-3 text-[#F5F1EC] text-sm outline-none transition-all placeholder:text-[#F5F1EC]/20 focus:bg-[#3B2B28]/20"
                                            />
                                        )}
                                    </div>
                                ))}

                                {error && (
                                    <div className="col-span-2 flex items-center gap-2 text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3 mt-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sticky CTA */}
                <div className="flex-shrink-0 px-8 lg:px-10 py-5 border-t border-[#C9A45C]/10 bg-[#050505]/95 backdrop-blur-md space-y-3">
                    <button
                        onClick={(e) => generateNotice(e as unknown as React.FormEvent)}
                        disabled={isGenerating}
                        className="w-full bg-[#C9A45C] hover:bg-[#d4ae68] disabled:opacity-60 text-[#050505] py-3.5 rounded-xl font-black uppercase tracking-[0.15em] text-[11px] transition-all shadow-[0_4px_20px_rgba(201,164,92,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <><div className="w-4 h-4 border-2 border-[#050505]/40 border-t-[#050505] rounded-full animate-spin" />
                            {lang === "HI" ? "बन रहा है..." : "Generating..."}</>
                        ) : (
                            draft
                                ? (lang === "HI" ? "दोबारा बनाएं" : "Re-Generate Draft")
                                : t("draft.btn.generate")
                        )}
                    </button>
                    <button type="button" disabled
                        className="w-full bg-transparent border border-[#C9A45C]/25 text-[#C9A45C]/35 py-3 rounded-xl font-bold uppercase tracking-[0.15em] text-[11px] cursor-not-allowed">
                        {t("draft.btn.save")}
                    </button>
                    <div className="flex justify-center items-center gap-2 text-[#F5F1EC]/25 text-[10px] font-light pt-0.5">
                        <Lock className="w-3 h-3" />
                        <span>{t("draft.privacy")}</span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PREVIEW PANEL ── */}
            <div className="w-full lg:w-[62%] z-10 h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] overflow-hidden relative flex flex-col p-6 lg:p-10">
                <Scale className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] text-[#F5F1EC] opacity-[0.02] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex-1 flex w-full relative z-10 max-w-3xl mx-auto min-h-0"
                >
                    {/* Paper */}
                    <div className="flex-1 bg-[#F9F6EF] text-[#161314] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.75)] overflow-y-auto no-scrollbar relative flex flex-col px-10 py-12 lg:px-14 lg:py-14 border border-[#C9A45C]/20 h-full">
                        {isGenerating && (
                            <div className="absolute inset-0 bg-[#F9F6EF]/85 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center gap-5">
                                <div className="w-10 h-10 border-[3px] border-[#C9A45C]/30 border-t-[#C9A45C] rounded-full animate-spin" />
                                <div className="text-center">
                                    <p className="text-[#161314] font-bold font-serif text-base">
                                        {lang === "HI" ? "नोटिस बन रहा है..." : "Drafting your notice..."}
                                    </p>
                                    <p className="text-[#C9A45C] text-xs font-sans mt-1 tracking-wide">
                                        {lang === "HI" ? "भारतीय न्यायिक प्रारूप लागू हो रहा है" : "Applying Indian judiciary format & laws"}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                            isEditing ? "bg-blue-500/10 border-blue-500/30 text-blue-600" : "bg-[#5D8A66]/10 border-[#5D8A66]/35 text-[#5D8A66]"
                        }`}>
                            <CheckCircle className="w-3 h-3" />
                            {isEditing
                                ? (lang === "HI" ? "संपादित हो रहा है" : "Editing")
                                : (lang === "HI" ? "दाखिल करने के लिए तैयार" : "Ready to File")}
                        </div>
                        {draft ? generatedContent : emptyStateContent}
                    </div>

                    {/* Floating Toolbar */}
                    <div className="hidden lg:flex flex-col ml-5 space-y-3 pt-14">
                        {actionButtons.map((btn, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.08 }}
                                onClick={btn.action}
                                disabled={!draft && btn.label !== t("draft.btn.copy")}
                                className="group relative w-11 h-11 rounded-[13px] bg-[#3B2B28]/70 border border-[#C9A45C]/25 flex items-center justify-center hover:bg-[#161314] hover:border-[#C9A45C]/70 transition-all shadow-lg disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                                <btn.icon className="w-4 h-4 text-[#C9A45C]" />
                                <div className="absolute right-full mr-3 bg-[#C9A45C] text-[#050505] px-2.5 py-1.5 rounded-sm text-[9px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                    {btn.label}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom Strip */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-5 flex items-center gap-4 p-4 px-5 rounded-2xl border border-[#C9A45C]/20 bg-gradient-to-r from-[#161314] to-[#3B2B28]/25 backdrop-blur-md shadow-lg max-w-3xl mx-auto w-full z-10"
                >
                    <TrendingUp className="w-4 h-4 text-[#C9A45C] flex-shrink-0" />
                    <span className="text-[#F5F1EC]/70 text-xs font-light tracking-wide">
                        <strong className="text-[#C9A45C] font-semibold text-sm mr-1">91%</strong>
                        {t("draft.stat")}
                    </span>
                </motion.div>
            </div>
        </main>
    );
}

