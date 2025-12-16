"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Need to create Badge or just use div
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, Monitor, Briefcase, Building, Shield, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

// Assuming types from Supabase
type ResourceAsset = {
    id: string;
    title: string;
    description: string | null;
    track: string;
    type: string;
    file_url: string;
    file_size: string | null;
    visibility: string;
    tags: string[] | null;
};

const TRACKS = [
    { id: "all", label: "All Resources", icon: null },
    { id: "banks", label: "Banks", icon: Building },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "hardware", label: "Hardware", icon: Monitor },
    { id: "saas", label: "SaaS", icon: Briefcase },
    { id: "shared", label: "Shared", icon: Share2 },
];

export default function ResourcesClient({ initialResources }: { initialResources: ResourceAsset[] }) {
    const [activeTrack, setActiveTrack] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredResources = initialResources.filter((r) => {
        const matchesTrack = activeTrack === "all" || r.track === activeTrack;
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTrack && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    {TRACKS.map((track) => {
                        const Icon = track.icon;
                        return (
                            <Button
                                key={track.id}
                                variant={activeTrack === track.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveTrack(track.id)}
                                className={cn("h-8 rounded-full", activeTrack === track.id ? "bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white border-transparent" : "")}
                            >
                                {Icon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
                                {track.label}
                            </Button>
                        )
                    })}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search resources..."
                        className="pl-9 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources.length === 0 ? (
                    <div className="col-span-full">
                        <EmptyState
                            icon={Search}
                            title="No resources found"
                            description="Try adjusting your search filters or check back later for new materials."
                        />
                    </div>
                ) : (
                    filteredResources.map((resource) => (
                        <div key={resource.id} className="group relative flex flex-col rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[var(--accent)]">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border px-2 py-0.5 rounded-full">
                                    {resource.type}
                                </span>
                            </div>

                            <h3 className="font-semibold leading-tight text-gray-900 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                                {resource.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-3 flex-1">
                                {resource.description}
                            </p>

                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <span className="text-xs text-gray-400 capitalize">{resource.track} Track</span>
                                <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-[var(--accent)] hover:bg-orange-50 hover:text-orange-700">
                                    Download
                                    <Download className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
