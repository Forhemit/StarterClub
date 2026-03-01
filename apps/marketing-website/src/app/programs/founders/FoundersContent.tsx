"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RaceTrackFooter } from "@/components/racetrack/RaceTrackFooter";

export function FoundersContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1771483907738-43ac1de8bf5e?q=80&w=2940&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/70 font-mono text-sm uppercase tracking-widest mb-4"
          >
            For Founders & Startups
          </motion.h2>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tighter mb-6"
          >
            Build Your Business <span className="text-primary">Right.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            First-time founders need more than hype. Get the tools, community, and 
            expert verification to build a business that lasts from day one.
          </motion.p>
        </div>
      </section>

      {/* Stacking Parallax Sections */}
      <div className="relative">
        {/* Section 1: Secure Vault - Base background */}
        <StickyFeatureSection
          number="01"
          title="Secure Vault"
          subtitle="Your Digital Fortress"
          description="Every founder needs a command center. Your Secure Vault is where critical business documents live, protected and organized. From incorporation papers to cap tables, IP assignments to vendor contracts—everything that matters, secured with bank-level encryption."
          features={[
            "End-to-end encrypted document storage",
            "Smart organization with AI tagging",
            "Version control for evolving contracts",
            "Secure sharing with investors & advisors",
            "2-minute setup, lifetime of protection"
          ]}
          image="https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1200&q=85"
          imageAlt="Hand holding a bunch of keys in front of a metal locker"
          index={0}
        />

        {/* Section 2: Business Health - With subtle pattern */}
        <StickyFeatureSection
          number="02"
          title="Business Health"
          subtitle="Prevent Problems Before They Start"
          description="Most startups don't fail—they bleed out slowly from preventable issues. Starter Club's Business Health scanner analyzes your company across 12 critical dimensions: financial runway, legal compliance, team dynamics, market position, and more."
          features={[
            "12-dimension resilience assessment",
            "AI-powered risk identification",
            "Prioritized action recommendations",
            "Benchmarking against 500+ startups",
            "Monthly health tracking & trends"
          ]}
          image="https://images.unsplash.com/photo-1766593771606-6218280a663c?w=1200&q=85"
          imageAlt="White heart drawn on frosted glass"
          index={1}
          hasPattern
        />

        {/* Section 3: Founder Network - With gradient */}
        <StickyFeatureSection
          number="03"
          title="Founder Network"
          subtitle="You're Not Alone"
          description="Building a startup is isolating. Our curated network of 200+ San Francisco founders changes that. Get introductions to potential co-founders, find advisors who've been there, and connect with peers facing the same challenges."
          features={[
            "200+ vetted SF founders",
            "Private Slack channels by stage & industry",
            "Weekly virtual meetups & AMAs",
            "Warm introductions to investors",
            "Co-founder matching program"
          ]}
          image="https://images.unsplash.com/photo-1763244737671-c2f6a51d465e?w=1200&q=85"
          imageAlt="Man in suit carrying briefcase on treadmill"
          index={2}
          hasGradient
        />

        {/* Section 4: War Games - With border accent */}
        <StickyFeatureSection
          number="04"
          title="War Games"
          subtitle="Practice Chaos Before It Finds You"
          description="When disaster strikes, you don't rise to the occasion—you fall to your level of preparation. Our tabletop simulations put you through realistic startup crises: co-founder disputes, failed funding rounds, key employee departures, and market shocks."
          features={[
            "8 realistic crisis scenarios",
            "Guided tabletop exercises",
            "Expert facilitator feedback",
            "Playbook generation post-drill",
            "Team stress-testing"
          ]}
          image="https://images.unsplash.com/photo-1752004034445-5cf104568dd3?w=1200&q=85"
          imageAlt="Symmetrical building art composition in black and white"
          index={3}
          hasBorder
        />

        {/* CTA Section */}
        <section className="relative z-50 py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground uppercase tracking-tight mb-6">
                Ready to Build Something That Lasts?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join hundreds of founders who've traded uncertainty for resilience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="/sign-up" 
                  className="group px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all flex items-center gap-3"
                >
                  <span>Get Started Free</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <span className="text-muted-foreground text-sm">
                  No credit card required
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Global Footer */}
      <RaceTrackFooter />
    </>
  );
}

// Sticky Feature Section Component
interface StickyFeatureSectionProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  index: number;
  hasPattern?: boolean;
  hasGradient?: boolean;
  hasBorder?: boolean;
}

function StickyFeatureSection({ 
  number, 
  title, 
  subtitle, 
  description, 
  features, 
  image, 
  imageAlt,
  index,
  hasPattern,
  hasGradient,
  hasBorder,
}: StickyFeatureSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Smoother transforms for stacking effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // Alternate image position
  const reversed = index % 2 === 1;

  // Get accent color based on index
  const accentColors = [
    { text: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-500/30" },
    { text: "text-rose-500", bg: "bg-rose-500", border: "border-rose-500/30" },
    { text: "text-amber-500", bg: "bg-amber-500", border: "border-amber-500/30" },
    { text: "text-red-500", bg: "bg-red-500", border: "border-red-500/30" },
  ];
  const accent = accentColors[index];

  return (
    <motion.section 
      ref={sectionRef}
      style={{ scale, zIndex: 10 + index }}
      className={`sticky top-0 min-h-screen flex items-center bg-background py-16 md:py-24 ${
        hasPattern ? 'pattern-section' : ''
      } ${
        hasGradient ? 'gradient-section' : ''
      } ${
        hasBorder ? 'border-section' : ''
      }`}
    >
      {/* Background variations */}
      {hasPattern && (
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      )}
      
      {hasGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      )}
      
      {hasBorder && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          <div className="absolute inset-4 border border-primary/10 rounded-3xl pointer-events-none" />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: reversed ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className={`flex flex-col ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {/* Number Badge */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`text-7xl md:text-9xl font-black font-mono leading-none ${accent.text} opacity-20`}>
                {number}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tight mb-3">
              {title}
            </h2>
            <p className={`text-xl font-medium mb-6 ${accent.text}`}>
              {subtitle}
            </p>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg max-w-xl">
              {description}
            </p>

            {/* Features List */}
            <div className="flex-1 flex flex-col justify-end space-y-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + (i * 0.1),
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:${accent.border} transition-all group`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:${accent.bg} transition-colors duration-300`}>
                    <svg className={`w-4 h-4 text-[var(--foreground)]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: reversed ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className={`flex ${reversed ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative group w-full flex"
            >
              {/* Main Image Container */}
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl w-full flex flex-col ${
                hasBorder ? `ring-2 ${accent.border}` : 'ring-1 ring-border'
              }`}>
                {/* Image */}
                <div className="flex-1 relative min-h-0">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>

                {/* Bottom Info Bar */}
                <div className="p-6 bg-card/95 backdrop-blur-md shrink-0 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-mono ${accent.text}`}>
                        {number} / 04
                      </span>
                      <span className="text-muted-foreground text-sm font-medium">
                        {number === "01" && "Bank-level encryption"}
                        {number === "02" && "500+ companies scanned"}
                        {number === "03" && "200+ active founders"}
                        {number === "04" && "Crisis-tested playbooks"}
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${accent.bg} animate-pulse`} />
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className={`absolute -inset-4 rounded-3xl ${accent.bg} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 pointer-events-none`} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
