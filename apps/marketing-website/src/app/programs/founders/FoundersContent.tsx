"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function FoundersContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

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

      {/* Access Pass Sections */}
      <div ref={containerRef} className="relative">
        {/* Section 1: Secure Vault - Image Right */}
        <FeatureSection
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
          reversed={true}
          scrollYProgress={scrollYProgress}
          index={0}
        />

        {/* Section 2: Business Health - Image Left */}
        <FeatureSection
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
          reversed={false}
          scrollYProgress={scrollYProgress}
          index={1}
          highlight
        />

        {/* Section 3: Founder Network - Image Right */}
        <FeatureSection
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
          reversed={true}
          scrollYProgress={scrollYProgress}
          index={2}
        />

        {/* Section 4: War Games - Image Left */}
        <FeatureSection
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
          reversed={false}
          scrollYProgress={scrollYProgress}
          index={3}
        />

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
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
    </>
  );
}

// Feature Section Component
interface FeatureSectionProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  reversed: boolean;
  scrollYProgress: any;
  index: number;
  highlight?: boolean;
}

function FeatureSection({ 
  number, 
  title, 
  subtitle, 
  description, 
  features, 
  image, 
  imageAlt,
  reversed,
  scrollYProgress,
  index,
  highlight = false
}: FeatureSectionProps) {
  // Calculate animation ranges based on index
  const startRange = index * 0.2;
  const endRange = startRange + 0.2;
  
  const y = useTransform(scrollYProgress, [startRange, endRange], [80, 0]);
  const opacity = useTransform(scrollYProgress, [startRange, endRange], [0, 1]);

  return (
    <section 
      className={`py-24 md:py-32 border-b border-border last:border-0 ${
        highlight ? 'bg-gradient-to-b from-primary/5 to-background' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch`}>
          {/* Content Column */}
          <motion.div 
            style={{ opacity, y }}
            className={`flex flex-col ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {/* Number Badge */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-7xl md:text-9xl font-black text-primary/10 font-mono leading-none">
                {number}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tight mb-3">
              {title}
            </h2>
            <p className={`text-xl font-medium mb-8 ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-10 text-lg max-w-xl">
              {description}
            </p>

            {/* Features List - grows to fill space */}
            <div className="flex-1 flex flex-col justify-end space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <svg className="w-4 h-4 text-primary group-hover:text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Column - Matches content height */}
          <motion.div 
            style={{ opacity, y }}
            className={`flex ${reversed ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="relative group w-full flex"
            >
              {/* Main Image Container - Fills full height */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border w-full flex flex-col">
                {/* Image fills container height */}
                <div className="flex-1 relative min-h-0">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Bottom Info Bar */}
                <div className="p-6 bg-gradient-to-t from-black/80 via-black/60 to-black/20 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-mono text-white">
                        {number} / 04
                      </span>
                      <span className="text-white/70 text-sm font-medium">
                        {number === "01" && "Bank-level encryption"}
                        {number === "02" && "500+ companies scanned"}
                        {number === "03" && "200+ active founders"}
                        {number === "04" && "Crisis-tested playbooks"}
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Decorative Shadow Layers */}
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
