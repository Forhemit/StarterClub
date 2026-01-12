import { z } from "zod";

// Vendor categories for categorizing vendors
export const VENDOR_CATEGORIES = [
    "Software",
    "Professional Services",
    "Marketing",
    "Operations",
    "HR",
    "Finance",
    "Legal",
    "IT Infrastructure",
    "Other"
] as const;

export type VendorCategory = typeof VENDOR_CATEGORIES[number];

// Spend period options
export const SPEND_PERIODS = [
    "monthly",
    "quarterly",
    "annual",
    "one-time"
] as const;

export type SpendPeriod = typeof SPEND_PERIODS[number];

// Vendor schema
export const VendorSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Vendor name is required"),
    category: z.string().default("Other"),
    contact_name: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal("")),
    contact_phone: z.string().optional(),
    website: z.string().optional(),
    notes: z.string().optional(),
});

export type Vendor = z.infer<typeof VendorSchema>;

// Contract schema
export const ContractSchema = z.object({
    id: z.string().optional(),
    vendor_id: z.string().optional(),
    vendor_name: z.string().optional(), // For display purposes
    contract_name: z.string().min(1, "Contract name is required"),
    start_date: z.string().or(z.date()).optional(),
    end_date: z.string().or(z.date()).optional(),
    value: z.number().optional(),
    renewal_alert_days: z.number().default(30),
    auto_renew: z.boolean().default(false),
    notes: z.string().optional(),
});

export type Contract = z.infer<typeof ContractSchema>;

// Spend record schema
export const SpendRecordSchema = z.object({
    id: z.string().optional(),
    vendor_id: z.string().optional(),
    vendor_name: z.string().optional(), // For display purposes
    amount: z.number().min(0, "Amount must be positive"),
    period: z.string().default("monthly"),
    period_date: z.string().or(z.date()).optional(),
    category: z.string().optional(),
    notes: z.string().optional(),
});

export type SpendRecord = z.infer<typeof SpendRecordSchema>;

// Main data schema
export const VendorManagementDataSchema = z.object({
    id: z.string().optional(),
    vendors: z.array(VendorSchema).default([]),
    contracts: z.array(ContractSchema).default([]),
    spend_records: z.array(SpendRecordSchema).default([]),
});

export type VendorManagementData = z.infer<typeof VendorManagementDataSchema>;

// Initial/empty state
export const INITIAL_DATA: VendorManagementData = {
    vendors: [],
    contracts: [],
    spend_records: [],
};
