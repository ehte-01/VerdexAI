"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    alignment?: "left" | "center";
    className?: string;
}

export default function SectionHeader({
    title,
    subtitle,
    alignment = "left",
    className,
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                "mb-12",
                alignment === "center" ? "text-center" : "text-left",
                className
            )}
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-primary mb-4"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="h-1 w-20 bg-secondary mb-6 mx-auto md:mx-0"
                    style={{ marginLeft: alignment === "center" ? "auto" : 0, marginRight: alignment === "center" ? "auto" : 0 }}
                />
            )}
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-neutral-600 text-lg max-w-2xl mx-auto md:mx-0"
                    style={{ marginLeft: alignment === "center" ? "auto" : 0, marginRight: alignment === "center" ? "auto" : 0 }}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
