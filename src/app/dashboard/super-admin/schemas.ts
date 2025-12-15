import { z } from "zod";

export const CreateOrgSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters")
});

export const CreateUserSchema = z.object({
    clerkId: z.string().min(1, "Clerk ID is required")
});

// Updated per Resources 2.0
export const ResourceAssetSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    track: z.enum(['banks', 'insurance', 'hardware', 'saas', 'shared']),
    // doc_type updated
    doc_type: z.enum(['policy', 'guide', 'template', 'api', 'asset']).default('asset'),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    content: z.string().optional(), // For markdown content
    // file_url is optional now if content is provided, but sticking to existing pattern plus enhancement
    // If typ is 'asset', file_url likely required. For 'guide', content might be required.
    // For simplicity in strict schema:
    file_url: z.string().optional(),
    type: z.enum(['pdf', 'ppt', 'zip', 'link']).default('pdf'),
    visibility: z.enum(['partner', 'admin']).default('partner'),
    tags: z.array(z.string()).optional()
}).refine(data => {
    if (data.doc_type === 'asset' && !data.file_url) return false;
    if (data.doc_type === 'guide' && !data.content) return false;
    return true;
}, { message: "File URL is required for Assets, Content is required for Guides", path: ['file_url'] });

export const CaseStudySchema = z.object({
    track: z.string(),
    member_type: z.string().optional(),
    problem: z.string().optional(),
    intro: z.string().optional(),
    outcome: z.string().optional(),
    timeline: z.string().optional(),
    partner_quote: z.string().optional(),
    published: z.boolean().default(false)
});
