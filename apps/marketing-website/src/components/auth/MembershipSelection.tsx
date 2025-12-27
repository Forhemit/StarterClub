"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ShieldCheck, CheckCircle2, Star, ChevronDown, ChevronUp, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Plan = {
    id: string;
    title: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    popular?: boolean;
    buttonText: string;
    highlight?: string;
};

const plans: Plan[] = [
    {
        id: "free",
        title: "Starter Member",
        price: "$0",
        description: "Join the conversation and explore size.",
        features: [
            "Commons Access",
            "Starter Roadmap (Lite)",
            "Weekly Classes (Intro Only)",
            "Partner Discounts (Basic)"
        ],
        buttonText: "Join for Free"
    },
    {
        id: "builder",
        title: "Starter Builder",
        price: "$49",
        period: "/mo",
        description: "Tools, templates, and rooms to build your business.",
        features: [
            "Everything in Member",
            "Daily Focus Rooms",
            "Workshop Rooms",
            "Builder Template Library",
            "1:1 Monthly Coaching"
        ],
        popular: true,
        buttonText: "Select Builder",
        highlight: "Most Popular"
    },
    {
        id: "founder",
        title: "Starter Founder",
        price: "$299",
        period: "/mo",
        description: "Full access, strategic guidance, and exclusive circles.",
        features: [
            "Everything in Builder",
            "Founders Circle Access",
            "Unlimited Super Stations",
            "Priority Pitch/Demo Events",
            "Quarterly Strategy Review"
        ],
        buttonText: "Select Founder",
        highlight: "Best Value"
    }
];

const comparisonData = [
    { feature: "Commons Access", free: "✔️", builder: "✔️", founder: "✔️" },
    { feature: "Members Area", free: "—", builder: "✔️", founder: "✔️" },
    { feature: "Focus Rooms", free: "—", builder: "Daily Access", founder: "Extended Access" },
    { feature: "Workshop Rooms", free: "—", builder: "✔️", founder: "✔️ Priority" },
    { feature: "Super Stations", free: "—", builder: "Included Time", founder: "Unlimited" },
    { feature: "Guest Passes", free: "—", builder: "Monthly", founder: "More Monthly" },
    { feature: "Starter Roadmap", free: "Lite", builder: "Full", founder: "Pro" },
    { feature: "Weekly Classes", free: "Intro Only", builder: "All", founder: "All + Advanced" },
    { feature: "Templates Library", free: "Basic", builder: "Builder Library", founder: "Founder Toolkit" },
    { feature: "Coaching", free: "Group Monthly", builder: "1:1 Monthly", founder: "1:1 Monthly + Quarterly Strategy" },
    { feature: "Collaboration Pods", free: "—", builder: "Priority", founder: "Guaranteed" },
    { feature: "Operator Club", free: "—", builder: "✔️", founder: "✔️" },
    { feature: "Founders Circle", free: "—", builder: "—", founder: "✔️" },
    { feature: "Milestone Awards", free: "Eligible", builder: "Eligible", founder: "Priority" },
    { feature: "Wins Wall Visibility", free: "View Only", builder: "Featured", founder: "High Visibility + Spotlight" },
    { feature: "Pitch/Demo Events", free: "—", builder: "Eligible", founder: "Priority Presenter" },
    { feature: "Partner Discounts", free: "Basic", builder: "Enhanced", founder: "Premium" },
    { feature: "Add-on Discounts", free: "—", builder: "Yes", founder: "Larger Discounts" },
];

