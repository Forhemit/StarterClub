"use client";

import React from "react";
import { Check } from "lucide-react";

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const tableData = [
    { category: "Commons Access", starter: "✔️", builder: "✔️", founder: "✔️" },
    { category: "Members Area", starter: "—", builder: "✔️", founder: "✔️" },
    { category: "Focus Rooms", starter: "—", builder: "Daily Access", founder: "Extended Access" },
    { category: "Workshop Rooms", starter: "—", builder: "✔️", founder: "✔️ Priority" },
    { category: "Super Stations", starter: "—", builder: "Included Time", founder: "Unlimited" },
    { category: "Guest Passes", starter: "—", builder: "Monthly", founder: "More Monthly" },
    { category: "Starter Roadmap", starter: "Lite", builder: "Full", founder: "Pro" },
    { category: "Weekly Classes", starter: "Intro Only", builder: "All", founder: "All + Advanced" },
    { category: "Templates Library", starter: "Basic", builder: "Builder Library", founder: "Founder Toolkit" },
    { category: "Coaching", starter: "Group Monthly", builder: "1:1 Monthly", founder: "1:1 Monthly + Quarterly Strategy Review" },
    { category: "Collaboration Pods", starter: "—", builder: "Priority", founder: "Guaranteed" },
    { category: "Operator Club", starter: "—", builder: "✔️", founder: "✔️" },
    { category: "Founders Circle", starter: "—", builder: "—", founder: "✔️" },
    { category: "Milestone Awards", starter: "Eligible", builder: "Eligible", founder: "Priority" },
    { category: "Wins Wall Visibility", starter: "View Only", builder: "Featured", founder: "High Visibility + Spotlight" },
    { category: "Pitch/Demo Events", starter: "—", builder: "Eligible", founder: "Priority Presenter" },
    { category: "Partner Discounts", starter: "Basic", builder: "Enhanced", founder: "Premium" },
    { category: "Add-on Discounts", starter: "—", builder: "Yes", founder: "Larger Discounts" },
];

function renderTableValue(value: string) {
    if (value === "✔️" || value === "Yes") return <Check className="w-5 h-5 text-black" />;
    if (value === "—") return <span className="text-black/20 text-xl font-light">—</span>;
    if (value.includes("✔️")) {
        return <span className="flex items-center gap-2"><Check className="w-4 h-4" /> {value.replace("✔️", "").trim()}</span>
    }
    return value;
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 border-b border-black/5 shrink-0 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <DialogTitle className="font-bebas text-3xl uppercase tracking-wide text-black">
                            Compare Memberships
                        </DialogTitle>
                        <DialogDescription className="text-black/60 font-sans text-sm mt-1">
                            Find the right plan for your journey
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="overflow-auto p-6">
                    <table className="w-full text-left font-sans text-sm md:text-base">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b-2 border-black/10">
                                <th className="py-4 px-4 font-bold text-black/40 uppercase tracking-widest text-xs w-1/4">Feature Category</th>
                                <th className="py-4 px-4 font-bold text-black text-lg w-1/4 bg-blue-50/10">Free Member</th>
                                <th className="py-4 px-4 font-bold text-black text-lg w-1/4 bg-green-50/10">Builder</th>
                                <th className="py-4 px-4 font-bold text-black text-lg w-1/4 bg-red-50/10">Founder</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {tableData.map((row, i) => (
                                <tr key={i} className="hover:bg-black/[0.02] transition-colors">
                                    <td className="py-4 px-4 font-medium text-black/70">{row.category}</td>
                                    <td className="py-4 px-4 text-black/80">{renderTableValue(row.starter)}</td>
                                    <td className="py-4 px-4 text-black/80 font-medium">{renderTableValue(row.builder)}</td>
                                    <td className="py-4 px-4 text-black/80 font-medium">{renderTableValue(row.founder)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-black/5 shrink-0 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-black/80 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
