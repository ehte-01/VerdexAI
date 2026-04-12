"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });
    const { t } = useLanguage();

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={containerRef}
            className="relative h-[100dvh] w-full flex flex-col justify-center overflow-hidden bg-neutral-900"
        >
            {/* Parallax Background */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/verdex-hero.png"
                    alt="Lady Justice Scale and Gavel"
                    fill
                    className="object-cover scale-110 object-top" // scale to avoid edges
                    priority
                />
                {/* Specific Gradient Overlay for Verdex */}
                <div 
                    className="absolute inset-0" 
                    style={{ background: 'linear-gradient(90deg, rgba(12,10,10,0.85) 0%, rgba(27,18,15,0.72) 45%, rgba(12,10,10,0.45) 100%)' }}
                />
            </motion.div>

            {/* Content */}
            <div className="container relative z-10 px-6 mt-16 md:mt-0 flex-1 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} 
                    className="max-w-3xl"
                >


                    <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black text-neutral-50 mb-6 leading-[0.9] tracking-tight font-serif">
                        <span className="block mb-2">{t("hero.title1")}</span>
                        <span className="text-secondary">{t("hero.title2")}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-50/75 mb-12 max-w-xl font-light leading-relaxed">
                        {t("hero.desc")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/situation">
                            <Button size="lg" className="bg-secondary hover:bg-transparent hover:text-secondary text-primary-dark border-2 border-secondary rounded-sm h-14 px-10 text-base font-bold tracking-widest uppercase transition-all duration-300 w-full sm:w-auto">
                                {t("hero.btn.explain")}
                            </Button>
                        </Link>
                        <Button 
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            size="lg" variant="outline" className="text-neutral-50 border-neutral-50/50 bg-transparent hover:bg-neutral-50/10 hover:border-secondary hover:text-secondary rounded-sm h-14 px-10 text-base font-bold tracking-widest uppercase transition-all duration-300 w-full sm:w-auto">
                            {t("hero.btn.features")}
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Stats Strip Inside Hero (Bottom) */}
            <div className="relative z-20 w-full mt-auto bg-neutral-900/60 backdrop-blur-md border-t border-white/10">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                        {[
                            { value: t("hero.stat1.val"), label: t("hero.stat1.lbl") },
                            { value: t("hero.stat2.val"), label: t("hero.stat2.lbl") },
                            { value: t("hero.stat3.val"), label: t("hero.stat3.lbl") },
                            { value: t("hero.stat4.val"), label: t("hero.stat4.lbl") },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                                className="p-6 md:p-8 flex flex-col justify-center"
                            >
                                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-neutral-50 mb-2 tracking-tight font-serif">
                                    {stat.value}
                                </div>
                                <div className="text-neutral-50/50 font-medium text-xs uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