const faqs = [
    { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time from your dashboard. Prorated charges or refunds will apply automatically." },
    { q: "What is the refund policy?", a: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, just let us know and we'll refund you, no questions asked." },
    { q: "Do I need a credit card for the Free plan?", a: "No, the Starter Member plan is completely free forever. No credit card required to sign up." },
    { q: "What are Focus Rooms?", a: "Focus Rooms are virtual coworking spaces designed for deep work. Builders get daily access to these moderated sessions." },
    { q: "How does the Coaching work?", a: "Builders get a 1:1 monthly check-in. Founders get a more in-depth monthly session plus a quarterly strategic review of their business roadmap." }
];

interface MembershipSelectionProps {
    onSelect: (planId: string) => void;
}

export default function MembershipSelection({ onSelect }: MembershipSelectionProps) {
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const displayedFeatures = showAllFeatures ? comparisonData : comparisonData.slice(0, 8);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 space-y-20 pb-24 font-sans">
            {/* Header Section */}
            <div className="text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bebas font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/50">
                        CHOOSE YOUR PATH
                    </h1>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light"
                >
                    Unlock the tools, network, and guidance to accelerate your journey.
                </motion.p>

                {/* Trust Signals */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground pt-4"
                >
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-border/50"><ShieldCheck className="w-4 h-4 text-emerald-500" /> SSL Secured</span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-border/50"><CheckCircle2 className="w-4 h-4 text-sky-500" /> GDPR Compliant</span>
                    <span className="flex items-center gap-3 px-3 py-1 rounded-full bg-secondary/30 border border-border/50">
                        <span className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="user" className="w-full h-full" />
                                </div>
                            ))}
                        </span>
                        <span>Join 10,000+ marketers</span>
                    </span>
                </motion.div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + 0.5, type: "spring", stiffness: 100 }}
                        className={cn("flex", plan.popular ? "md:-mt-8 md:mb-8" : "")}
                    >
                        <Card className={cn(
                            "flex flex-col h-full w-full relative transition-all duration-500 hover:shadow-2xl overflow-hidden backdrop-blur-sm",
                            plan.popular
                                ? "border-primary/50 bg-card/80 shadow-primary/10 z-20 scale-105"
                                : "border-border/50 bg-card/40 hover:bg-card/60 hover:border-primary/30"
                        )}>
                            {plan.highlight && (
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                            )}
                            {plan.popular && (
                                <div className="absolute top-4 right-4 animate-pulse">
                                    <span className="px-3 py-1 text-xs font-bold text-primary-foreground bg-primary rounded-full shadow-lg shadow-primary/20">
                                        {plan.highlight}
                                    </span>
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <CardTitle className="text-3xl font-bebas tracking-wide">{plan.title}</CardTitle>
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                                    {plan.period && <span className="text-xl text-muted-foreground">{plan.period}</span>}
                                </div>
                                <CardDescription className="text-base mt-2 font-medium">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 pt-6">
                                <div className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3 group">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="text-sm leading-relaxed">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 pt-6 bg-secondary/5">
                                <Button
                                    size="lg"
                                    className={cn(
                                        "w-full text-base font-semibold tracking-wide transition-all duration-300 transform group-hover:translate-x-1",
                                        plan.popular
                                            ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                                    )}
                                    variant={plan.popular ? "default" : "secondary"}
                                    onClick={() => onSelect(plan.id)}
                                >
                                    {plan.buttonText}
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                                {plan.price !== "$0" && (
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center font-semibold flex items-center justify-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> 30-day money-back guarantee
                                    </p>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Comparison Table */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8 pt-16 max-w-5xl mx-auto"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bebas tracking-wide">Compare Features</h2>
                    <p className="text-muted-foreground">Detailed breakdown of what's included in each plan.</p>
                </div>

                <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="w-[30%] py-4 pl-6 text-foreground font-bold">Feature Category</TableHead>
                                <TableHead className="text-center py-4 text-foreground font-bold">Starter Member <span className="text-muted-foreground font-normal text-xs ml-1">(Free)</span></TableHead>
                                <TableHead className="text-center py-4 text-primary font-bold">Starter Builder</TableHead>
                                <TableHead className="text-center py-4 text-foreground font-bold">Starter Founder</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence initial={false}>
                                {displayedFeatures.map((row, i) => (
                                    <TableRow key={row.feature} className="hover:bg-muted/20 border-border/50 transition-colors">
                                        <TableCell className="font-medium pl-6 py-4">{row.feature}</TableCell>
                                        <TableCell className="text-center text-muted-foreground py-4">{row.free === "✔️" ? <Check className="w-4 h-4 mx-auto text-foreground" /> : row.free}</TableCell>
                                        <TableCell className="text-center font-medium bg-primary/5 py-4">{row.builder === "✔️" ? <Check className="w-4 h-4 mx-auto text-primary" /> : row.builder}</TableCell>
                                        <TableCell className="text-center font-medium py-4">{row.founder === "✔️" ? <Check className="w-4 h-4 mx-auto text-foreground" /> : row.founder}</TableCell>
                                    </TableRow>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>

                    <div className="p-4 flex justify-center bg-muted/10 border-t border-border/50">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                            className="text-muted-foreground hover:text-primary gap-2"
                        >
                            {showAllFeatures ? (
                                <>Show Less <ChevronUp className="w-4 h-4" /></>
                            ) : (
                                <>Show All {comparisonData.length} Features <ChevronDown className="w-4 h-4" /></>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 max-w-5xl mx-auto">
                <Card className="bg-gradient-to-br from-card/50 to-muted/20 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center space-x-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-xl font-medium leading-relaxed">"The Builder plan gave me the exact templates I needed to launch in weeks, not months. The daily focus rooms are a game changer for productivity."</p>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full ring-2 ring-border overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground">Sarah Jenkins</p>
                                <p className="text-sm text-muted-foreground">Founder, EcoStyle</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-card/50 to-muted/20 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center space-x-1 text-amber-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-xl font-medium leading-relaxed">"The network alone is worth the Founder membership. I found my co-founder here and the quarterly strategy reviews keep us on track."</p>
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full ring-2 ring-border overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" alt="Mike" />
                            </div>
                            <div>
                                <p className="font-bold text-foreground">Mike Thompson</p>
                                <p className="text-sm text-muted-foreground">CEO, TechFlow</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* FAQ Accordion */}
            <div className="max-w-3xl mx-auto space-y-8 pt-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bebas tracking-wide">Frequency Asked Questions</h2>
                </div>
                <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((item, i) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-border/50 px-2">
                                    <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors py-4">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
