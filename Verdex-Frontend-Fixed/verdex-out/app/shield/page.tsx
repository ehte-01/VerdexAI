"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, ShieldAlert, AlertTriangle, ShieldCheck,
    ChevronDown, Download, Scale, Shield, Database,
    Loader2, XCircle, PenTool, UploadCloud, X
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface Clause {
    title: string;
    explanation: string;
    counter: string;
}

interface ShieldResult {
    riskScore: number;
    clauses: Clause[];
    error?: string;
}

// ── STATIC DATA ───────────────────────────────────────────────────────────────
const RECENT_DOCS = [
    { name: "Rental_Agreement.pdf", date: "Today, 10:45 AM", status: "Dangerous", color: "text-[#A94442]", borderColor: "border-[#A94442]" },
    { name: "Legal_Notice_Employer.pdf", date: "Yesterday", status: "Concerning", color: "text-[#C9A45C]", borderColor: "border-[#C9A45C]" },
    { name: "Employment_Bond.docx", date: "05 Oct, 2023", status: "Safe", color: "text-[#5D8A66]", borderColor: "border-[#5D8A66]" },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function ShieldPage() {
    const { lang } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ShieldResult | null>(null);
    const [error, setError] = useState("");
    const [expandedClause, setExpandedClause] = useState<number | null>(0);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleFile = useCallback((f: File) => {
        setFile(f);
        setResult(null);
        setError("");
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, [handleFile]);

    const analyse = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("language", lang === "HI" ? "HI" : "EN");

            const res = await fetch("http://verdexai.onrender.com/api/v1/analyse-document", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data: ShieldResult = await res.json();

            if (data.error) throw new Error(data.error);
            setResult(data);
            setExpandedClause(0);
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

    const getRiskLabel = (score: number) => {
        if (score >= 70) return { label: lang === "HI" ? "खतरनाक" : "DANGEROUS", color: "text-[#A94442]", border: "border-[#A94442]", bg: "bg-[#A94442]/20" };
        if (score >= 40) return { label: lang === "HI" ? "चिंताजनक" : "CONCERNING", color: "text-[#C9A45C]", border: "border-[#C9A45C]", bg: "bg-[#C9A45C]/20" };
        return { label: lang === "HI" ? "सुरक्षित" : "SAFE", color: "text-[#5D8A66]", border: "border-[#5D8A66]", bg: "bg-[#5D8A66]/20" };
    };

    const getClauseBadge = (idx: number) => {
        if (!result) return { badgeColor: "", borderLeft: "" };
        const score = result.riskScore;
        const half = Math.ceil(result.clauses.length / 2);
        if (score >= 70 && idx < half) return { badgeColor: "bg-[#A94442]/20 text-[#A94442] border-[#A94442]/30", borderLeft: "border-l-[#A94442]" };
        return { badgeColor: "bg-[#C9A45C]/20 text-[#C9A45C] border-[#C9A45C]/30", borderLeft: "border-l-[#C9A45C]" };
    };

    return (
        <main className="pt-[80px] md:pt-[100px] min-h-screen bg-[#050505] text-[#F5F1EC] font-sans flex flex-col lg:flex-row relative overflow-hidden">

            {/* ── BACKGROUND ── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[30%] -right-[10%] w-[800px] h-[800px] bg-[#C9A45C]/5 rounded-full blur-[150px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-[#3B2B28]/30 rounded-full blur-[150px]" />
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 0, opacity: 0.1 }}
                        animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-1 h-1 bg-[#C9A45C] rounded-full blur-[1px]"
                        style={{ top: `${15 + i * 10}%`, left: `${10 + i * 12}%` }}
                    />
                ))}
            </div>

            {/* ── LEFT UPLOAD PANEL ── */}
            <div className="w-full lg:w-[40%] border-r border-[#C9A45C]/20 bg-[#050505]/60 backdrop-blur-3xl z-10 flex flex-col h-auto lg:h-[calc(100vh-100px)] overflow-y-auto no-scrollbar shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                <div className="p-8 lg:p-12 flex flex-col h-full max-w-xl mx-auto w-full">

                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-8 h-[1px] bg-[#C9A45C]" />
                        <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">
                            {lang === "HI" ? "कानूनी दस्तावेज़ शील्ड" : "LEGAL DOCUMENT SHIELD"}
                        </span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black mb-4 font-serif leading-tight">
                        {lang === "HI" ? "अपने कानूनी दस्तावेज़ अपलोड करें।" : "Upload and analyze your legal documents."}
                    </h1>
                    <p className="text-[rgba(245,241,236,0.72)] font-light text-base mb-10 leading-relaxed">
                        {lang === "HI"
                            ? "VERDEX अनुबंधों, किराया समझौतों और कानूनी नोटिसों को स्कैन करता है।"
                            : "VERDEX scans contracts, rental agreements, legal notices, and documents to identify hidden risks and dangerous clauses."}
                    </p>

                    {/* Drop Zone */}
                    <div
                        className="relative group cursor-pointer mb-4"
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className={`absolute -inset-0.5 bg-[#C9A45C]/20 rounded-[34px] transition-opacity blur-md ${dragOver ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                        <div className={`relative bg-gradient-to-br from-[#3B2B28]/40 to-transparent border-2 border-dashed rounded-[32px] p-10 flex flex-col items-center justify-center text-center transition-all duration-500 overflow-hidden ${dragOver ? "border-[#C9A45C] bg-[#C9A45C]/5" : "border-[#C9A45C]/40 group-hover:border-[#C9A45C]/80"}`}>
                            <div className="w-20 h-20 mb-6 relative">
                                <div className="absolute inset-0 bg-[#C9A45C]/10 rounded-full blur-xl scale-150" />
                                <div className="w-full h-full bg-[#161314] border border-[#C9A45C]/30 rounded-2xl flex items-center justify-center relative z-10 shadow-xl">
                                    <FileText className="w-8 h-8 text-[#C9A45C]" />
                                    <ShieldAlert className="w-5 h-5 text-red-400 absolute -bottom-2 -right-2 bg-[#161314] rounded-full p-0.5 border border-[#C9A45C]/30" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-[#F5F1EC] mb-2 font-serif group-hover:text-[#C9A45C] transition-colors">
                                {lang === "HI" ? "यहाँ खींचें और छोड़ें" : "Drag & drop your legal document here"}
                            </h3>
                            <p className="text-[rgba(245,241,236,0.5)] font-light text-sm mb-6">
                                {lang === "HI" ? "या फ़ाइल ब्राउज़ करने के लिए क्लिक करें" : "or click to browse files"}
                            </p>
                            <div className="flex space-x-3 text-[10px] uppercase tracking-widest text-[#C9A45C]/60 font-bold">
                                <span>PDF</span><span>•</span><span>TXT</span>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.txt"
                            className="hidden"
                            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                        />
                    </div>

                    {/* Selected File */}
                    <AnimatePresence>
                        {file && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-[#161314] border border-[#C9A45C]/30 mb-4"
                            >
                                <FileText className="w-5 h-5 text-[#C9A45C] shrink-0" />
                                <span className="text-sm text-[#F5F1EC] flex-1 truncate">{file.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); setError(""); }}
                                    className="text-[#F5F1EC]/40 hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <button
                            onClick={analyse}
                            disabled={!file || loading}
                            className="flex-1 bg-[#C9A45C] hover:bg-[#C9A45C]/90 disabled:bg-[#C9A45C]/30 disabled:cursor-not-allowed text-[#050505] py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(201,164,92,0.2)] flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" />{lang === "HI" ? "स्कैन हो रहा है..." : "Scanning..."}</>
                                : <><UploadCloud className="w-4 h-4" />{lang === "HI" ? "दस्तावेज़ विश्लेषण करें" : "Analyse Document"}</>
                            }
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 bg-transparent hover:bg-white/5 border border-[#C9A45C] text-[#C9A45C] py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-colors"
                        >
                            {lang === "HI" ? "फ़ाइल चुनें" : "Browse File"}
                        </button>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-300"
                            >
                                <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Recent Docs */}
                    <div>
                        <h4 className="text-[#F5F1EC]/60 font-serif text-sm tracking-widest uppercase mb-4">
                            {lang === "HI" ? "हाल के दस्तावेज़" : "Recent Documents"}
                        </h4>
                        <div className="space-y-3">
                            {RECENT_DOCS.map((doc, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-[#161314]/80 border border-[#C9A45C]/10 rounded-[16px] hover:bg-[#3B2B28]/40 hover:border-[#C9A45C]/30 transition-colors group cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#3B2B28]/50 border border-[#C9A45C]/20 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-[#C9A45C]" />
                                        </div>
                                        <div>
                                            <p className="text-[#F5F1EC] text-sm font-medium group-hover:text-[#C9A45C] transition-colors">{doc.name}</p>
                                            <p className="text-[#F5F1EC]/40 text-xs font-light mt-0.5">{doc.date}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${doc.color} ${doc.borderColor} bg-black/40`}>
                                        {doc.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT ANALYSIS PANEL ── */}
            <div className="w-full lg:w-[60%] z-10 h-auto lg:h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
                <div className="p-8 lg:p-12 xl:p-16 max-w-4xl mx-auto">

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-8 h-[1px] bg-[#C9A45C]" />
                            <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">
                                {lang === "HI" ? "दस्तावेज़ विश्लेषण" : "DOCUMENT ANALYSIS"}
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black mb-4 font-serif leading-tight">
                            {lang === "HI" ? "रिस्क शील्ड रिपोर्ट" : "Risk Shield Report"}
                        </h1>
                        <p className="text-[rgba(245,241,236,0.72)] font-light text-lg mb-10 leading-relaxed">
                            {lang === "HI"
                                ? "VERDEX आपके दस्तावेज़ में संभावित रूप से हानिकारक खंडों की पहचान करता है।"
                                : "VERDEX identifies potentially harmful clauses and missing protections in your document."}
                        </p>

                        {/* LOADING */}
                        <AnimatePresence>
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-16 rounded-2xl bg-[#161314] border border-[#C9A45C]/10 animate-pulse" />
                                    ))}
                                    <p className="text-center text-[#C9A45C]/60 text-sm tracking-widest uppercase animate-pulse pt-2">
                                        {lang === "HI" ? "Groq LLaMA द्वारा दस्तावेज़ स्कैन हो रहा है..." : "Scanning document with Groq LLaMA 3.3 70B..."}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* RESULT */}
                        <AnimatePresence>
                            {result && !loading && (
                                <motion.div
                                    ref={resultRef}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative"
                                >
                                    <Shield className="absolute top-[20%] right-[10%] w-[400px] h-[400px] text-[#C9A45C] opacity-[0.03] pointer-events-none -rotate-12 z-0 scale-150" />
                                    <Scale className="absolute bottom-[10%] -left-[10%] w-[300px] h-[300px] text-[#F5F1EC] opacity-[0.02] pointer-events-none rotate-12 z-0 scale-125" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[#C9A45C]/5 rounded-[32px] blur-[80px] pointer-events-none" />

                                    <div className="relative bg-gradient-to-br from-[#161314] to-[#3B2B28]/30 border border-[#C9A45C]/20 rounded-[32px] p-8 lg:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden z-10 backdrop-blur-md">

                                        {/* File + Status Header */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-[#C9A45C]/10 pb-6">
                                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                                <div className="w-12 h-12 rounded-xl bg-[#3B2B28]/50 border border-[#C9A45C]/20 flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-[#C9A45C]" />
                                                </div>
                                                <h3 className="text-[#F5F1EC] font-serif text-xl tracking-wide truncate max-w-[200px]">{file?.name}</h3>
                                            </div>
                                            {(() => {
                                                const risk = getRiskLabel(result.riskScore);
                                                return (
                                                    <div className="flex flex-col items-end">
                                                        <div className={`relative px-5 py-2 ${risk.bg} border ${risk.border} rounded-sm ${risk.color} font-black tracking-widest text-sm flex items-center uppercase`}>
                                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                                            {risk.label}
                                                        </div>
                                                        <p className={`${risk.color} text-xs font-bold uppercase tracking-widest mt-2`}>
                                                            {result.clauses.length} {lang === "HI" ? "खतरनाक खंड मिले" : "high-risk clauses detected"}
                                                        </p>
                                                    </div>
                                                );
                                            })()}
                                        </div>

                                        {/* Risk Summary */}
                                        <h4 className="text-[#C9A45C] font-bold tracking-widest uppercase text-xs mb-6">
                                            {lang === "HI" ? "अनुभाग 1 — जोखिम सारांश" : "SECTION 1 — RISK SUMMARY"}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                                            <div className="p-5 rounded-2xl bg-[#050505]/40 border border-[#C9A45C]/20 flex flex-col shadow-inner">
                                                <span className="text-[#F5F1EC] font-serif font-black text-4xl mb-2">{result.clauses.length}</span>
                                                <span className="text-[#A94442] text-xs font-bold uppercase tracking-widest">
                                                    {lang === "HI" ? "खतरनाक खंड" : "Dangerous Clauses"}
                                                </span>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-[#050505]/40 border border-[#C9A45C]/20 flex flex-col shadow-inner">
                                                <span className="text-[#F5F1EC] font-serif font-black text-4xl mb-2">
                                                    {Math.max(0, result.clauses.length - Math.floor(result.clauses.length / 2))}
                                                </span>
                                                <span className="text-[#C9A45C] text-xs font-bold uppercase tracking-widest">
                                                    {lang === "HI" ? "अनुपस्थित सुरक्षाएं" : "Missing Protections"}
                                                </span>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-[#050505]/40 border border-[#C9A45C]/20 flex flex-col shadow-inner relative overflow-hidden">
                                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#A94442]/10 blur-2xl" />
                                                <span className="text-[#A94442] font-serif font-black text-4xl mb-2">{result.riskScore}%</span>
                                                <span className="text-[#A94442] text-xs font-bold uppercase tracking-widest">
                                                    {lang === "HI" ? "कुल जोखिम" : "Overall Risk"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Risk Bar */}
                                        <div className="mb-12">
                                            <div className="flex justify-between text-xs text-[#F5F1EC]/30 mb-2">
                                                <span>{lang === "HI" ? "सुरक्षित" : "Safe"} (0)</span>
                                                <span>{lang === "HI" ? "खतरनाक" : "Dangerous"} (100)</span>
                                            </div>
                                            <div className="h-2 bg-[#3B2B28] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.riskScore}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className={`h-full rounded-full ${result.riskScore >= 70 ? "bg-[#A94442]" : result.riskScore >= 40 ? "bg-[#C9A45C]" : "bg-[#5D8A66]"}`}
                                                />
                                            </div>
                                        </div>

                                        {/* Clauses */}
                                        <h4 className="text-[#C9A45C] font-bold tracking-widest uppercase text-xs mb-6">
                                            {lang === "HI" ? "अनुभाग 2 — मिले खंड" : "SECTION 2 — CLAUSES DETECTED"}
                                        </h4>

                                        {result.clauses.length === 0 ? (
                                            <div className="flex items-center gap-3 p-6 rounded-2xl bg-[#5D8A66]/10 border border-[#5D8A66]/30 mb-12">
                                                <ShieldCheck className="w-6 h-6 text-[#5D8A66] shrink-0" />
                                                <p className="text-[#5D8A66] font-semibold">
                                                    {lang === "HI" ? "कोई खतरनाक खंड नहीं मिला।" : "No dangerous clauses detected. This document appears legally sound."}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 mb-12">
                                                {result.clauses.map((clause, idx) => {
                                                    const badge = getClauseBadge(idx);
                                                    return (
                                                        <div key={idx} className={`bg-[#3B2B28]/30 rounded-[20px] border border-[#C9A45C]/20 overflow-hidden transition-all duration-300 ${badge.borderLeft} border-l-4`}>
                                                            <div
                                                                className="p-5 flex justify-between items-center cursor-pointer hover:bg-black/10"
                                                                onClick={() => setExpandedClause(expandedClause === idx ? null : idx)}
                                                            >
                                                                <h5 className="font-serif text-[#F5F1EC] text-lg leading-snug pr-4">{clause.title}</h5>
                                                                <div className="flex items-center space-x-4 shrink-0">
                                                                    <span className={`px-3 py-1 rounded-sm border text-[10px] font-bold uppercase tracking-widest ${badge.badgeColor}`}>
                                                                        {result.riskScore >= 70 && idx < Math.ceil(result.clauses.length / 2)
                                                                            ? (lang === "HI" ? "खतरनाक" : "Dangerous")
                                                                            : (lang === "HI" ? "चिंताजनक" : "Concerning")}
                                                                    </span>
                                                                    <ChevronDown className={`w-5 h-5 text-[#C9A45C] transition-transform duration-300 ${expandedClause === idx ? "rotate-180" : ""}`} />
                                                                </div>
                                                            </div>
                                                            <AnimatePresence>
                                                                {expandedClause === idx && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        className="overflow-hidden"
                                                                    >
                                                                        <div className="p-5 pt-0 border-t border-white/5 bg-black/20">
                                                                            <div className="mt-4 mb-4">
                                                                                <h6 className="text-[#C9A45C] text-xs font-bold tracking-widest uppercase mb-2 flex items-center">
                                                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                                                    {lang === "HI" ? "जोखिम स्पष्टीकरण" : "Risk Explanation"}
                                                                                </h6>
                                                                                <p className="text-[rgba(245,241,236,0.72)] font-light text-sm leading-relaxed">{clause.explanation}</p>
                                                                            </div>
                                                                            <div className="bg-[#5D8A66]/10 border border-[#5D8A66]/30 p-4 rounded-xl relative">
                                                                                <ShieldCheck className="absolute top-4 right-4 text-[#5D8A66] w-5 h-5 opacity-50" />
                                                                                <h6 className="text-[#5D8A66] text-xs font-bold tracking-widest uppercase mb-2 flex items-center">
                                                                                    <PenTool className="w-3 h-3 mr-1" />
                                                                                    {lang === "HI" ? "सुझावित सुरक्षित संस्करण" : "Suggested Safer Version"}
                                                                                </h6>
                                                                                <p className="text-[#F5F1EC] font-medium text-sm leading-relaxed">{clause.counter}</p>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                            <button className="flex-1 bg-[#C9A45C] hover:bg-[#C9A45C]/90 text-[#050505] py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(201,164,92,0.2)]">
                                                {lang === "HI" ? "सुरक्षित खंड सुझाएं" : "Suggest Safer Clauses"}
                                            </button>
                                            <button className="flex-1 bg-transparent hover:bg-white/5 border border-[#C9A45C] text-[#C9A45C] py-4 rounded-sm font-black uppercase tracking-widest text-xs transition-colors flex justify-center items-center gap-2">
                                                <Download className="w-4 h-4" />
                                                {lang === "HI" ? "पूरी रिपोर्ट" : "Full Report"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bottom insight */}
                                    <div className="mt-8 flex items-center justify-between p-4 px-6 rounded-[16px] border border-[#C9A45C]/20 bg-[#161314]/60 backdrop-blur-md shadow-lg">
                                        <div className="flex items-center space-x-4">
                                            <Database className="w-5 h-5 text-[#C9A45C]" />
                                            <span className="text-[#F5F1EC] text-sm font-light tracking-wide">
                                                <strong className="text-[#C9A45C] font-semibold text-base">67%</strong>{" "}
                                                {lang === "HI"
                                                    ? "किराया समझौतों में कम से कम एक अनुचित खंड होता है।"
                                                    : "of rental agreements contain at least one unfair clause."}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* DEFAULT STATE */}
                        {!result && !loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="opacity-40 pointer-events-none select-none"
                            >
                                <div className="relative bg-gradient-to-br from-[#161314] to-[#3B2B28]/30 border border-[#C9A45C]/10 rounded-[32px] p-8 lg:p-12">
                                    <Shield className="absolute top-[20%] right-[10%] w-[300px] h-[300px] text-[#C9A45C] opacity-[0.03] pointer-events-none -rotate-12" />
                                    <div className="flex justify-between items-start mb-8 pb-6 border-b border-[#C9A45C]/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#3B2B28]/50 border border-[#C9A45C]/10" />
                                            <div className="h-4 w-40 bg-[#C9A45C]/10 rounded" />
                                        </div>
                                        <div className="h-8 w-28 bg-[#C9A45C]/10 rounded-sm" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-[#C9A45C]/5 border border-[#C9A45C]/5" />)}
                                    </div>
                                    <p className="text-center text-[#F5F1EC]/20 font-serif text-xl">
                                        {lang === "HI" ? "विश्लेषण यहाँ दिखेगा।" : "Upload a document to see the analysis here."}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </motion.div>
                </div>
            </div>
        </main>
    );
}
