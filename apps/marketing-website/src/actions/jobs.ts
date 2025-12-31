"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getJobs() {
    const supabase = await createSupabaseServerClient();

    // RLS will filter by orgs the user has access to
    const { data: jobs, error } = await supabase
        .from("job_postings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching jobs:", error);
        return { error: error.message };
    }

    return { data: jobs };
}

export async function createJob(formData: FormData) {
    const supabase = await createSupabaseServerClient();

    // Get current user to ensure auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: "Not authenticated" };
    }

    // Parse Fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const department = formData.get("department") as string;

    const remoteType = formData.get("remote_type") as string;
    const education = formData.get("education") as string;
    const experience = formData.get("experience") as string;
    const salaryMin = formData.get("salary_min") ? parseInt(formData.get("salary_min") as string) : null;
    const salaryMax = formData.get("salary_max") ? parseInt(formData.get("salary_max") as string) : null;
    const salaryCurrency = formData.get("salary_currency") as string;
    const salaryPeriod = formData.get("salary_period") as string;
    const internalNotes = formData.get("internal_notes") as string;
    const additionalComments = formData.get("additional_comments") as string;

    // Phase 2 Fields
    const jobId = formData.get("job_id") as string;
    const jobClass = formData.get("job_class") as string;
    const applicationDeadline = formData.get("application_deadline") ? formData.get("application_deadline") as string : null;
    const applicationLink = formData.get("application_link") as string;
    const departmentOverview = formData.get("department_overview") as string;
    const eeoStatement = formData.get("eeo_statement") as string;

    // Accountability Fields
    const hrLead = formData.get("hr_lead") as string;
    const hiringTeamLead = formData.get("hiring_team_lead") as string;
    const hiringTeamEmail = formData.get("hiring_team_email") as string;
    const requestingDepartment = formData.get("requesting_department") as string;

    try {
        // Parse Arrays from JSON
        const responsibilities = JSON.parse(formData.get("responsibilities") as string || "[]");
        const qualifications = JSON.parse(formData.get("qualifications") as string || "[]");
        const preferredQualifications = JSON.parse(formData.get("preferred_qualifications") as string || "[]");
        const benefits = JSON.parse(formData.get("benefits") as string || "[]");
        const schedule = JSON.parse(formData.get("schedule") as string || "[]");

        // Fetch org_id (MVP)
        const { data: roles } = await supabase
            .from("user_roles")
            .select("org_id")
            .eq("user_id", user.id)
            .limit(1);

        // Fallback for dev/testing if no role exists yet, or handle error
        const orgId = (roles && roles.length > 0) ? roles[0].org_id : "00000000-0000-0000-0000-000000000000";

        const { error } = await supabase.from("job_postings").insert({
            org_id: orgId,
            title,
            description,
            location,
            type,
            department,
            schedule,
            remote_type: remoteType,
            education,
            experience,
            salary_min: salaryMin,
            salary_max: salaryMax,
            salary_currency: salaryCurrency,
            salary_period: salaryPeriod,
            responsibilities,
            qualifications,
            benefits,
            internal_notes: internalNotes,
            additional_comments: additionalComments,
            job_id: jobId,
            job_class: jobClass,
            application_deadline: applicationDeadline,
            application_link: applicationLink,
            department_overview: departmentOverview,
            preferred_qualifications: preferredQualifications,
            eeo_statement: eeoStatement,
            hr_lead: hrLead,
            hiring_team_lead: hiringTeamLead,
            hiring_team_email: hiringTeamEmail,
            requesting_department: requestingDepartment,
            status: 'draft'
        });

        if (error) {
            console.error("Insert Error:", error);
            return { error: error.message };
        }

        revalidatePath("/dashboard/jobs");
        return { success: true };

    } catch (e) {
        console.error("Job Creation Error:", e);
        return { error: "Failed to create job posting" };
    }
}

export async function deleteJob(id: string) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/jobs");
    return { success: true };
}
