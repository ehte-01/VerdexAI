"use client";

import { motion } from "framer-motion";
import { Shield, Lock, FileText, UploadCloud, AlertTriangle, Briefcase, EyeOff, ShieldAlert, PhoneCall, Building2, UserX, MapPin, CheckCircle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function WhistleblowerPage() {
    const { lang, t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("Workplace Harassment");
    const [submitAnonymously, setSubmitAnonymously] = useState(true);
    const [connectLegal, setConnectLegal] = useState(true);
    const [description, setDescription] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<{caseId: string, status: string} | null>(null);
    const [error, setError] = useState("");

    const categories = [
        { id: "Workplace Harassment", icon: Briefcase,
          desc: lang === "HI" ? "कार्यस्थल पर दुर्व्यवहार, भेदभाव की रिपोर्ट करें।" : "Report abuse, discrimination or harassment at work." },
        { id: "Domestic Violence", icon: UserX,
          desc: lang === "HI" ? "घरेलू हिंसा के लिए गोपनीय सहायता लें।" : "Seek safe, confidential help for domestic abuse." },
        { id: "Corruption / Bribery", icon: FileText,
          desc: lang === "HI" ? "अवैध मांग या भ्रष्टाचार की रिपोर्ट करें।" : "Report illegal demands or financial corruption." },
        { id: "Fake Legal Threats", icon: FileText,
          desc: lang === "HI" ? "जाली नोटिस या डराने की रिपोर्ट करें।" : "Report forged notices or empty intimidation." },
        { id: "Blackmail / Threat", icon: ShieldAlert,
          desc: lang === "HI" ? "जबरन वसूली या धमकी की रिपोर्ट करें।" : "Report extortion, stalking, or direct threats." },
        { id: "Employer Abuse", icon: AlertTriangle,
          desc: lang === "HI" ? "अवैतनिक वेतन, असुरक्षित स्थितियां।" : "Unpaid wages, unsafe conditions, or coercion." }
    ];

    const categoryLabels: Record<string, string> = {
        "Workplace Harassment": lang === "HI" ? "कार्यस्थल उत्पीड़न" : "Workplace Harassment",
        "Domestic Violence":    lang === "HI" ? "घरेलू हिंसा"        : "Domestic Violence",
        "Corruption / Bribery": lang === "HI" ? "भ्रष्टाचार / रिश्वत" : "Corruption / Bribery",
        "Fake Legal Threats":   lang === "HI" ? "फर्जी कानूनी धमकी"  : "Fake Legal Threats",
        "Blackmail / Threat":   lang === "HI" ? "ब्लैकमेल / धमकी"    : "Blackmail / Threat",
        "Employer Abuse":       lang === "HI" ? "नियोक्ता का दुर्व्यवहार" : "Employer Abuse",
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!description.trim()) {
            setError(lang === "HI" ? "कृपया सभी आवश्यक जानकारी भरें।" : "Please complete all required information.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("caseType", activeCategory);
        formData.append("description", description);
        uploadedFiles.forEach(file => formData.append("files", file));
        try {
            const response = await fetch("http://localhost:8081/api/whistleblower/report", {
                method: "POST", body: formData
            });
            if (!response.ok) {
                if (response.status === 400) throw new Error(lang === "HI" ? "कृपया सभी जानकारी भरें।" : "Please complete all required information.");
                if (response.status === 429) throw new Error(lang === "HI" ? "कुछ देर बाद प्रयास करें।" : "Too many requests. Please wait.");
                throw new Error(lang === "HI" ? "रिपोर्ट दर्ज नहीं हो सकी।" : "Unable to submit your report right now.");
            }
            const data = await response.json();
            setSuccessData({ caseId: data.caseId, status: data.status });
            setDescription("");
            setUploadedFiles([]);
        } catch (err: any) {
            setError(err.message || (lang === "HI" ? "VERDEX सर्वर से कनेक्ट नहीं हो सका।" : "Cannot connect to VERDEX secure server."));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    };

    const removeFile = (idx: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== idx));

    const protectionPoints = [t("wb.protection1"), t("wb.protection2"), t("wb.protection3"), t("wb.protection4")];

    return (
        <main className="pt-[80px] md:pt-[100px] min-h-screen bg-[#050505] text-[#F5F1EC] font-sans flex flex-col relative overflow-hidden">

            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-[#3B2B28]/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] bg-[#C9A45C]/5 rounded-full blur-[150px]" />
                {[...Array(15)].map((_, i) => (
                    <motion.div key={i} initial={{ y: 0, opacity: 0 }} animate={{ y: [-20, 20, -20], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-1 h-1 bg-[#C9A45C] rounded-full blur-[1px]"
                        style={{ top: `${(i * 37) % 100}%`, left: `${(i * 61) % 100}%` }} />
                ))}
                <Shield className="absolute top-[5%] -left-[10%] w-[800px] h-[800px] text-[#F5F1EC] opacity-[0.02] pointer-events-none -rotate-12" />
                <Image src="/verdex-hero.png" alt="Lady Justice" fill className="absolute inset-0 object-cover opacity-5 mix-blend-screen pointer-events-none grayscale" />
            </div>

            <div className="flex flex-col lg:flex-row flex-1 z-10 w-full relative container mx-auto">

                {/* Left Panel */}
                <div className="w-full lg:w-[38%] lg:pr-8 flex flex-col h-auto pt-8 lg:pt-10 pb-10">
                    <div className="flex flex-col h-full mx-auto w-full max-w-xl lg:max-w-none">

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-8 h-[1px] bg-[#C9A45C]" />
                            <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">{t("wb.badge")}</span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-black mb-4 font-serif leading-tight">{t("wb.title")}</h1>
                        <p className="text-[rgba(245,241,236,0.72)] font-light text-sm mb-10 leading-relaxed">{t("wb.desc")}</p>

                        {/* Reassurance Card */}
                        <div className="bg-gradient-to-br from-[#161314] to-[#3B2B28]/80 border border-[#C9A45C]/20 rounded-[28px] p-8 mb-10 shadow-[0_0_30px_rgba(59,43,40,0.5)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A45C]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3" />
                            <Shield className="w-8 h-8 text-[#C9A45C] mb-6" />
                            <ul className="space-y-4 mb-8">
                                {protectionPoints.map((text, i) => (
                                    <li key={i} className="flex items-start text-sm text-[#F5F1EC]/80 font-light">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#5D8A66] mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_8px_#5D8A66]" />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 border-t border-[#C9A45C]/10 flex items-center space-x-3">
                                <Lock className="w-4 h-4 text-[#C9A45C]" />
                                <span className="text-xs text-[#C9A45C] uppercase tracking-widest font-bold">{t("wb.protected")}</span>
                            </div>
                        </div>

                        {/* Categories */}
                        <h3 className="text-[#F5F1EC] font-serif text-xl font-bold mb-6">{t("wb.choose")}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categories.map((cat) => {
                                const isActive = activeCategory === cat.id;
                                return (
                                    <div key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                        className={`p-5 rounded-[20px] cursor-pointer transition-all duration-300 relative group flex flex-col items-start ${
                                            isActive ? "bg-gradient-to-br from-[#3B2B28] to-[#161314] border border-[#C9A45C] border-l-4 shadow-[0_0_20px_rgba(201,164,92,0.15)] -translate-y-1"
                                                     : "bg-[#161314] border border-[#C9A45C]/20 hover:border-[#C9A45C]/40 hover:bg-[#3B2B28]/40 hover:-translate-y-1"
                                        }`}
                                    >
                                        <cat.icon className={`w-5 h-5 mb-3 transition-colors ${isActive ? "text-[#C9A45C]" : "text-[#F5F1EC]/40 group-hover:text-[#C9A45C]"}`} />
                                        <h4 className={`font-bold text-sm mb-1 transition-colors ${isActive ? "text-[#F5F1EC]" : "text-[#F5F1EC]/80"}`}>
                                            {categoryLabels[cat.id]}
                                        </h4>
                                        <p className="text-[10px] text-[rgba(245,241,236,0.5)] font-light leading-relaxed">{cat.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="w-full lg:w-[62%] h-auto lg:h-[calc(100vh-100px)] lg:pl-10 pt-8 lg:pt-10 pb-10 flex flex-col relative z-20 lg:overflow-y-auto no-scrollbar">
                    <div className="max-w-3xl w-full mx-auto lg:mx-0 lg:ml-auto pr-2">

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-8 h-[1px] bg-[#C9A45C]" />
                            <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">
                                {lang === "HI" ? "गुमनाम रिपोर्ट" : "ANONYMOUS REPORT"}
                            </span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black mb-4 font-serif leading-tight">{t("wb.form.title")}</h2>
                        <p className="text-[rgba(245,241,236,0.72)] font-light text-sm mb-10 leading-relaxed">{t("wb.form.desc")}</p>

                        <div className="bg-[#110E0F] border border-[#C9A45C]/20 rounded-[32px] p-8 lg:p-12 shadow-2xl relative">
                            <form onSubmit={handleSubmitReport} className="space-y-6">

                                {error && (
                                    <div className="bg-[#A94442]/10 border border-[#A94442] text-[#A94442] p-4 rounded-[12px] flex items-center space-x-3">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] text-[#C9A45C] uppercase tracking-widest font-bold">{t("wb.field.category")}</label>
                                        <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}
                                            className="w-full bg-[#050505] border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-4 text-[#F5F1EC] text-sm outline-none transition-all appearance-none cursor-pointer">
                                            {categories.map(c => <option key={c.id} value={c.id}>{categoryLabels[c.id]}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] text-[#C9A45C] uppercase tracking-widest font-bold">{t("wb.field.location")}</label>
                                        <div className="relative">
                                            <input type="text" placeholder={t("wb.field.location.placeholder")}
                                                className="w-full bg-[#050505] border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-4 pl-12 text-[#F5F1EC] text-sm outline-none transition-all" />
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A45C]/50" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] text-[#C9A45C] uppercase tracking-widest font-bold">{t("wb.field.date")}</label>
                                        <input type="text" placeholder={t("wb.field.date.placeholder")}
                                            className="w-full bg-[#050505] border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-4 text-[#F5F1EC] text-sm outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] text-[#C9A45C] uppercase tracking-widest font-bold">
                                            {t("wb.field.people")}
                                        </label>
                                        <input type="text" placeholder={t("wb.field.people.placeholder")}
                                            className="w-full bg-[#050505] border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-4 text-[#F5F1EC] text-sm outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] text-[#C9A45C] uppercase tracking-widest font-bold">{t("wb.field.description")}</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                        placeholder={t("wb.field.desc.placeholder")}
                                        className="w-full h-[180px] resize-none bg-[#050505] border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-[16px] px-5 py-5 text-[#F5F1EC] text-sm outline-none transition-all leading-relaxed shadow-inner" />
                                </div>

                                {/* File Upload */}
                                <div className="space-y-4">
                                    <div className="group border-2 border-dashed border-[#C9A45C]/30 hover:border-[#C9A45C]/60 hover:bg-[#C9A45C]/5 transition-all p-8 rounded-[20px] flex flex-col items-center justify-center cursor-pointer relative">
                                        <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <UploadCloud className="w-8 h-8 text-[#C9A45C] mb-3 group-hover:-translate-y-1 transition-transform" />
                                        <p className="text-[#F5F1EC] font-medium text-sm text-center mb-1">
                                            {lang === "HI" ? "स्क्रीनशॉट, ऑडियो या दस्तावेज़ अपलोड करें" : "Upload screenshots, audio, images, or documents"}
                                        </p>
                                        <p className="text-[#C9A45C] text-xs font-light">
                                            {lang === "HI" ? "वैकल्पिक — फ़ाइलें निजी और एन्क्रिप्टेड रहती हैं" : "Optional — files remain private and encrypted"}
                                        </p>
                                    </div>
                                    {uploadedFiles.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {uploadedFiles.map((file, idx) => (
                                                <div key={idx} className="flex items-center space-x-2 bg-[#161314] border border-[#C9A45C]/30 rounded-full px-3 py-1.5 text-xs">
                                                    <span className="text-[#F5F1EC]/80 truncate max-w-[150px]">{file.name}</span>
                                                    <button type="button" onClick={() => removeFile(idx)} className="text-[#C9A45C] hover:text-[#F5F1EC] transition-colors">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Toggles */}
                                <div className="space-y-4 pt-4 border-t border-[#C9A45C]/10">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center">
                                            <EyeOff className="w-5 h-5 text-[#C9A45C] mr-3" />
                                            <div>
                                                <p className="text-[#F5F1EC] text-sm font-medium">
                                                    {lang === "HI" ? "गुमनाम रूप से दर्ज करें" : "Submit anonymously"}
                                                </p>
                                                <p className="text-[10px] text-[#F5F1EC]/50 font-light">
                                                    {lang === "HI" ? "आपका IP और मेटाडेटा हटा दिया जाता है" : "Your IP and metadata are scrubbed"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${submitAnonymously ? 'bg-[#5D8A66]' : 'bg-[#161314] border border-[#C9A45C]/30'}`}
                                            onClick={() => setSubmitAnonymously(!submitAnonymously)}>
                                            <div className={`w-4 h-4 bg-white rounded-full mx-1 absolute transition-transform ${submitAnonymously ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer pb-4">
                                        <div className="flex items-center">
                                            <Building2 className="w-5 h-5 text-[#C9A45C] mr-3" />
                                            <div>
                                                <p className="text-[#F5F1EC] text-sm font-medium">
                                                    {lang === "HI" ? "नज़दीकी कानूनी सहायता से जोड़ें" : "Connect me with nearby legal support"}
                                                </p>
                                                <p className="text-[10px] text-[#F5F1EC]/50 font-light">
                                                    {lang === "HI" ? "रिपोर्ट को विश्वसनीय NGO से मिलाया जाएगा" : "We will match this report with trusted NGOs"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${connectLegal ? 'bg-[#5D8A66]' : 'bg-[#161314] border border-[#C9A45C]/30'}`}
                                            onClick={() => setConnectLegal(!connectLegal)}>
                                            <div className={`w-4 h-4 bg-white rounded-full mx-1 absolute transition-transform ${connectLegal ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                                    <button type="submit" disabled={loading}
                                        className="flex-1 bg-[#C9A45C] hover:bg-[#C9A45C]/90 text-[#050505] py-4 rounded-[12px] font-black uppercase tracking-widest text-xs transition-all shadow-[0_4px_20px_rgba(201,164,92,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed">
                                        {loading ? (
                                            <><div className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin mr-2" />{t("wb.btn.loading")}</>
                                        ) : t("wb.btn.submit")}
                                    </button>
                                    <button type="button"
                                        className="flex-1 bg-transparent border border-[#C9A45C] text-[#C9A45C] hover:bg-white/5 py-4 rounded-[12px] font-black uppercase tracking-widest text-xs transition-colors">
                                        {lang === "HI" ? "ड्राफ्ट सहेजें" : "Save Draft"}
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-[#C9A45C]/70 font-light pt-2">
                                    {lang === "HI"
                                        ? "आपकी रिपोर्ट 256-बिट AES एन्क्रिप्टेड है और सबमिशन के बाद स्वतः हटा दी जाती है।"
                                        : "Your report is 256-bit AES encrypted and automatically deleted after submission."}
                                </p>
                            </form>
                        </div>

                        {/* Emergency Strip */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="mt-8 bg-gradient-to-r from-[#A94442]/20 to-[#161314] border border-[#A94442] rounded-[24px] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-lg">
                            <div className="flex items-center mb-6 md:mb-0">
                                <div className="w-12 h-12 rounded-full bg-[#A94442]/20 border border-[#A94442] flex items-center justify-center flex-shrink-0 mr-4 animate-pulse">
                                    <AlertTriangle className="w-6 h-6 text-[#A94442]" />
                                </div>
                                <div>
                                    <h4 className="text-[#F5F1EC] font-serif font-black text-lg mb-1">
                                        {lang === "HI" ? "तत्काल खतरे में हैं?" : "In immediate danger?"}
                                    </h4>
                                    <p className="text-[#F5F1EC]/60 text-xs">
                                        {lang === "HI" ? "ऑनलाइन इंतजार न करें। अभी आपातकालीन सहायता से संपर्क करें।" : "Do not wait online. Contact emergency support now."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="bg-[#A94442] hover:bg-[#A94442]/90 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-transform hover:scale-105 flex items-center shadow-[0_0_20px_rgba(169,68,66,0.4)]">
                                    <PhoneCall className="w-3 h-3 mr-2" />
                                    {lang === "HI" ? "हेल्पलाइन कॉल करें" : "Call Helpline"}
                                </button>
                                <button className="bg-transparent border border-[#C9A45C]/50 text-[#C9A45C] hover:bg-white/5 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors">
                                    {lang === "HI" ? "नज़दीकी NGO" : "Nearby NGO"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* What Happens Next */}
            <div className="border-t border-[#C9A45C]/10 bg-[#0A0808] relative z-10 w-full mt-10">
                <div className="container mx-auto px-6 py-20 lg:py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-black text-[#F5F1EC]">
                            {lang === "HI" ? "आगे क्या होगा?" : "What Happens Next?"}
                        </h2>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C9A45C]/50 to-transparent z-0" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                { step: "1", title: lang === "HI" ? "पहचान सुरक्षित" : "Identity Protected",
                                  desc: lang === "HI" ? "आपका IP हटाया जाता है। AES-256 एन्क्रिप्शन।" : "Your IP is scrubbed. Information is AES-256 encrypted.", icon: Lock },
                                { step: "2", title: lang === "HI" ? "रिपोर्ट की समीक्षा" : "Report Reviewed",
                                  desc: lang === "HI" ? "हमारी AI टीम बिना नाम के घटना की जांच करती है।" : "Our AI and legal team securely triage the incident without names.", icon: Briefcase },
                                { step: "3", title: lang === "HI" ? "सहायता से जुड़ाव" : "Support Connected",
                                  desc: lang === "HI" ? "आपकी इच्छा से स्थानीय NGO या वकील से जोड़ा जाएगा।" : "If you choose to, you are matched with local NGOs or lawyers.", icon: Shield }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 rounded-full bg-[#161314] border border-[#C9A45C] flex items-center justify-center mb-6 relative group-hover:bg-[#C9A45C]/10 transition-colors shadow-[0_0_20px_rgba(201,164,92,0.15)] bg-gradient-to-br from-[#161314] to-[#3B2B28]/50">
                                        <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#050505] border border-[#C9A45C] text-[#C9A45C] flex items-center justify-center font-black text-sm">{item.step}</span>
                                        <item.icon className="w-8 h-8 text-[#C9A45C]" />
                                    </div>
                                    <h3 className="text-[#F5F1EC] font-serif text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-[rgba(245,241,236,0.6)] text-sm px-6 font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {successData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md" onClick={() => setSuccessData(null)} />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#161314] border border-[#C9A45C] p-8 lg:p-10 rounded-[32px] max-w-md w-full relative z-10 shadow-[0_0_50px_rgba(201,164,92,0.15)] flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[#C9A45C]/10 to-transparent rounded-t-[32px] pointer-events-none" />
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#161314] to-[#3B2B28] border-2 border-[#C9A45C] flex items-center justify-center mb-6 shadow-inner relative mt-2">
                            <CheckCircle className="w-10 h-10 text-[#C9A45C]" />
                            <div className="absolute inset-0 bg-[#C9A45C] rounded-full blur-[20px] opacity-20 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black font-serif text-[#F5F1EC] mb-2">{t("wb.success")}</h3>
                        <p className="text-[#C9A45C] font-light text-sm mb-8">{t("wb.success.desc")}</p>
                        <div className="w-full bg-[#050505] border border-[#C9A45C]/20 rounded-[16px] p-6 mb-8 text-left space-y-4 shadow-inner">
                            <div className="flex justify-between items-center border-b border-[#C9A45C]/10 pb-4">
                                <span className="text-[#F5F1EC]/50 text-xs uppercase tracking-widest">
                                    {lang === "HI" ? "केस आईडी" : "Case ID"}
                                </span>
                                <span className="text-[#F5F1EC] font-mono font-bold">{successData.caseId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#F5F1EC]/50 text-xs uppercase tracking-widest">
                                    {lang === "HI" ? "स्थिति" : "Status"}
                                </span>
                                <span className="text-[#5D8A66] font-bold text-sm tracking-widest uppercase">{successData.status}</span>
                            </div>
                        </div>
                        <button onClick={() => setSuccessData(null)}
                            className="bg-[#C9A45C] hover:bg-[#C9A45C]/90 text-[#050505] w-full py-4 rounded-[12px] font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:scale-105 active:scale-95">
                            {lang === "HI" ? "बंद करें" : "Close"}
                        </button>
                    </motion.div>
                </div>
            )}
        </main>
    );
}