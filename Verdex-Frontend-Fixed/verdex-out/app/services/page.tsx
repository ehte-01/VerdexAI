"use client";

import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { Building2, Factory, HardHat, Warehouse, ArrowRight } from "lucide-react";
import Image from "next/image";

const services = [
    {
        title: "Buildings",
        icon: Building2,
        description: "We construct commercial, institutional, and residential buildings that shape skylines and communities.",
        items: ["Office Towers", "Healthcare Facilities", "Educational Institutions", "Residential Complexes"],
        image: "https://images.unsplash.com/photo-1574349788755-f2d4ee758c0c?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Civil Infrastructure",
        icon: Factory,
        description: "Building the backbone of society with bridges, roads, water treatment plants, and transit systems.",
        items: ["Transportation", "Water & Wastewater", "Renewable Energy", "Public Infrastructure"],
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Industrial",
        icon: Warehouse,
        description: "Delivering complex industrial projects for energy, mining, and manufacturing sectors.",
        items: ["Oil & Gas", "Power Generation", "Mining & Metals", "Manufacturing"],
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1968&auto=format&fit=crop"
    },
    {
        title: "Special Projects",
        icon: HardHat,
        description: "Dedicated teams for smaller, unique projects requiring agility and specialized expertise.",
        items: ["Tenant Improvements", "Renovations", "Historic Restoration", "Rapid Response"],
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop"
    }
];

export default function ServicesPage() {
    return (
        <div className="pt-24">
            <div className="bg-primary py-20 text-center text-white">
                <h1 className="text-5xl font-bold mb-4">Our Markets</h1>
                <p className="text-xl text-neutral-300">Expertise across every sector of the construction industry.</p>
            </div>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-16">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}
                            >
                                <div className="w-full lg:w-1/2">
                                    <div className="relative h-80 lg:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="p-3 bg-neutral-100 rounded-full text-primary">
                                            <service.icon size={32} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-primary">{service.title}</h2>
                                    </div>
                                    <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {service.items.map((item, i) => (
                                            <div key={i} className="flex items-center space-x-2 text-neutral-700">
                                                <ArrowRight size={16} className="text-secondary" />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
