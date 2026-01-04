import { MarketplaceModule } from "./types";

export const MARKETPLACE_MODULES: MarketplaceModule[] = [
    // --- Credit Modules ---
    // --- Credit Modules ---
    {
        id: "personal-credit",
        title: "Personal Credit Wizard",
        description: "Optimize your consumer credit for a 750+ FICO score.",
        category: "Foundation",
        iconName: "CreditCard",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "FICO score tracking across all 3 bureaus",
            "5-factor score breakdown analysis",
            "What-If utilization simulator",
            "Hard/soft inquiry tracking",
            "Gardening mode for account aging"
        ],
        longDescription: "The Personal Credit Wizard helps you understand and optimize your consumer credit profile. Track your FICO scores, manage tradelines, simulate utilization changes, and use Gardening Mode to let your accounts age for maximum credit history benefit.",
        lastUpdated: "2026-01-02T12:00:00Z",
        createdDate: "2026-01-02T12:00:00Z"
    },
    {
        id: "business-credit",
        title: "Business Credit Wizard",
        description: "Build a robust business credit profile independent of your SSN.",
        category: "Foundation",
        iconName: "Building2",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Compliance credibility checker",
            "Tiered vendor building (Net-30 to Non-PG)",
            "PAYDEX & Intelliscore tracking",
            "DUNS/BIN/EIN mapping",
            "Personal Guarantee manager"
        ],
        longDescription: "The Business Credit Wizard guides you through the tiered approach to building business credit. Start with Net-30 vendors, progress through store credit and cash cards, and ultimately unlock Non-PG funding lines backed only by your business—not your personal credit.",
        lastUpdated: "2026-01-02T12:00:00Z",
        createdDate: "2026-01-02T12:00:00Z"
    },
    // --- Foundation Modules ---
    {
        id: "legal-vault",
        title: "Legal Vault Template",
        description: "Secure storage structure for all your corporate legal documents.",
        category: "Foundation",
        iconName: "Scale",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Pre-structured folders for Incorporation, IP, Contracts",
            "Role-based access control templates",
            "Document expiration alerts"
        ],
        longDescription: "The Legal Vault Template provides a standardized directory structure for maintaining corporate hygiene. It ensures that when due diligence requests come in, your documents are already organized in a way that investors expect.",
        lastUpdated: "2025-11-01T00:00:00Z",
        createdDate: "2025-11-01T00:00:00Z"
    },
    {
        id: "financial-controls",
        title: "Financial Controls Package",
        description: "Standardized financial tracking and reporting structure.",
        category: "Foundation",
        iconName: "Landmark",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Chart of Accounts template",
            "Monthly close checklist",
            "Burn rate calculator"
        ],
        longDescription: "Implement robust financial controls from day one. This package sets up your financial reporting structure, helping you maintain GAAP compliance and providing investors with clear visibility into your unit economics.",
        lastUpdated: "2025-11-05T00:00:00Z",
        createdDate: "2025-11-05T00:00:00Z"
    },
    {
        id: "hr-onboarding",
        title: "HR Onboarding System",
        description: "Streamlined employee onboarding workflows.",
        category: "Foundation",
        iconName: "Users",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "New hire checklist",
            "Equipment provisioning tracking",
            "Account access automation"
        ],
        longDescription: "First impressions matter. The HR Onboarding System ensures every new team member has a consistent, professional experience from day one, while ensuring all compliance boxes are ticked.",
        lastUpdated: "2025-11-10T00:00:00Z",
        createdDate: "2025-11-10T00:00:00Z"
    },
    {
        id: "sop-generator",
        title: "SOP Generator",
        description: "Create and manage Position Standard Operating Procedures.",
        category: "Foundation",
        iconName: "FileText",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Position identification & classification",
            "Key responsibilities with time allocation",
            "Authority matrix & KPI tracking",
            "Skills & requirements management",
            "Document preview & export"
        ],
        longDescription: "The SOP Generator helps you create comprehensive Position SOPs that document roles, responsibilities, authority levels, and performance metrics. Streamline onboarding, ensure consistency, and prepare for acquisition due diligence.",
        lastUpdated: "2026-01-04T12:00:00Z",
        createdDate: "2026-01-04T12:00:00Z"
    },

    // --- Operations Modules ---
    {
        id: "monthly-close",
        title: "Monthly Close Playbook",
        description: "Step-by-step guide to closing your books on time.",
        category: "Operations",
        iconName: "CalendarCheck",
        version: "1.2.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Reconciliation templates",
            "Variance analysis report",
            "Executive summary generator"
        ],
        longDescription: "Turn the chaos of month-end into a repeatable process. This playbook guides your finance team through a structured close process, ensuring accuracy and timeliness in your financial reporting.",
        lastUpdated: "2025-12-15T00:00:00Z",
        createdDate: "2025-11-12T00:00:00Z"
    },
    {
        id: "vendor-management",
        title: "Vendor Management System",
        description: "Track contracts, renewals, and spend per vendor.",
        category: "Operations",
        iconName: "Truck",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Renewal alert system",
            "Spend analysis dashboard",
            "Vendor contact directory"
        ],
        longDescription: "Stop paying for unused software and missing renewal dates. The Vendor Management System gives you a centralized view of all external relationships and their associated costs.",
        lastUpdated: "2025-11-15T00:00:00Z",
        createdDate: "2025-11-15T00:00:00Z"
    },
    {
        id: "compliance-tracking",
        title: "Compliance Tracking",
        description: "Monitor regulatory requirements and filing deadlines.",
        category: "Operations",
        iconName: "ShieldCheck",
        version: "1.0.0",
        author: "Starter Club",
        price: "Premium",
        features: [
            "Tax filing calendar",
            "State registration tracker",
            "License renewal management"
        ],
        longDescription: "Stay on the right side of the law. This module helps you track all your compliance obligations across different jurisdictions, preventing costly fines and administrative headaches.",
        lastUpdated: "2026-01-04T12:00:00Z",
        createdDate: "2026-01-04T12:00:00Z"
    },

    // --- Growth Modules ---
    {
        id: "jobs-careers",
        title: "Jobs & Careers",
        description: "Post jobs and manage your careers page.",
        category: "Growth",
        iconName: "BriefcaseBusiness",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Public careers page",
            "Job posting management",
            "Application notifications"
        ],
        longDescription: "Attract the best talent with a professional careers page. The Jobs & Careers module lets you post open positions, manage applications, and showcase your company culture to the world.",
        lastUpdated: "2025-12-01T00:00:00Z",
        createdDate: "2025-12-01T00:00:00Z"
    },
    {
        id: "investor-reporting",
        title: "Investor Reporting Suite",
        description: "Generate professional updates for your stakeholders.",
        category: "Growth",
        iconName: "TrendingUp",
        version: "2.0.0",
        author: "Starter Club",
        price: "Premium",
        features: [
            "KPI dashboard templates",
            "Monthly update email builder",
            "Cap table integration"
        ],
        longDescription: "Keep your investors informed and engaged. The Investor Reporting Suite helps you craft data-driven updates that demonstrate progress and build confidence with your backers.",
        lastUpdated: "2025-12-15T00:00:00Z",
        createdDate: "2025-12-10T00:00:00Z"
    },
    {
        id: "acquisition-readiness",
        title: "Acquisition Readiness Pack",
        description: "Tools to prepare your company for a successful exit.",
        category: "Growth",
        iconName: "Briefcase",
        version: "1.0.0",
        author: "Starter Club",
        price: "Enterprise",
        features: [
            "Due diligence data room builder",
            "Red flag scanner",
            "Deal stage tracker"
        ],
        longDescription: "Don't wait for a LOI to start preparing. This pack provides the tools you need to keep your house in order, so when an acquirer knocks, you're ready to move fast and close the deal.",
        lastUpdated: "2026-01-04T12:00:00Z",
        createdDate: "2026-01-04T12:00:00Z"
    },
    {
        id: "valuation-optimizer",
        title: "Valuation Optimizer",
        description: "Analyze and improve key valuation drivers.",
        category: "Growth",
        iconName: "DollarSign",
        version: "1.0.0",
        author: "Starter Club",
        price: "Enterprise",
        features: [
            "SaaS metrics calculator",
            "Comparable analysis tool",
            "Growth scenario modeling"
        ],
        longDescription: "Understand what drives your company's value. The Valuation Optimizer helps you identify and focus on the metrics that matter most to investors and potential acquirers.",
        lastUpdated: "2025-12-22T00:00:00Z",
        createdDate: "2025-12-22T00:00:00Z"
    },
    {
        id: "enterprise-repository-manager",
        title: "Enterprise Repository Manager",
        description: "Granular access control for your acquisition documents.",
        category: "Growth",
        iconName: "FolderLock",
        version: "1.0.0",
        author: "Starter Club",
        price: "Enterprise",
        features: [
            "Interested party management",
            "Time-windowed document access",
            "Granular permission matrix"
        ],
        longDescription: "Control exactly who sees what during due diligence. The Enterprise Repository Manager lets you create custom views of your Acquisition Readiness Pack for different investors, limiting access by category, document, or time window (e.g., 'Last 2 Years only').",
        lastUpdated: "2025-12-24T00:00:00Z",
        createdDate: "2025-12-24T00:00:00Z"
    },
    // --- Business Resilience Modules ---
    {
        id: "leadership-human-capital",
        title: "Leadership & Human Capital",
        description: "Remove key-person risk and decision paralysis.",
        category: "Business Resilience",
        iconName: "Users",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Succession planning & deputy mapping",
            "Key person dependency tracking",
            "Decision authority matrix"
        ],
        longDescription: "Investors don’t care who your CEO is — they care that the company doesn’t freeze when they’re gone. This module helps you identify key Person risks, map decision authority, and ensure leadership continuity.",
        lastUpdated: "2025-12-28T00:00:00Z",
        createdDate: "2025-12-28T00:00:00Z"
    },
    {
        id: "financial-resilience",
        title: "Financial Resilience",
        description: "Fortify your financial position against shocks.",
        category: "Business Resilience",
        iconName: "Landmark",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Cash flow stress testing",
            "Emergency fund planning",
            "Insurance coverage review"
        ],
        longDescription: "Prepare your business for financial uncertainty. This module provides tools to stress-test your cash flow, evaluate insurance coverage, and build a financial safety net.",
        lastUpdated: "2025-12-29T00:00:00Z",
        createdDate: "2025-12-29T00:00:00Z"
    },
    {
        id: "operations-supply-chain",
        title: "Operations & Supply Chain",
        description: "Secure your operational capabilities and supply lines.",
        category: "Business Resilience",
        iconName: "Truck",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Critical vendor redundancy",
            "Inventory buffer analysis",
            "Disaster recovery planning"
        ],
        longDescription: "Don't let a supply chain disruption shut you down. This module helps you identify critical vulnerabilities in your operations and build redundancy where it matters most.",
        lastUpdated: "2025-12-30T00:00:00Z",
        createdDate: "2025-12-30T00:00:00Z"
    },
    {
        id: "crisis-protocol",
        title: "Crisis Protocol",
        description: "Standardized responses for critical incidents.",
        category: "Business Resilience",
        iconName: "Siren",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Emergency communication plan",
            "Incident response checklists",
            "Post-mortem templates"
        ],
        longDescription: "When crisis strikes, seconds count. The Crisis Protocol module gives you pre-built response plans for common emergencies, ensuring your team knows exactly what to do.",
        lastUpdated: "2026-01-02T00:00:00Z",
        createdDate: "2026-01-02T00:00:00Z"
    },
    {
        id: "maintenance-audits",
        title: "Maintenance & Audits",
        description: "Regular checks to prevent system failures.",
        category: "Business Resilience",
        iconName: "ClipboardCheck",
        version: "1.0.0",
        author: "Starter Club",
        price: "Free",
        features: [
            "Preventative maintenance schedule",
            "Safety audit checklists",
            "Compliance review logs"
        ],
        longDescription: "An ounce of prevention is worth a pound of cure. This module helps you schedule and track regular maintenance and audits to catch issues before they potential become failures.",
        lastUpdated: "2026-01-03T00:00:00Z",
        createdDate: "2026-01-03T00:00:00Z"
    }
];
