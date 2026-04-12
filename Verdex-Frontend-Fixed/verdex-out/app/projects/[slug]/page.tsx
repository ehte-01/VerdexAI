"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock data (in a real app this would be fetched)
const projectsData: Record<string, any> = {
    "stadium-reno": {
        title: "City Stadium Renovation",
        category: "Buildings",
        location: "Toronto, ON",
        description: "A comprehensive modernization of the historic City Stadium, increasing capacity by 15,000 seats and adding state-of-the-art amenities. The project involved complex structural reinforcement and a new retractable roof system.",
        stats: [
            { label: "Value", value: "$450 Million" },
            { label: "Duration", value: "32 Months" },
            { label: "Size", value: "1.2M sq ft" }
        ],
        features: ["Retractable Roof", "Premium Suites", "accessibility upgrades"],
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    // Add fallback for others or just handle generic
};

export default function ProjectDetailPage() {
    const params = useParams();
    // Safe cast params.slug to string if it exists, otherwise empty. 
    // Next.js params can be string or string[].
    const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";

    // For demo purposes, we'll return a generic project if the slug isn't in our mock data, 
    // or the specific one if it matches "stadium-reno". 
    // In a real app, `notFound()` would be called.
    const project = projectsData[slug] || {
        title: "Project Detail Demo",
        category: "General",
        location: "Global",
        description: "This is a demonstration of the project detail page layout. In a production environment, this data would be dynamically fetched based on the URL slug.",
        stats: [
            { label: "Value", value: "$100M+" },
            { label: "Duration", value: "24 Months" },
            { label: "Size", value: "500k sq ft" }
        ],
        features: ["Sustainable Design", "LEED Gold", "Innovative Safety"],
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop"
    };

    return (
        <div className="pt-24 min-h-screen pb-20">
            {/* Hero */}
            <div className="relative h-[60vh] w-full">
                <Image src={project.image} alt={project.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <span className="text-secondary font-bold uppercase tracking-wider mb-2 block">{project.category}</span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-4"
                        >
                            {project.title}
                        </motion.h1>
                        <p className="text-xl text-neutral-200">{project.location}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <Link href="/projects" className="inline-flex items-center text-neutral-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <SectionHeader title="Project Overview" />
                        <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                            {project.description}
                        </p>

                        <h3 className="text-2xl font-bold text-primary mb-4">Key Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.features.map((feature: string, idx: number) => (
                                <li key={idx} className="flex items-center space-x-2 text-neutral-700">
                                    <CheckCircle className="h-5 w-5 text-secondary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-neutral-50 p-8 rounded-lg h-fit border border-neutral-200">
                        <h3 className="text-xl font-bold text-primary mb-6">Project Stats</h3>
                        <div className="space-y-6">
                            {project.stats.map((stat: any, idx: number) => (
                                <div key={idx} className="border-b border-neutral-200 pb-4 last:border-0 last:pb-0">
                                    <span className="block text-neutral-500 text-sm">{stat.label}</span>
                                    <span className="block text-2xl font-bold text-neutral-800">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
