"use client";

import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Placeholder projects
const projects = [
    {
        id: "stadium-reno",
        title: "City Stadium Renovation",
        category: "Buildings",
        location: "Toronto, ON",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "bridge-span",
        title: "Harbor Bridge Expansion",
        category: "Civil",
        location: "Vancouver, BC",
        image: "https://images.unsplash.com/photo-1545558014-a9756f1af0eb?q=80&w=2666&auto=format&fit=crop"
    },
    {
        id: "energy-plant",
        title: "Solar Energy Facility",
        category: "Industrial",
        location: "Calgary, AB",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop"
    },
    {
        id: "hospital-wing",
        title: "General Hospital New Wing",
        category: "Buildings",
        location: "Edmonton, AB",
        image: "https://images.unsplash.com/photo-1587351021759-3e566b9af9ef?q=80&w=2072&auto=format&fit=crop"
    },
    {
        id: "airport-terminal",
        title: "International Airport Terminal",
        category: "Civil",
        location: "Montreal, QC",
        image: "https://images.unsplash.com/photo-1530521954077-a6c813833d16?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "tech-campus",
        title: "Innovation Tech Campus",
        category: "Buildings",
        location: "Ottawa, ON",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    }
];

export default function ProjectsPage() {
    return (
        <div className="pt-24">
            <div className="bg-neutral-900 py-20 text-center text-white">
                <h1 className="text-5xl font-bold mb-4">Our Projects</h1>
                <p className="text-xl text-neutral-400">Showcasing our diverse portfolio of excellence.</p>
            </div>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <Link href={`/projects/${project.id}`} key={project.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="group relative h-80 rounded-lg overflow-hidden cursor-pointer shadow-lg"
                                >
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                                        <span className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">{project.category}</span>
                                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-secondary transition-colors">{project.title}</h3>
                                        <p className="text-neutral-300 text-sm flex items-center justify-between">
                                            {project.location}
                                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
