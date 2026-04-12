"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scale, Shield, FileText, MapPin, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { TranslationKey } from "@/lib/i18n";

const navLinks: { key: TranslationKey; href: string; icon: any }[] = [
    { key: "nav.situation", href: "/situation", icon: Scale },
    { key: "nav.shield", href: "/shield", icon: Shield },
    { key: "nav.draft", href: "/draft", icon: FileText },
    { key: "nav.justiceMap", href: "/justice-map", icon: MapPin },
    { key: "nav.whistleblower", href: "/whistleblower", icon: Eye },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { lang, setLang, t } = useLanguage();
    const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
    const pathname = usePathname();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500",
                isScrolled
                    ? "bg-neutral-900/80 backdrop-blur-xl shadow-2xl py-3 border-b border-white/5"
                    : "bg-gradient-to-base from-neutral-900/50 to-transparent py-5 text-white"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 group perspective-1000">
                    <motion.div 
                        whileHover={{ rotateY: 15, scale: 1.05 }}
                        className="h-10 w-10 border-2 border-secondary flex items-center justify-center rounded-sm bg-gradient-to-br from-secondary/10 to-transparent shadow-[0_0_15px_rgba(201,164,92,0.15)]"
                    >
                        <Scale className="text-secondary h-5 w-5" />
                    </motion.div>
                    <span className="text-xl md:text-2xl font-[900] uppercase tracking-widest font-serif text-neutral-50 drop-shadow-md hidden lg:block group-hover:text-secondary transition-colors duration-300">
                        VERDEX
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 bg-primary-dark/30 p-1.5 rounded-full border border-white/5 backdrop-blur-md relative"
                     onMouseLeave={() => setHoveredLink(null)}>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const name = t(link.key);
                        const isActive = pathname === link.href || (link.key === "nav.situation" && pathname === "/"); 
                        
                        return (
                            <Link
                                key={link.key}
                                href={link.href}
                                onMouseEnter={() => setHoveredLink(link.key)}
                                className={cn(
                                    "flex items-center space-x-2 text-[13px] lg:text-sm font-semibold transition-all group relative px-4 lg:px-5 py-2.5 rounded-full z-10 uppercase tracking-widest overflow-hidden",
                                    isActive
                                        ? "text-secondary"
                                        : "text-neutral-50/80 hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 transition-transform duration-300", isActive || hoveredLink === link.key ? "scale-110" : "")} />
                                <span>{name}</span>
                                
                                {/* Active State Background */}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeNavIndicator"
                                        className="absolute inset-0 bg-secondary/10 rounded-full border border-secondary/20 z-[-1]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                
                                {/* Hover State Background */}
                                {hoveredLink === link.key && !isActive && (
                                    <motion.div 
                                        layoutId="hoverNavIndicator"
                                        className="absolute inset-0 bg-white/5 rounded-full z-[-1]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Elegant Language Toggle Pill */}
                <div className="hidden md:flex items-center bg-neutral-900 border border-white/10 p-1 rounded-full shadow-inner relative">
                    {(["EN", "HI"] as const).map((item) => (
                        <button 
                            key={item}
                            onClick={() => setLang(item)}
                            className={cn(
                                "relative px-5 py-2 text-xs font-black rounded-full transition-colors z-10 tracking-widest",
                                lang === item ? "text-primary-dark" : "text-neutral-50/60 hover:text-white"
                            )}
                        >
                            {item === "HI" ? "हिं" : "EN"}
                            {lang === item && (
                                <motion.div 
                                    layoutId="langToggle"
                                    className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-light rounded-full z-[-1] shadow-[0_0_10px_rgba(201,164,92,0.3)]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 w-full bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-2">
                            {navLinks.map((link, i) => {
                                const Icon = link.icon;
                                const name = t(link.key);
                                const isActive = pathname === link.href || (link.key === "nav.situation" && pathname === "/");
                                return (
                                    <motion.div
                                        key={link.key}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "flex items-center space-x-4 text-sm uppercase tracking-widest p-4 rounded-lg transition-all",
                                                isActive ? "bg-secondary/10 text-secondary border border-secondary/20" : "text-neutral-50/80 hover:bg-white/5 hover:text-white border border-transparent"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Icon className={cn("h-5 w-5", isActive ? "text-secondary" : "text-neutral-50/50")} />
                                            <span className="font-bold">{name}</span>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="pt-6 mt-4 border-t border-white/10 flex items-center justify-center space-x-2"
                            >
                                {(["EN", "HI"] as const).map((item) => (
                                    <button 
                                        key={item}
                                        onClick={() => { setLang(item); setIsOpen(false); }}
                                        className={cn(
                                            "flex-1 py-3 text-sm font-bold rounded-lg transition-all tracking-wider relative overflow-hidden",
                                            lang === item ? "text-primary-dark shadow-[0_0_15px_rgba(201,164,92,0.2)]" : "text-neutral-50/60 bg-white/5 hover:bg-white/10 border border-white/5"
                                        )}
                                    >
                                        {item === "HI" ? "हिं" : "EN"}
                                        {lang === item && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-light z-[-1]" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
