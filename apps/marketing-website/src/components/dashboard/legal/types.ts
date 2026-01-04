import { z } from "zod";

export const AddressSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, "Label is required"),
    street1: z.string().min(1, "Street address is required"),
    street2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required"),
    zip_code: z.string().min(5, "Zip code is required"),
    country: z.string().default("US"),
    is_primary: z.boolean().default(false),
});

export type Address = z.infer<typeof AddressSchema>;

export const AttorneySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    firm_name: z.string().optional(),
    role: z.string().default('attorney'),
    attorney_type: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    website: z.string().optional(),
    address_line1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
});

export type Attorney = z.infer<typeof AttorneySchema>;

export const ContactSchema = z.object({
    id: z.string().optional(),
    contact_type: z.string().min(1, "Type is required"),
    value: z.string().optional(), // 'value' typically meant the phone/email string but here we use distinct fields
    phone: z.string().optional(),
    email: z.string().optional(),
    name: z.string().optional(),
    is_primary: z.boolean().default(false),
});

export type Contact = z.infer<typeof ContactSchema>;

export const DocumentSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    url: z.string().optional(),
    type: z.string().optional(),
    uploaded_at: z.string().optional(),
});

export type Document = z.infer<typeof DocumentSchema>;

export const LegalVaultSchema = z.object({
    id: z.string().optional(),
    company_name: z.string().default(""),
    dba_name: z.string().optional(),
    has_dba: z.boolean().default(false),

    // Organization Details
    organization_type: z.string().default(""),
    tax_classification: z.string().default("default"), // New field
    formation_in_progress: z.boolean().default(false),
    nonprofit_type: z.string().optional(),
    formation_date: z.date().optional(),
    primary_state: z.string().default(""),
    business_purpose: z.string().default(""),
    naics_code: z.string().default(""),
    skip_business_purpose: z.boolean().default(false),

    // Registered Agent
    registered_agent_name: z.string().optional(),
    registered_agent_phone: z.string().optional(),
    registered_agent_email: z.string().optional(),
    registered_agent_website: z.string().optional(),

    // Identifiers (Step 4)
    ein: z.string().default(""),
    state_tax_id: z.string().default(""),
    state_tax_id_status: z.string().default("to_do"),
    duns_number: z.string().default(""),
    comments: z.string().optional(),

    // Relations
    addresses: z.array(AddressSchema).default([]),
    attorneys: z.array(AttorneySchema).default([]),
    contacts: z.array(ContactSchema).default([]),
    documents: z.array(DocumentSchema).default([]),

    completedAt: z.string().optional(),
});

export type LegalVaultData = z.infer<typeof LegalVaultSchema>;
