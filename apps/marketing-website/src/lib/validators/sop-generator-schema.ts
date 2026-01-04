import { z } from "zod";

// Main Position SOP Schema
export const positionSOPSchema = z.object({
    id: z.string().uuid().optional(),
    user_id: z.string().optional(),
    sop_id: z.string().optional(),

    // Basic Info
    title: z.string().min(1, "Position title is required").max(255),
    department: z.string().optional().or(z.literal("")),
    position_type: z.enum(["full-time", "part-time", "contract"]).default("full-time"),
    flsa_status: z.enum(["exempt", "non-exempt"]).default("non-exempt"),
    work_arrangement: z.enum(["onsite", "hybrid", "remote"]).default("onsite"),
    location: z.string().optional().or(z.literal("")),
    reports_to: z.string().optional().or(z.literal("")),

    // Position Overview
    mission_statement: z.string().max(500).optional().or(z.literal("")),
    impact_statement: z.string().max(500).optional().or(z.literal("")),

    // Review & Version Control
    version: z.string().default("v1.0"),
    effective_date: z.union([z.string(), z.date()]).optional(),
    review_frequency: z.enum(["quarterly", "biannual", "annual", "biennial"]).default("annual"),
    next_review_date: z.union([z.string(), z.date()]).optional(),
    status: z.enum(["draft", "active", "pending_review", "expired", "archived"]).default("draft"),
});

// Responsibility Schema
export const responsibilitySchema = z.object({
    id: z.string().uuid().optional(),
    position_sop_id: z.string().uuid().optional(),
    responsibility_area: z.string().min(1, "Responsibility area is required"),
    key_activities: z.array(z.string()).default([]),
    time_allocation: z.number().min(0).max(100).default(0),
    priority: z.number().default(1),
    sort_order: z.number().default(0),
});

// Authority Schema
export const authoritySchema = z.object({
    id: z.string().uuid().optional(),
    position_sop_id: z.string().uuid().optional(),
    decision_area: z.string().min(1, "Decision area is required"),
    authority_level: z.string().min(1, "Authority level is required"),
    approval_required: z.string().optional().or(z.literal("")),
    escalation_path: z.string().optional().or(z.literal("")),
    sort_order: z.number().default(0),
});

// Metric Schema
export const metricSchema = z.object({
    id: z.string().uuid().optional(),
    position_sop_id: z.string().uuid().optional(),
    metric_name: z.string().min(1, "Metric name is required"),
    target: z.string().min(1, "Target is required"),
    measurement_frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annually"]).default("monthly"),
    metric_weight: z.number().min(0).max(100).default(0),
    data_source: z.string().optional().or(z.literal("")),
    sort_order: z.number().default(0),
});

// Requirement Schema
export const requirementSchema = z.object({
    id: z.string().uuid().optional(),
    position_sop_id: z.string().uuid().optional(),
    requirement_type: z.enum(["education", "experience", "certification", "technical", "soft_skill", "physical"]).default("technical"),
    description: z.string().min(1, "Description is required"),
    is_minimum: z.boolean().default(true),
    is_preferred: z.boolean().default(false),
    sort_order: z.number().default(0),
});

// Export types
export type PositionSOPInput = z.infer<typeof positionSOPSchema>;
export type ResponsibilityInput = z.infer<typeof responsibilitySchema>;
export type AuthorityInput = z.infer<typeof authoritySchema>;
export type MetricInput = z.infer<typeof metricSchema>;
export type RequirementInput = z.infer<typeof requirementSchema>;
