"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, AlertCircle, TrendingUp, Scale, Clock,
    ShieldCheck, FileText, Send, Loader2, ChevronRight,
    AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ── TYPES ────────────────────────────────────────────────────────────────────
interface AnalysisResult {
    analysisTitle: string;
    analysisLaws: string;
    rights: string[];
    steps: string[];
    outcome: string;
    successRate: number;
    poweredBy: string;
}

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const HISTORY_CARDS = [
    { title: "My employer has not paid salary for 2 months", label: "Labour Rights", date: "Today" },
    { title: "My landlord refuses to return deposit", label: "Property Issue", date: "Yesterday" },
    { title: "I received a fake legal notice", label: "Consumer Protection", date: "12 Oct" },
    { title: "My company bond is forcing me to pay money", label: "Employment Contract", date: "05 Oct" },
];

const CHIPS_EN = ["Salary Not Paid", "Rental Dispute", "Fake Legal Notice", "Workplace Harassment", "Consumer Fraud"];
const CHIPS_HI = ["वेतन नहीं मिला", "किराया विवाद", "फर्जी नोटिस", "कार्यस्थल उत्पीड़न", "उपभोक्ता धोखाधड़ी"];

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function SituationPage() {
    const { lang, t } = useLanguage();
    const [activeCard, setActiveCard] = useState(0);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");
    const resultRef = useRef<HTMLDivElement>(null);

    const chips = lang === "HI" ? CHIPS_HI : CHIPS_EN;

    const analyse = async () => {
        const text = query.trim();
        if (!text) return;
        setLoading(true);
        setResult(null);
        setError("");
        try {
            const res = await fetch("http://localhost:8081/api/v1/analyse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    situation: text,
                    language: lang === "HI" ? "HI" : "EN",
                }),
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data: AnalysisResult = await res.json();
            setResult(data);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            setError(
                msg.includes("fetch")
                    ? "Cannot reach backend. Make sure Spring Boot is running on port 8081."
                    : msg
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChip = (chip: string) => {
        setQuery(chip);
        setResult(null);
        setError("");
    };

    const handleHistoryCard = (idx: number) => {
        setActiveCard(idx);
        setQuery(HISTORY_CARDS[idx].title);
        setResult(null);
        setError("");
    };

    return (
        <main className="pt-[80px] md:pt-[100px] min-h-screen bg-[#050505] text-[#F5F1EC] font-sans flex flex-col lg:flex-row relative overflow-hidden">

            {/* ── BACKGROUND ── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-[#C9A45C]/5 rounded-full blur-[120px]" />
                <Image
                    src="/verdex-hero.png"
                    alt="Lady Justice Background"
                    fill
                    className="object-cover opacity-5 mix-blend-screen scale-110 translate-x-[20%]"
                />
            </div>

            {/* ── LEFT SIDEBAR ── */}
            <div className="w-full lg:w-[35%] border-r border-[#C9A45C]/20 bg-[#050505]/60 backdrop-blur-3xl z-10 flex flex-col h-auto lg:h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
                <div className="p-8 lg:p-10 flex flex-col h-full">

                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-8 h-[1px] bg-[#C9A45C]" />
                        <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">
                            {lang === "HI" ? "केस इतिहास" : "LEGAL CASE HISTORY"}
                        </span>
                    </div>

                    <div className="space-y-4 flex-1">
                        {HISTORY_CARDS.map((card, idx) => (
                            <motion.div
                                key={idx}
                                onClick={() => handleHistoryCard(idx)}
                                className={`p-6 rounded-[20px] border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                                    activeCard === idx
                                        ? "border-[#C9A45C] bg-gradient-to-r from-[#3B2B28]/60 to-[#161314]"
                                        : "border-[#C9A45C]/20 bg-[#161314]/80 hover:bg-[#3B2B28]/40 hover:border-[#C9A45C]/40"
                                }`}
                            >
                                {activeCard === idx && (
                                    <motion.div layoutId="leftActiveBorder" className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C9A45C]" />
                                )}
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[#C9A45C] font-semibold text-xs uppercase tracking-wider">{card.label}</span>
                                    <span className="text-[#F5F1EC]/40 text-xs font-light">{card.date}</span>
                                </div>
                                <h3 className={`font-serif text-base leading-snug ${activeCard === idx ? "text-[#F5F1EC]" : "text-[#F5F1EC]/70"}`}>
                                    &quot;{card.title}&quot;
                                </h3>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 rounded-[20px] bg-gradient-to-b from-[#3B2B28]/40 to-[#161314] border border-[#C9A45C]/20 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A45C]/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3" />
                        <h4 className="text-[#F5F1EC] font-serif text-xl mb-4 relative z-10">
                            {lang === "HI" ? "तत्काल मदद चाहिए?" : "Need urgent help?"}
                        </h4>
                        <button className="px-6 py-3 rounded-full border border-[#C9A45C]/50 text-[#C9A45C] font-bold tracking-widest uppercase text-xs hover:bg-[#C9A45C] hover:text-[#050505] transition-colors relative z-10 w-full">
                            {lang === "HI" ? "कानूनी सहायता खोजें" : "Find Legal Aid"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── RIGHT MAIN CONTENT ── */}
            <div className="w-full lg:w-[65%] z-10 h-auto lg:h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
                <div className="p-8 lg:p-16 max-w-4xl mx-auto">

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                        {/* Header */}
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-8 h-[1px] bg-[#C9A45C]" />
                            <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">
                                {lang === "HI" ? "मेरी स्थिति समझाएं" : "EXPLAIN MY SITUATION"}
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black mb-4 font-serif leading-tight">
                            {lang === "HI" ? "हमें बताएं क्या हुआ।" : "Tell us what happened."}
                        </h1>
                        <p className="text-[rgba(245,241,236,0.72)] font-light text-lg lg:text-xl mb-12 leading-relaxed max-w-2xl">
                            {lang === "HI"
                                ? "अपनी कानूनी समस्या अपने शब्दों में बताएं। VERDEX आपके अधिकार, लागू कानून और अगले कदम बताएगा।"
                                : "Describe your legal issue in your own words. VERDEX will identify your rights, the law involved, and the next steps you can take."}
                        </p>

                        {/* Input Area */}
                        <div className="relative mb-8 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#76422B]/20 to-[#C9A45C]/20 rounded-[30px] opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                            <div className="relative bg-gradient-to-br from-[#3B2B28]/60 to-[#161314] border border-[#C9A45C]/20 focus-within:border-[#C9A45C] rounded-[28px] overflow-hidden transition-colors flex flex-col">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) analyse(); }}
                                    className="w-full h-[160px] bg-transparent resize-none outline-none p-6 text-lg text-[#F5F1EC] placeholder:text-[#F5F1EC]/30 font-light"
                                    placeholder={lang === "HI"
                                        ? "उदाहरण: मेरे नियोक्ता ने पिछले 2 महीने से वेतन नहीं दिया।"
                                        : "Example: My employer has not paid my salary for the last 2 months."}
                                />
                                <div className="p-4 bg-[#161314]/50 border-t border-[#C9A45C]/10 flex items-center justify-end space-x-3 backdrop-blur-md">
                                    <button className="h-10 w-10 shrink-0 rounded-full bg-[#3B2B28] flex items-center justify-center hover:bg-[#76422B] transition-colors border border-[#C9A45C]/20">
                                        <Mic className="h-4 w-4 text-[#C9A45C]" />
                                    </button>
                                    <button
                                        onClick={analyse}
                                        disabled={loading || !query.trim()}
                                        className="h-10 px-8 rounded-full bg-[#C9A45C] hover:bg-[#C9A45C]/90 disabled:bg-[#C9A45C]/30 disabled:cursor-not-allowed text-[#050505] font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(201,164,92,0.3)] flex items-center gap-2"
                                    >
                                        {loading
                                            ? <><Loader2 className="h-4 w-4 animate-spin" />{lang === "HI" ? "विश्लेषण हो रहा है..." : "Analysing..."}</>
                                            : <><Send className="h-4 w-4" />{lang === "HI" ? "विश्लेषण करें" : "Analyze Situation"}</>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chips */}
                        <div className="flex flex-wrap gap-3 mb-12">
                            {chips.map((chip, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleChip(chip)}
                                    className="px-5 py-2 rounded-full border border-[#3B2B28] bg-transparent text-[#C9A45C] text-sm hover:bg-[#C9A45C] hover:text-[#050505] hover:border-[#C9A45C] transition-all font-medium"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── ERROR ── */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="mb-8 flex items-start gap-3 p-5 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-300"
                            >
                                <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── LOADING SKELETON ── */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 rounded-2xl bg-[#161314] border border-[#C9A45C]/10 animate-pulse" />
                                ))}
                                <p className="text-center text-[#C9A45C]/60 text-sm tracking-widest uppercase animate-pulse pt-2">
                                    {lang === "HI" ? "Groq LLaMA द्वारा विश्लेषण हो रहा है..." : "Analysing with Groq LLaMA 3.3 70B..."}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── RESULT CARD ── */}
                    <AnimatePresence>
                        {result && !loading && (
                            <motion.div
                                ref={resultRef}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#C9A45C]/10 rounded-[32px] blur-[80px] pointer-events-none" />

                                <div className="relative bg-gradient-to-br from-[#161314] to-[#3B2B28]/40 border border-[#C9A45C]/20 rounded-[32px] p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">

                                    <Scale className="absolute -right-8 -bottom-8 w-64 h-64 text-[#C9A45C] opacity-5 pointer-events-none -rotate-12" />

                                    {/* Badge row */}
                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        <div className="flex items-center space-x-3">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A45C] opacity-75" />
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C9A45C]" />
                                            </span>
                                            <span className="text-[rgba(245,241,236,0.72)] font-bold tracking-widest uppercase text-xs">
                                                {lang === "HI" ? "कानूनी संक्षिप्त विवरण" : "LEGAL BRIEF"}
                                            </span>
                                        </div>
                                        <div className="px-3 py-1 bg-red-900/20 border border-red-500/30 rounded-sm text-red-400 font-bold tracking-widest text-[10px] flex items-center uppercase">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {lang === "HI" ? "उच्च प्राथमिकता" : "HIGH PRIORITY"}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#F5F1EC] mb-10 leading-snug relative z-10 max-w-xl">
                                        {result.analysisTitle}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">

                                        {/* Left — Laws + Rights */}
                                        <div className="space-y-10">
                                            <div>
                                                <h4 className="text-[#C9A45C] font-bold tracking-widest uppercase text-xs mb-4">
                                                    {lang === "HI" ? "अनुभाग 1 — कानून की पहचान" : "SECTION 1 — LAW IDENTIFIED"}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.analysisLaws?.split("·").map((law, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-sm border border-[#C9A45C]/30 bg-[#3B2B28]/50 text-[#F5F1EC]/90 text-xs shadow-sm">
                                                            {law.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-[#C9A45C] font-bold tracking-widest uppercase text-xs mb-4">
                                                    {lang === "HI" ? "अनुभाग 2 — आपके अधिकार" : "SECTION 2 — YOUR RIGHTS"}
                                                </h4>
                                                <ul className="space-y-4">
                                                    {result.rights?.map((right, i) => (
                                                        <li key={i} className="flex items-start space-x-3 text-[rgba(245,241,236,0.72)]">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C9A45C]/10 border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] font-bold text-xs">
                                                                {i + 1}
                                                            </span>
                                                            <span className="text-sm pt-0.5 leading-relaxed">{right}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Right — Steps */}
                                        <div>
                                            <h4 className="text-[#C9A45C] font-bold tracking-widest uppercase text-xs mb-4">
                                                {lang === "HI" ? "अनुभाग 3 — अगले कदम" : "SECTION 3 — NEXT STEPS"}
                                            </h4>
                                            <div className="relative pl-4 space-y-6 border-l border-[#C9A45C]/20 mt-2">
                                                {result.steps?.map((step, i) => (
                                                    <div key={i} className="relative">
                                                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C9A45C] shadow-[0_0_10px_rgba(201,164,92,0.8)]" />
                                                        <div className="flex items-start space-x-3 pl-2">
                                                            <div className="p-2 rounded-md bg-[#3B2B28]/50 border border-[#C9A45C]/10 text-[#C9A45C] shrink-0">
                                                                {i === 0 ? <FileText className="w-4 h-4" /> : i === 1 ? <ShieldCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                            </div>
                                                            <p className="text-[rgba(245,241,236,0.80)] text-sm leading-relaxed pt-1">{step}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {result.outcome && (
                                                <div className="mt-8 p-5 rounded-2xl bg-[#050505]/60 border border-[#C9A45C]/10">
                                                    <h4 className="text-[#C9A45C] font-bold tracking-widest uppercase text-xs mb-3">
                                                        {lang === "HI" ? "संभावित परिणाम" : "EXPECTED OUTCOME"}
                                                    </h4>
                                                    <p className="text-[rgba(245,241,236,0.72)] text-sm leading-relaxed">{result.outcome}</p>
                                                    {result.successRate > 0 && (
                                                        <div className="mt-4">
                                                            <div className="h-1.5 bg-[#3B2B28] rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${result.successRate}%` }}
                                                                    transition={{ duration: 1, delay: 0.3 }}
                                                                    className="h-full bg-[#C9A45C] rounded-full"
                                                                />
                                                            </div>
                                                            <p className="text-[#C9A45C] text-xs font-bold mt-2">{result.successRate}% {lang === "HI" ? "सफलता दर" : "Success Rate"}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer actions */}
                                    <div className="mt-12 pt-8 border-t border-[#C9A45C]/10 flex flex-col sm:flex-row gap-4 relative z-10">
                                        <button className="flex-1 bg-[#C9A45C] hover:bg-[#C9A45C]/90 text-[#050505] py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(201,164,92,0.2)]">
                                            {lang === "HI" ? "कानूनी नोटिस बनाएं" : "Generate Legal Notice"}
                                        </button>
                                        <button className="flex-1 bg-transparent hover:bg-white/5 border border-[#C9A45C] text-[#C9A45C] py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-colors">
                                            {lang === "HI" ? "कानूनी संक्षेप डाउनलोड करें" : "Download Legal Brief"}
                                        </button>
                                    </div>

                                    <p className="mt-4 text-center text-[#C9A45C]/40 text-xs tracking-widest">
                                        {result.poweredBy || "Powered by Groq LLaMA 3.3 70B"}
                                    </p>
                                </div>

                                {result.successRate > 0 && (
                                    <div className="mt-6 flex items-center justify-center space-x-3 p-4 rounded-[16px] border border-[#C9A45C]/20 bg-[#161314]/60 backdrop-blur-md">
                                        <TrendingUp className="w-5 h-5 text-[#C9A45C]" />
                                        <span className="text-[#F5F1EC] text-sm font-medium tracking-wide">
                                            <strong className="text-[#C9A45C]">{result.successRate}%</strong>{" "}
                                            {lang === "HI"
                                                ? "इसी तरह के मामले कानूनी नोटिस के बाद 45 दिनों के भीतर सुलझ जाते हैं।"
                                                : "of similar disputes are resolved after a legal notice within 45 days."}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── DEFAULT STATE ── */}
                    {!result && !loading && !error && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative opacity-40 pointer-events-none select-none"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#C9A45C]/5 rounded-[32px] blur-[80px]" />
                            <div className="relative bg-gradient-to-br from-[#161314] to-[#3B2B28]/40 border border-[#C9A45C]/10 rounded-[32px] p-8 lg:p-10">
                                <Scale className="absolute -right-8 -bottom-8 w-64 h-64 text-[#C9A45C] opacity-5 -rotate-12" />
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center space-x-3">
                                        <span className="w-3 h-3 rounded-full bg-[#C9A45C]/40" />
                                        <span className="text-[#F5F1EC]/40 font-bold tracking-widest uppercase text-xs">LEGAL BRIEF</span>
                                    </div>
                                    <div className="px-3 py-1 bg-red-900/10 border border-red-500/10 rounded-sm text-red-400/40 font-bold tracking-widest text-[10px] flex items-center uppercase">
                                        <AlertCircle className="w-3 h-3 mr-1" /> AWAITING INPUT
                                    </div>
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#F5F1EC]/30 mb-6">
                                    {lang === "HI" ? "अपनी स्थिति ऊपर दर्ज करें।" : "Enter your situation above to see the analysis here."}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-20 rounded-2xl bg-[#C9A45C]/5 border border-[#C9A45C]/5" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </main>
    );
}
