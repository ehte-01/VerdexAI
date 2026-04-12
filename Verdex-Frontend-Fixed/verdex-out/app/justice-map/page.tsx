"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Navigation, ArrowRight, TrendingUp, Building2, FileText, Scale } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("../../components/JusticeMapInteractive"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#0A0808] animate-pulse rounded-[32px] border border-[#C9A45C]/20" />
});

export interface JusticeLocation {
    name: string;
    type: string;
    city: string;
    description: string;
    distance: number;
    queueTime: string;
    successRate: string;
    languages: string[];
    latitude: number;
    longitude: number;
}

export default function JusticeMapPage() {
    const { lang, t } = useLanguage();
    const [locations, setLocations] = useState<JusticeLocation[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<JusticeLocation | null>(null);
    const [selectedType, setSelectedType] = useState("");
    const [searchCity, setSearchCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const filters = [
        "Labour Issue", "Women Safety", "Consumer Fraud",
        "Free Legal Help"
    ];

    const fetchLocations = async (city = "", type = "") => {
        try {
            setLoading(true);
            setError("");
            
            let url = "https://verdexai.onrender.com/api/justice-map";
            
            if (city || type) {
                const params = new URLSearchParams();
                if (city) params.append("city", city);
                if (type) params.append("type", type);
                url += `?${params.toString()}`;
            } else {
                if (navigator.geolocation) {
                    try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject);
                        });
                        url += `?lat=${position.coords.latitude}&lng=${position.coords.longitude}`;
                    } catch (geoError) {
                        console.warn("Geolocation denied, falling back.", geoError);
                        url += `?city=Delhi`;
                    }
                } else {
                    url += `?city=Delhi`;
                }
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch locations");
            const data: JusticeLocation[] = await res.json();
            
            setLocations(data);
            if (data.length > 0) setSelectedLocation(data[0]);
        } catch (err: any) {
            setError("Unable to load nearby legal support.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return (
        <main className="pt-[80px] md:pt-[100px] min-h-screen bg-[#050505] text-[#F5F1EC] font-sans flex flex-col relative overflow-hidden">
            
            {/* Background Details */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-[#C9A45C]/5 rounded-full blur-[150px]" />
                <div className="absolute top-[50%] right-[5%] w-[800px] h-[800px] bg-[#3B2B28]/30 rounded-full blur-[150px]" />
                
                {/* Floating gold particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ y: 0, opacity: 0.1 }}
                        animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
                        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-1.5 h-1.5 bg-[#C9A45C] rounded-full blur-[1px]"
                        style={{ top: `${(i * 37) % 100}%`, left: `${(i * 61) % 100}%` }}
                    />
                ))}

                <Scale className="absolute top-[10%] -right-[15%] w-[1000px] h-[1000px] text-[#F5F1EC] opacity-[0.03] pointer-events-none rotate-12" />
            </div>

            {/* Split Screen Layout */}
            <div className="flex flex-col lg:flex-row flex-1 z-10 w-full relative">
                
                {/* Left Selection Panel (38%) */}
                <div className="w-full lg:w-[38%] border-r border-[#C9A45C]/20 bg-[#050505]/80 backdrop-blur-3xl flex flex-col h-auto lg:h-[calc(100vh-100px)] overflow-y-auto no-scrollbar shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                    <div className="p-8 lg:p-10 flex flex-col h-full mx-auto w-full max-w-xl lg:max-w-none">
                        
                        {/* Header */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-8 h-[1px] bg-[#C9A45C]" />
                            <span className="text-[#C9A45C] font-bold tracking-[0.15em] uppercase text-xs">
                                NEAREST LEGAL SUPPORT
                            </span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-black mb-4 font-serif leading-tight">
                            Find legal help near you.
                        </h1>
                        <p className="text-[rgba(245,241,236,0.72)] font-light text-sm mb-10 leading-relaxed">
                            VERDEX connects you to nearby labour courts, legal aid centers, women support NGOs and consumer forums.
                        </p>

                        {/* Search Bar */}
                        <div className="relative mb-6 group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-[#C9A45C]" />
                            </div>
                            <input 
                                type="text"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        fetchLocations(searchCity, selectedType);
                                    }
                                }}
                                placeholder="Search by city or area"
                                className="w-full bg-[#161314] border border-[#C9A45C]/20 focus:border-[#C9A45C] rounded-full py-4 pl-14 pr-6 text-[#F5F1EC] text-sm outline-none transition-all placeholder:text-[#F5F1EC]/30 shadow-inner group-hover:border-[#C9A45C]/50"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-[#C9A45C]/10">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => {
                                        const newType = selectedType === filter ? "" : filter;
                                        setSelectedType(newType);
                                        fetchLocations(searchCity, newType);
                                    }}
                                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                                        selectedType === filter 
                                        ? "bg-[#C9A45C] text-[#050505] border-[#C9A45C] shadow-[0_0_15px_rgba(201,164,92,0.3)]" 
                                        : "bg-transparent text-[#C9A45C] border-[#3B2B28] hover:border-[#C9A45C]/50 hover:bg-[#3B2B28]/20"
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Nearby Results List */}
                        <div className="space-y-4 relative min-h-[300px]">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[#F5F1EC]/60 font-serif text-sm tracking-widest uppercase">Nearby Results</h4>
                            </div>

                            {error && (
                                <div className="bg-[#A94442]/10 border border-[#A94442] text-[#A94442] p-4 rounded-[12px] text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {loading && (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="rounded-[24px] border border-[#3B2B28] bg-[#0b0b0b] p-5 animate-pulse">
                                            <div className="h-6 w-3/4 bg-[#161314] rounded mb-3" />
                                            <div className="h-4 w-1/4 bg-[#C9A45C]/20 rounded mb-4" />
                                            <div className="h-4 w-full bg-[#161314] rounded mb-2" />
                                            <div className="h-4 w-5/6 bg-[#161314] rounded mb-6" />
                                            <div className="flex gap-2 mb-4">
                                                <div className="h-6 w-16 bg-[#161314] rounded-full" />
                                                <div className="h-6 w-16 bg-[#161314] rounded-full" />
                                            </div>
                                            <div className="flex justify-between">
                                                <div className="h-4 w-12 bg-[#161314] rounded" />
                                                <div className="h-4 w-16 bg-[#161314] rounded" />
                                                <div className="h-4 w-12 bg-[#161314] rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && locations.length === 0 && !error && (
                                <div className="text-center py-10">
                                    <p className="text-[#F5F1EC]/60">No nearby legal help found.</p>
                                </div>
                            )}

                            {!loading && locations.map((location) => (
                                <div
                                    key={location.name}
                                    onClick={() => setSelectedLocation(location)}
                                    className={`cursor-pointer rounded-[24px] border p-5 transition-all duration-300 ${
                                        selectedLocation?.name === location.name
                                            ? "border-[#C9A45C] bg-[#1a120f] shadow-[0_0_25px_rgba(201,164,92,0.2)]"
                                            : "border-[#3B2B28] bg-[#0b0b0b] hover:border-[#76422B]"
                                    }`}
                                >
                                    <h3 className="text-[#F5F1EC] text-xl font-semibold">
                                        {location.name}
                                    </h3>

                                    <p className="mt-1 text-[#C9A45C] text-sm">
                                        {location.type}
                                    </p>

                                    <p className="mt-3 text-[#cbbfb5] text-sm leading-6">
                                        {location.description}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {location.languages?.map((lang) => (
                                            <span key={lang} className="rounded-full border border-[#C9A45C]/30 px-3 py-1 text-xs text-[#F5F1EC]">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-5 flex justify-between text-sm text-[#d8c9bb]">
                                        <span>{location.distance} km</span>
                                        <span>{location.queueTime}</span>
                                        <span>{location.successRate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Map Panel (62%) */}
                <div className="w-full lg:w-[62%] h-[600px] lg:h-[calc(100vh-100px)] p-6 lg:p-10 flex flex-col relative z-20">
                    
                    {/* Map Container */}
                    <div className="flex-1 rounded-[32px] bg-[#0A0808] border border-[#C9A45C]/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex items-center justify-center w-full">
                        <InteractiveMap locations={locations} selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
                    </div>

                    {/* Bottom Strip */}
                    <div className="mt-6 flex items-center p-5 rounded-[20px] border border-[#C9A45C]/30 bg-gradient-to-r from-[#161314] to-[#3B2B28]/40 backdrop-blur-md shadow-lg group hover:border-[#C9A45C]/50 transition-colors">
                        <TrendingUp className="w-5 h-5 text-[#C9A45C] flex-shrink-0" />
                        <span className="text-[#F5F1EC] text-sm font-light tracking-wide ml-4 mr-auto leading-relaxed">
                            Most salary and labour disputes are resolved <strong className="text-[#C9A45C] font-semibold">faster</strong> when a legal notice is sent before visiting the court.
                        </span>
                        <ArrowRight className="w-5 h-5 text-[#C9A45C] -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0 ml-4 border border-[#C9A45C]/20 rounded-full p-0.5" />
                    </div>

                </div>
            </div>

            {/* Optional Secondary Section */}
            <div className="container mx-auto px-6 lg:px-10 py-16 pb-32 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-2xl lg:text-3xl font-serif font-black text-[#F5F1EC]">Suggested Next Steps</h2>
                </div>
                
                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting Gold Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A45C]/50 to-transparent -translate-y-1/2 z-0" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {[
                            { step: "1", title: "Send Legal Notice", icon: FileText },
                            { step: "2", title: "Visit Nearby Labour Office", icon: Building2 },
                            { step: "3", title: "File Complaint if No Response", icon: Scale }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#161314] border border-[#C9A45C]/20 rounded-[24px] p-8 flex flex-col items-center text-center group hover:-translate-y-2 hover:border-[#C9A45C]/50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                                <div className="w-16 h-16 rounded-full bg-[#050505] border-2 border-[#C9A45C] flex items-center justify-center mb-6 relative group-hover:bg-[#C9A45C]/10 transition-colors shadow-[0_0_20px_rgba(201,164,92,0.15)]">
                                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#3B2B28] border border-[#C9A45C] text-[#C9A45C] flex items-center justify-center font-black text-xs">{item.step}</span>
                                    <item.icon className="w-6 h-6 text-[#C9A45C]" />
                                </div>
                                <h3 className="text-[#F5F1EC] font-serif text-lg font-bold leading-tight px-4">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </main>
    );
}
