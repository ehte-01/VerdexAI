"use client";

import SectionHeader from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";

// Mock Data
const locations = [
    {
        region: "Canada",
        offices: [
            { city: "Toronto", address: "2085 Hurontario St, Mississauga, ON", phone: "+1 905-276-7600" },
            { city: "Vancouver", address: "13911 Wireless Way, Richmond, BC", phone: "+1 604-241-5200" },
            { city: "Edmonton", address: "5410 99 St NW, Edmonton, AB", phone: "+1 780-435-9711" },
            { city: "Calgary", address: "28 Quarry Park Blvd SE, Calgary, AB", phone: "+1 403-250-4800" },
        ]
    },
    {
        region: "United States",
        offices: [
            { city: "Denver", address: "2000 S Colorado Blvd, Denver, CO", phone: "+1 303-365-6500" },
            { city: "Orlando", address: "400 W Robinson St, Orlando, FL", phone: "+1 407-363-0059" },
            { city: "Minneapolis", address: "12200 Nicollet Ave, Burnsville, MN", phone: "+1 952-882-9600" },
            { city: "Seattle", address: "13920 SE Eastgate Way, Bellevue, WA", phone: "+1 425-454-8020" },
        ]
    },
    {
        region: "Australia",
        offices: [
            { city: "Melbourne", address: "600 Bourke St, Melbourne VIC", phone: "+61 3 9999 9999" },
        ]
    }
];

export default function LocationsPage() {
    return (
        <div className="pt-24 min-h-screen pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader title="Our Locations" subtitle="Constructing success across North America and Australia." alignment="center" className="mb-16" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Map Placeholder */}
                    <div className="bg-neutral-100 rounded-lg p-4 h-[400px] lg:h-auto flex items-center justify-center relative overflow-hidden shadow-inner">
                        {/* Simulated Map Visual */}
                        <div className="absolute inset-0 bg-neutral-200 opacity-50" style={{ backgroundImage: "radial-gradient(#ccc 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                        <p className="text-neutral-500 font-medium z-10 relative bg-white px-4 py-2 rounded-md shadow-sm">Map Visualization Placeholder</p>
                        {/* Dots representing locations */}
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="absolute top-[30%] left-[25%] w-3 h-3 bg-secondary rounded-full shadow-lg border border-white" />
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} className="absolute top-[35%] left-[30%] w-3 h-3 bg-secondary rounded-full shadow-lg border border-white" />
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} className="absolute top-[50%] left-[60%] w-3 h-3 bg-secondary rounded-full shadow-lg border border-white" />
                    </div>

                    {/* List */}
                    <div>
                        {locations.map((region, idx) => (
                            <div key={idx} className="mb-12 last:mb-0">
                                <h2 className="text-2xl font-bold text-primary mb-6 border-b border-neutral-200 pb-2">{region.region}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {region.offices.map((office, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-4 rounded-lg hover:bg-neutral-50 transition-colors"
                                        >
                                            <h3 className="text-lg font-bold text-neutral-800 mb-1">{office.city}</h3>
                                            <div className="flex items-start space-x-2 text-neutral-600 mb-1 text-sm">
                                                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-secondary" />
                                                <span>{office.address}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-neutral-600 text-sm">
                                                <Phone className="h-4 w-4 flex-shrink-0 text-secondary" />
                                                <span>{office.phone}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
