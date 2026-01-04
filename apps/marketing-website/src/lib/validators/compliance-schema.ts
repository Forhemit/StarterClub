import { z } from "zod";

export const complianceEventSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    due_date: z.union([z.date(), z.string()]),
    status: z.enum(['pending', 'completed', 'overdue', 'ignored']).default('pending'),
    category: z.enum(['tax', 'registration', 'license', 'other']),
    jurisdiction: z.string().optional(),
    notes: z.string().optional(),
});

export const complianceProfileSchema = z.object({
    id: z.string().optional(),
    tax_events: z.array(complianceEventSchema).default([]),
    registrations: z.array(complianceEventSchema).default([]),
    licenses: z.array(complianceEventSchema).default([]),
    other_documents: z.array(complianceEventSchema).default([]),
});

export type ComplianceProfileInput = z.infer<typeof complianceProfileSchema>;
