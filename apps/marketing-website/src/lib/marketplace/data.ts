import { MarketplaceModule } from "./types";

export const MARKETPLACE_MODULES: MarketplaceModule[] = [
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
        longDescription: "The Legal Vault Template provides a standardized directory structure for maintaining corporate hygiene. It ensures that when due diligence requests come in, your documents are already organized in a way that investors expect."
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
        longDescription: "Implement robust financial controls from day one. This package sets up your financial reporting structure, helping you maintain GAAP compliance and providing investors with clear visibility into your unit economics."
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
        longDescription: "First impressions matter. The HR Onboarding System ensures every new team member has a consistent, professional experience from day one, while ensuring all compliance boxes are ticked."
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
        longDescription: "Turn the chaos of month-end into a repeatable process. This playbook guides your finance team through a structured close process, ensuring accuracy and timeliness in your financial reporting."
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
        longDescription: "Stop paying for unused software and missing renewal dates. The Vendor Management System gives you a centralized view of all external relationships and their associated costs."
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
        longDescription: "Stay on the right side of the law. This module helps you track all your compliance obligations across different jurisdictions, preventing costly fines and administrative headaches."
    },

    // --- Growth Modules ---
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
        longDescription: "Keep your investors informed and engaged. The Investor Reporting Suite helps you craft data-driven updates that demonstrate progress and build confidence with your backers."
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
        longDescription: "Don't wait for a LOI to start preparing. This pack provides the tools you need to keep your house in order, so when an acquirer knocks, you're ready to move fast and close the deal."
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
        longDescription: "Understand what drives your company's value. The Valuation Optimizer helps you identify and focus on the metrics that matter most to investors and potential acquirers."
    }
];
