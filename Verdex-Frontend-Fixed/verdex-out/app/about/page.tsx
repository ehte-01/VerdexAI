"use client";

import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function HistorySection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931&auto=format&fit=crop"
                        alt="Company History"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-xl"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <SectionHeader title="Our History" subtitle="Building a legacy of trust since 1906." />
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                        Founded over a century ago, we started as a small family business and have grown into a global construction powerhouse. Our journey is defined by a relentless pursuit of excellence and a commitment to our people.
                    </p>
                    <p className="text-neutral-600 leading-relaxed">
                        From our first project to our latest landmark developments, our values have remained constant. We believe in doing business with integrity and transparency.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

function LeadershipSection() {
    const leaders = [
        { name: "Sarah Jenkins", role: "CEO & President", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" },
        { name: "David Chen", role: "Chief Operating Officer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
        { name: "Michael Ross", role: "VP of Construction", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop" },
        { name: "Emily White", role: "Chief Financial Officer", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" }
    ]

    return (
        <section className="py-20 bg-neutral-50">
            <div className="container mx-auto px-4">
                <SectionHeader title="Leadership Team" subtitle="Guiding our vision with experience and integrity." alignment="center" className="mb-16" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {leaders.map((leader, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-80 w-full bg-neutral-200">
                                <Image src={leader.image} alt={leader.name} fill className="object-cover" />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-primary mb-1">{leader.name}</h3>
                                <p className="text-secondary font-medium text-sm">{leader.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function ValuesSection() {
    return (
        <section className="py-20 bg-primary text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 border border-white/20 rounded-lg backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4">Integrity</h3>
                        <p className="text-neutral-300">We do what we say we will do. Trust is the foundation of our business.</p>
                    </div>
                    <div className="p-8 border border-white/20 rounded-lg backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4">Excellence</h3>
                        <p className="text-neutral-300">We strive for the highest standards in safety, quality, and performance.</p>
                    </div>
                    <div className="p-8 border border-white/20 rounded-lg backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-4">Collaboration</h3>
                        <p className="text-neutral-300">We work together as one team to achieve shared success.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function AboutPage() {
    return (
        <div className="pt-24">
            <div className="bg-neutral-900 py-20 text-center text-white">
                <h1 className="text-5xl font-bold mb-4">About Us</h1>
                <p className="text-xl text-neutral-400">Building relationships, not just structures.</p>
            </div>
            <HistorySection />
            <ValuesSection />
            <LeadershipSection />
        </div>
    );
}
