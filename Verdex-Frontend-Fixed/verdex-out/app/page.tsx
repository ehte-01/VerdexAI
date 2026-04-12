"use client";

import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scale, Shield, FileText, MapPin, Eye, ArrowRight, Brain, AlertCircle, FileSearch, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function Home() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />

            {/* 1. About / Problem Section */}
            <section className="py-32 bg-[#050505] relative overflow-hidden">
                {/* Ambient Image Background */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image 
                        src="/justice_access.png" 
                        alt="Justice vs Access" 
                        fill 
                        className="object-cover md:object-right mix-blend-lighten"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] flex-1 to-transparent via-[#050505]/80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
                </div>
                
                {/* Glowing Orb Overlay */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C9A45C]/10 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3 z-0 pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-2xl relative">
                            {/* Decorative Line */}
                            <div className="absolute -left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#C9A45C]/50 to-transparent hidden lg:block" />
                            
                            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-8 h-[1px] bg-[#C9A45C]" />
                                    <span className="text-[#C9A45C] font-bold tracking-[0.2em] uppercase text-[10px]">
                                        {lang === "HI" ? "समस्या का परिदृश्य" : "THE CRISIS"}
                                    </span>
                                </div>
                                
                                <h2 className="text-5xl md:text-[80px] font-black mb-10 text-[#F5F1EC] font-serif leading-[1] drop-shadow-2xl">
                                    {t("about.title1")} 
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A45C] to-[#8C713B] block mt-2">
                                        {t("about.title2")}
                                    </span>
                                </h2>
                                
                                <div className="p-8 md:p-10 rounded-[32px] bg-gradient-to-br from-[#161314]/80 to-[#3B2B28]/20 backdrop-blur-2xl border border-[#C9A45C]/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#C9A45C]/0 via-[#C9A45C]/10 to-[#C9A45C]/0 rounded-[32px] opacity-0 group-hover:opacity-100 transition duration-1000 blur-sm pointer-events-none" />
                                    <p className="text-xl md:text-2xl font-light text-[#F5F1EC]/80 leading-relaxed relative z-10">
                                        {t("about.desc")}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Real-World Cases Matrix */}
            <section className="py-24 bg-neutral-950 relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div className="max-w-2xl">
                            <div className="flex items-center space-x-3 mb-4">
                                <AlertCircle className="text-secondary h-5 w-5" />
                                <span className="text-secondary font-bold tracking-widest uppercase text-sm">
                                    {t("cases.title")}
                                </span>
                            </div>
                            <p className="text-neutral-50/60 font-light text-lg">
                                {t("cases.desc")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: t("cases.c1"), img: "/case_wages.png", label: "LABOUR LAW" },
                            { title: t("cases.c2"), img: "/case_eviction.png", label: "PROPERTY DISPUTE" },
                            { title: t("cases.c3"), img: "/case_fake_notice.png", label: "CONSUMER FRAUD" }
                        ].map((item, i) => (
                            <div key={i} className="group relative w-full h-[450px] rounded-[24px] overflow-hidden cursor-pointer shadow-2xl block border border-[#C9A45C]/20 hover:border-[#C9A45C]/50 transition-colors duration-500">
                                <Image 
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500 z-10" />
                                
                                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="bg-[#161314]/80 backdrop-blur-md border border-[#C9A45C]/30 text-[#C9A45C] px-3 py-1 rounded-sm text-[10px] uppercase font-black tracking-widest inline-block mb-4 shadow-lg">
                                            {item.label}
                                        </div>
                                        <h3 className="text-2xl font-black text-[#F5F1EC] mb-6 font-serif leading-snug drop-shadow-xl">
                                            {item.title}
                                        </h3>
                                        <Link href="/situation" className="flex items-center text-[#C9A45C] font-bold text-xs tracking-widest uppercase hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                            {t("cases.btn")} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. The Solution (VERDEX) Section */}
            <section className="py-32 bg-[#050505] relative overflow-hidden">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9A45C]/5 rounded-full blur-[150px] pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex justify-center mb-20 text-center">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl md:text-6xl font-black text-[#F5F1EC] font-serif mb-6 leading-tight">
                                {t("sol.title")}
                            </h2>
                            <h3 className="text-xl md:text-2xl text-[#C9A45C] font-serif italic mb-6 shadow-[#C9A45C]/10 drop-shadow-lg">
                                {t("sol.sub")}
                            </h3>
                            <p className="text-lg md:text-xl text-[rgba(245,241,236,0.72)] font-light leading-relaxed">
                                {t("sol.desc")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Image Side */}
                        <div className="lg:col-span-7 relative group perspective-1000">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#C9A45C]/30 to-[#76422B]/30 rounded-[32px] blur-md opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                            <div className="relative aspect-[4/3] w-full rounded-[30px] overflow-hidden border border-[#C9A45C]/20 shadow-[-20px_20px_60px_rgba(0,0,0,0.8)]">
                                <Image
                                    src="/solution_ai.png"
                                    alt="Verdex AI Scanning Technology"
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    priority
                                />
                                {/* Scanning Laser Simulation Overlay */}
                                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#38bdf8]/80 shadow-[0_0_20px_#38bdf8,unset] mix-blend-screen" style={{ animation: "scanLaser 5s ease-in-out infinite" }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-80" />
                                
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl backdrop-blur-md bg-black/40 border border-white/10 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <Brain className="w-8 h-8 text-[#C9A45C] animate-pulse" />
                                    <div>
                                        <p className="text-[#F5F1EC] font-bold text-sm tracking-wider uppercase">Neural Parsing Active</p>
                                        <p className="text-[#C9A45C] text-xs font-mono">1.2s clause identification</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Steps Side */}
                        <div className="lg:col-span-5 space-y-6">
                            {[
                                { num: "01", title: t("sol.k1"), icon: AlertCircle },
                                { num: "02", title: t("sol.k2"), icon: Brain },
                                { num: "03", title: t("sol.k3"), icon: ShieldCheck },
                                { num: "04", title: t("sol.k4"), icon: FileText }
                            ].map((step, idx) => (
                                <div key={idx} className="group p-6 rounded-[20px] bg-[#161314]/80 border border-[#C9A45C]/10 hover:border-[#C9A45C]/50 hover:bg-gradient-to-r hover:from-[#3B2B28]/40 hover:to-[#161314] transition-all duration-300 flex items-center space-x-6 backdrop-blur-md shadow-lg hover:shadow-[0_0_30px_rgba(201,164,92,0.15)] hover:-translate-x-2 cursor-crosshair">
                                    <div className="w-14 h-14 rounded-xl bg-[#050505] border border-[#C9A45C]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#C9A45C] group-hover:bg-[#C9A45C]/10 transition-colors shadow-inner">
                                        <span className="text-[#C9A45C] font-black text-xl font-serif drop-shadow-md">{step.num}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[#F5F1EC] font-bold uppercase tracking-widest text-sm group-hover:text-[#C9A45C] transition-colors">
                                            {step.title}
                                        </h4>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-300">
                                        <step.icon className="w-6 h-6 text-[#C9A45C]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes scanLaser {
                        0% { top: 0%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; top: 95%; }
                        100% { top: 100%; opacity: 0; }
                    }
                `}} />
            </section>

            {/* 4. Core Features Bento Matrix */}
            <section className="py-32 bg-[#050505]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[100px] bg-[#C9A45C]/10 blur-[80px] rounded-full pointer-events-none" />
                        <h2 className="text-4xl md:text-6xl font-black text-[#F5F1EC] font-serif shadow-[#C9A45C]/10 drop-shadow-xl relative z-10">
                            {t("feat.title")}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
                        
                        {/* Main Image Block (8 cols, 2 rows) */}
                        <div className="md:col-span-12 lg:col-span-8 row-span-2 group relative rounded-[32px] overflow-hidden border border-[#C9A45C]/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer">
                            <Image 
                                src="/core_features.png" 
                                alt="Verdex Core Analytics" 
                                fill 
                                className="object-cover transition-transform duration-[1.5s] group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
                            
                            <div className="absolute bottom-10 left-10 max-w-lg z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="bg-[#161314]/80 backdrop-blur-md border border-[#C9A45C]/30 text-[#C9A45C] px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest inline-block mb-4 shadow-[0_0_15px_rgba(201,164,92,0.2)]">
                                    VERDEX AI ENGINE
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-black text-[#F5F1EC] font-serif leading-tight">
                                    Predicting outcomes before you even file.
                                </h3>
                            </div>
                        </div>

                        {/* Feature 1 (4 cols, 1 row) */}
                        <div className="md:col-span-6 lg:col-span-4 rounded-[32px] bg-[#161314] hover:bg-[#3B2B28]/30 border border-[#C9A45C]/10 hover:border-[#C9A45C]/40 transition-all duration-500 p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg cursor-pointer hover:-translate-y-1">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#C9A45C]/5 rounded-full blur-2xl group-hover:bg-[#C9A45C]/20 transition-colors duration-700" />
                            <div className="w-14 h-14 bg-[#050505] border border-[#C9A45C]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <Scale className="text-[#C9A45C] h-6 w-6" />
                            </div>
                            <div className="relative z-10 mt-8">
                                <h3 className="text-xl font-bold text-[#F5F1EC] mb-2 font-serif group-hover:text-[#C9A45C] transition-colors">{t("feat.1.t")}</h3>
                                <p className="text-[rgba(245,241,236,0.6)] font-light text-sm line-clamp-2">{t("feat.1.d")}</p>
                            </div>
                        </div>

                        {/* Feature 2 (4 cols, 1 row) */}
                        <div className="md:col-span-6 lg:col-span-4 rounded-[32px] bg-[#161314] hover:bg-[#3B2B28]/30 border border-[#C9A45C]/10 hover:border-[#C9A45C]/40 transition-all duration-500 p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg cursor-pointer hover:-translate-y-1">
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#C9A45C]/5 rounded-full blur-2xl group-hover:bg-[#C9A45C]/20 transition-colors duration-700" />
                            <div className="w-14 h-14 bg-[#050505] border border-[#C9A45C]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <Shield className="text-[#C9A45C] h-6 w-6" />
                            </div>
                            <div className="relative z-10 mt-8">
                                <h3 className="text-xl font-bold text-[#F5F1EC] mb-2 font-serif group-hover:text-[#C9A45C] transition-colors">{t("feat.2.t")}</h3>
                                <p className="text-[rgba(245,241,236,0.6)] font-light text-sm line-clamp-2">{t("feat.2.d")}</p>
                            </div>
                        </div>

                        {/* Bottom Row: Feat 3, 4, 5, 6 (3 cols each) */}
                        {[
                            { title: t("feat.3.t"), desc: t("feat.3.d"), icon: FileText },
                            { title: t("feat.4.t"), desc: t("feat.4.d"), icon: MapPin },
                            { title: t("feat.5.t"), desc: t("feat.5.d"), icon: Brain },
                            { title: t("feat.6.t"), desc: t("feat.6.d"), icon: Eye }
                        ].map((feat, idx) => (
                            <div key={idx} className="md:col-span-6 lg:col-span-3 rounded-[32px] bg-[#161314] hover:bg-[#3B2B28]/30 border border-[#C9A45C]/10 hover:border-[#C9A45C]/40 transition-all duration-500 p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg cursor-pointer hover:-translate-y-1">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#C9A45C]/0 rounded-full blur-3xl group-hover:bg-[#C9A45C]/10 transition-colors duration-700" />
                                <div className="w-14 h-14 bg-[#050505] border border-[#C9A45C]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <feat.icon className="text-[#C9A45C] h-6 w-6" />
                                </div>
                                <div className="relative z-10 mt-8">
                                    <h3 className="text-lg lg:text-xl font-bold text-[#F5F1EC] mb-2 font-serif group-hover:text-[#C9A45C] transition-colors">{feat.title}</h3>
                                    <p className="text-[rgba(245,241,236,0.6)] font-light text-xs lg:text-sm line-clamp-3">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. MVP Demo & Vision Section */}
            <section className="py-32 bg-[#050505] relative overflow-hidden border-t border-[#C9A45C]/10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A45C]/5 via-[#050505] to-[#050505]" />
                
                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <div className="text-center mb-24 relative">
                        <span className="text-[#C9A45C] font-bold tracking-[0.2em] uppercase text-xs mb-4 inline-block px-4 py-1.5 border border-[#C9A45C]/20 rounded-full bg-[#C9A45C]/5 backdrop-blur-sm">
                            {t("demo.mvp")}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#F5F1EC] font-serif tracking-tight drop-shadow-xl">
                            {t("demo.sub")}
                        </h2>
                    </div>

                    {/* Interactive Pipeline Graphic */}
                    <div className="relative mb-32">
                        {/* Connecting Line Background */}
                        <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-[#C9A45C]/10 z-0 overflow-hidden">
                            {/* Animated Glow Line inside */}
                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent shadow-[0_0_15px_#C9A45C]" style={{ animation: "beam 3s infinite linear" }} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-0 relative z-10">
                            {[
                                { icon: AlertCircle, label: t("demo.s1") },
                                { icon: Brain, label: t("demo.s2") },
                                { icon: ShieldCheck, label: t("demo.s3") },
                                { icon: FileText, label: t("demo.s4") }
                            ].map((step, idx) => (
                                <div key={idx} className="relative flex flex-col items-center group cursor-crosshair">
                                    {/* The node / diamond */}
                                    <div className="h-[90px] w-[90px] rounded-2xl bg-[#161314]/90 border border-[#C9A45C]/30 flex items-center justify-center mb-8 shadow-lg backdrop-blur-md group-hover:bg-[#C9A45C] group-hover:border-[#C9A45C] group-hover:shadow-[0_0_40px_rgba(201,164,92,0.4)] transition-all duration-500 transform group-hover:-translate-y-2 rotate-45">
                                        <div className="-rotate-45 relative">
                                            <step.icon className="h-8 w-8 text-[#C9A45C] group-hover:text-[#050505] transition-colors duration-500" />
                                            {/* Ripple effect */}
                                            <div className="absolute inset-0 bg-[#050505] rounded-full blur-md opacity-0 group-hover:opacity-40 animate-ping" />
                                        </div>
                                    </div>
                                    <span className="text-[#C9A45C] font-black text-sm tracking-widest uppercase mb-2 block">{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System + Future Vision Grid */}
                    <div className="pt-24 border-t border-[#C9A45C]/10 text-left relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#C9A45C]/40 to-transparent" />
                        
                        <div className="flex items-center space-x-4 mb-16">
                            <h3 className="text-3xl lg:text-4xl font-black text-[#F5F1EC] font-serif">{t("vis.title")}</h3>
                            <div className="h-[2px] w-16 bg-[#C9A45C] shadow-[0_0_10px_#C9A45C]" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: MapPin, title: t("vis.1.t"), desc: t("vis.1.d"), hoverGlow: "from-[#C9A45C]/20", route: "" },
                                { icon: FileSearch, title: t("vis.2.t"), desc: t("vis.2.d"), hoverGlow: "from-[#C9A45C]/20", route: "/case-predictor" },
                                { icon: Eye, title: t("vis.3.t"), desc: t("vis.3.d"), hoverGlow: "from-[#C9A45C]/20", route: "" }
                            ].map((card, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => card.route ? router.push(card.route) : null}
                                    className="group relative bg-[#161314] rounded-3xl p-8 border border-[#C9A45C]/10 overflow-hidden hover:border-[#C9A45C]/30 transition-colors duration-500 shadow-2xl cursor-pointer hover:-translate-y-1 transform">
                                    <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${card.hoverGlow} to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl`} />
                                    
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-[#C9A45C]/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                                            <card.icon className="text-[#C9A45C] h-6 w-6" />
                                        </div>
                                        <h4 className="text-xl font-bold text-[#F5F1EC] mb-4 font-serif">{card.title}</h4>
                                        <p className="text-sm font-light text-[#F5F1EC]/60 leading-relaxed min-h-[60px]">{card.desc}</p>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A45C]/0 via-[#C9A45C] to-[#C9A45C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes beam {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}} />
            </section>

            {/* 6. Final CTA */}
            <section className="py-32 bg-secondary text-primary-dark relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#161314_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 font-serif max-w-4xl mx-auto leading-tight">
                        {t("cta.title")}
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium opacity-80">
                        {t("cta.desc")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/situation">
                            <Button size="lg" className="bg-primary-dark hover:bg-neutral-900 text-secondary h-16 w-full sm:w-auto px-12 text-lg font-bold tracking-widest uppercase transition-all shadow-xl">
                                {t("cta.btn1")}
                            </Button>
                        </Link>
                        <Link href="/shield">
                            <Button size="lg" variant="outline" className="border-primary-dark text-primary-dark bg-transparent hover:bg-primary-dark hover:text-secondary h-16 w-full sm:w-auto px-12 text-lg font-bold tracking-widest uppercase transition-all">
                                {t("cta.btn2")}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}