import { z } from "zod";

export const JobPostingSchema = z.object({
    // Basics
    title: z.string().min(1, "Job title is required"),
    department: z.string().min(1, "Department is required"),
    type: z.string().min(1, "Employment type is required"),
    remoteType: z.string().min(1, "Workplace type is required"),
    location: z.string().min(1, "Location is required"),
    schedule: z.array(z.string()).default([]),

    // Details
    description: z.string().min(10, "Job description is required (min 10 chars)"),
    departmentOverview: z.string().optional(),
    responsibilities: z.array(z.string()).min(1, "At least one responsibility is required"),
    qualifications: z.array(z.string()).min(1, "At least one qualification is required"),
    preferredQualifications: z.array(z.string()).default([]),
    successMetrics: z.array(z.string()).default([]),
    restrictions: z.array(z.string()).default([]),
    education: z.string().min(1, "Education level is required"),
    experience: z.string().min(1, "Experience level is required"),

    // Compensation
    salaryMin: z.string().min(1, "Minimum salary is required"),
    salaryMax: z.string().min(1, "Maximum salary is required"),
    salaryCurrency: z.string().default("USD"),
    salaryPeriod: z.string().default("yearly"),
    benefits: z.array(z.string()).default([]),
    eeoStatement: z.string().optional(),

    // Admin & Logistics
    jobId: z.string().optional(),
    jobClass: z.string().optional(),
    jobGrade: z.string().optional(),
    applicationDeadline: z.string().optional(),
    applicationLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    internalNotes: z.string().optional(),
    additionalComments: z.string().optional(),

    // Hiring Accountability
    hrLead: z.string().optional(),
    hiringTeamLead: z.string().optional(),
    hiringTeamEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    requestingDepartment: z.string().optional(),

    // Partner
    partnerType: z.string().optional(),
});

export type JobPostingData = z.infer<typeof JobPostingSchema>;
