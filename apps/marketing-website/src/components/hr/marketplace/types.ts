import { z } from "zod";

// --- Step 1: Employee Info ---
export const EmployeeInfoSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(), // Could add regex for zip
    startDate: z.string().min(1, "Start date is required"),
});

export type EmployeeInfo = z.infer<typeof EmployeeInfoSchema>;

// --- Step 2: Position Info ---
export const PositionInfoSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    department: z.string().min(1, "Department is required"),
    employmentType: z.string().min(1, "Employment type is required"),
    reportsTo: z.string().optional(),
    managerEmail: z.string().email("Invalid manager email").optional().or(z.literal("")),
    managerPhone: z.string().optional(),
    workLocation: z.string().optional(),
    remoteStatus: z.string().optional(),
    jobDescription: z.string().optional(),
});

export type PositionInfo = z.infer<typeof PositionInfoSchema>;

// --- Step 3: Compensation ---
export const CompensationInfoSchema = z.object({
    salaryAmount: z.string().min(1, "Salary amount is required"),
    salaryType: z.string(),
    payFrequency: z.string(),
    bonusEligible: z.boolean(),
    bonusDetails: z.string().optional(),
    healthInsurance: z.boolean(),
    dentalInsurance: z.boolean(),
    visionInsurance: z.boolean(),
    retirement401k: z.boolean(),
    ptodays: z.string(),
    stockOptions: z.boolean(),
    signingBonus: z.string().optional(),
    otherBenefits: z.string().optional(),
});

export type CompensationInfo = z.infer<typeof CompensationInfoSchema>;

// --- Step 4: Checklist ---
export const SubItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    status: z.enum(["request", "completed", "skip"]),
});

export type SubItem = z.infer<typeof SubItemSchema>;
export type SubItemStatus = SubItem["status"];

export const ChecklistItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string(),
    enabled: z.boolean(),
    icon: z.string(),
    subItems: z.array(SubItemSchema),
});

export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

// --- Step 5: Equipment ---
export const EquipmentOptionSchema = z.object({
    id: z.string(),
    label: z.string(),
    category: z.string(),
    enabled: z.boolean(),
    icon: z.string(),
});

export type EquipmentOption = z.infer<typeof EquipmentOptionSchema>;

// --- Step 6: Access ---
export const AccessItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    category: z.string(),
    enabled: z.boolean(),
    icon: z.string(),
    autoProvision: z.boolean(),
});

export type AccessItem = z.infer<typeof AccessItemSchema>;

// --- Master Schema ---
export const HROnboardingSchema = z.object({
    employeeInfo: EmployeeInfoSchema,
    positionInfo: PositionInfoSchema,
    compensation: CompensationInfoSchema,
    checklist: z.array(ChecklistItemSchema),
    equipment: z.array(EquipmentOptionSchema),
    access: z.array(AccessItemSchema),
});

export type HROnboardingData = z.infer<typeof HROnboardingSchema>;
