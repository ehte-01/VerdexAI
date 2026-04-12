"use client";

import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CareersPage() {
    const benefits = [
        "Employee Ownership Program",
        "Competitive Salary & Bonuses",
        "Comprehensive Health Benefits",
        "Professional Development",
        "Global Opportunities",
        "Community Involvement",
    ];

    const jobs = [
        { title: "Project Manager", location: "Toronto, ON", type: "Full-time" },
        { title: "Site Superintendent", location: "Vancouver, BC", type: "Full-time" },
        { title: "Estimator", location: "Denver, CO", type: "Full-time" },
        { title: "Safety Coordinator", location: "Calgary, AB", type: "Full-time" },
    ];

    return (
        <div className="pt-24">
            <div className="bg-neutral-900 py-20 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" alt="Background" fill className="object-cover" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-4">Build Your Career</h1>
                    <p className="text-xl text-neutral-400">Join a team of employee-owners building the future.</p>
                    <Link href="#opportunities">
                        <Button size="lg" className="mt-8 bg-secondary hover:bg-secondary/90 text-white">View Openings</Button>
                    </Link>
                </div>
            </div>

            <section className="py-20">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeader title="Why Join Us?" subtitle="More than just a job, it's a partnership." />
                        <p className="text-lg text-neutral-600 mb-8">
                            We refer to our people as partners because they have a stake in our success. Our employee ownership model empowers you to take initiative, innovate, and share in the rewards of our collective achievements.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                    <div className="bg-secondary/10 p-1 rounded-full"><Check className="h-4 w-4 text-secondary" /></div>
                                    <span className="text-neutral-700 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
                        <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" alt="Teamwork" fill className="object-cover" />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-neutral-50" id="opportunities">
                <div className="container mx-auto px-4">
                    <SectionHeader title="Current Opportunities" alignment="center" className="mb-12" />
                    <div className="max-w-4xl mx-auto space-y-4">
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-shadow"
                            >
                                <div className="mb-4 md:mb-0 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-primary">{job.title}</h3>
                                    <p className="text-neutral-500">{job.location} • {job.type}</p>
                                </div>
                                <Link href="/contact">
                                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Apply Now</Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <p className="text-neutral-600 mb-4">Don't see your role?</p>
                        <Link href="/contact">
                            <Button variant="ghost" className="text-secondary hover:text-secondary/80 hover:bg-neutral-100">
                                <UserPlus className="mr-2 h-4 w-4" /> Join our Talent Network
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
