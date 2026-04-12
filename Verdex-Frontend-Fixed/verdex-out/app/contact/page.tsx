"use client";

import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, FormEvent } from "react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="pt-24 min-h-screen pb-20 bg-neutral-50">
            <section className="bg-primary py-20 text-center text-white mb-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-neutral-300">Ready to start your next project? Get in touch with us.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div>
                    <SectionHeader title="Get in Touch" subtitle="Our team is ready to answer your questions." />
                    <p className="text-lg text-neutral-600 mb-8">
                        Whether you're looking for a partner on your next construction project or have questions about our services, we're here to help.
                    </p>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-neutral-100">
                            <div className="bg-secondary/10 p-3 rounded-full text-secondary"><Phone className="h-6 w-6" /></div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">General Inquiries</p>
                                <p className="text-lg font-bold text-primary">+1 (800) 555-0199</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-neutral-100">
                            <div className="bg-secondary/10 p-3 rounded-full text-secondary"><Mail className="h-6 w-6" /></div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Email Us</p>
                                <p className="text-lg font-bold text-primary">info@pclstyle.com</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-neutral-100">
                            <div className="bg-secondary/10 p-3 rounded-full text-secondary"><MapPin className="h-6 w-6" /></div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Headquarters</p>
                                <p className="text-lg font-bold text-primary">123 Construction Blvd, Edmonton, AB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-primary mb-6">Send us a Message</h3>
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-64 text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckIcon />
                            </div>
                            <h4 className="text-xl font-bold text-neutral-900 mb-2">Message Sent!</h4>
                            <p className="text-neutral-600">Thank you for contacting us. We will get back to you shortly.</p>
                            <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send Another</Button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-neutral-700">First Name</label>
                                    <input
                                        required
                                        id="firstName"
                                        type="text"
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-neutral-700">Last Name</label>
                                    <input
                                        required
                                        id="lastName"
                                        type="text"
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email Address</label>
                                <input
                                    required
                                    id="email"
                                    type="email"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="john@company.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-neutral-700">Subject</label>
                                <select
                                    id="subject"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                                >
                                    <option>General Inquiry</option>
                                    <option>New Project</option>
                                    <option>Careers</option>
                                    <option>Media</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-neutral-700">Message</label>
                                <textarea
                                    required
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Send Message <Send className="ml-2 h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    )
}
