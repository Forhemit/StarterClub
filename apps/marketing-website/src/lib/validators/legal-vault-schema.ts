import { z } from "zod";

export const legalEntitySchema = z.object({
    id: z.string().uuid().optional(),
    // Relax validation for drafts - allow empty strings or missing fields
    company_name: z.string().max(255).optional().or(z.literal("")),
    dba_name: z.string().max(255).optional().or(z.literal("")),
    organization_type: z.string().max(50).optional().or(z.literal("")),
    formation_in_progress: z.boolean().optional(),
    nonprofit_type: z.string().optional().or(z.literal("")),
    formation_date: z.union([z.string(), z.date()]).optional(),
    // State: Allow empty string during draft, otherwise suggest 2 chars
    primary_state: z.string().max(2).optional().or(z.literal("")),
    business_purpose: z.string().optional().or(z.literal("")),
    naics_code: z.string().optional().or(z.literal("")),
    skip_business_purpose: z.boolean().optional(),

    // Contact Info
    business_address_line1: z.string().optional().or(z.literal("")),
    business_address_line2: z.string().optional().or(z.literal("")),
    business_city: z.string().optional().or(z.literal("")),
    business_state: z.string().optional().or(z.literal("")),
    business_zip: z.string().optional().or(z.literal("")),
    company_phone: z.string().optional().or(z.literal("")),
    company_email: z.string().optional().or(z.literal("")),

    // Registered Agent
    registered_agent_name: z.string().optional().or(z.literal("")),
    registered_agent_phone: z.string().optional().or(z.literal("")),
    registered_agent_email: z.string().optional().or(z.literal("")),
    registered_agent_website: z.string().optional().or(z.literal("")),

    // Identifiers
    // For patterns, only validate if length > 0
    ein: z.string().optional().or(z.literal("")), // Removed regex
    state_tax_id: z.string().optional().or(z.literal("")),
    state_tax_id_status: z.string().optional().or(z.literal("")),
    duns_number: z.string().optional().or(z.literal("")),

    // Comments
    comments: z.string().optional().or(z.literal("")),
});

export type LegalEntityInput = z.infer<typeof legalEntitySchema>;
