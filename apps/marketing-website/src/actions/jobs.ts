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

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const type = formData.get("type") as string;
    const department = formData.get("department") as string;

    // Legacy support or remove
    // const salary_range = formData.get("salary_range") as string;

    // New fields
    // schedule is now parsed as JSON
    const remote_type = formData.get("remote_type") as string;
    const education = formData.get("education") as string;
    const experience = formData.get("experience") as string;
    const salary_min = formData.get("salary_min") ? parseInt(formData.get("salary_min") as string) : null;
    const salary_max = formData.get("salary_max") ? parseInt(formData.get("salary_max") as string) : null;
    const salary_currency = formData.get("salary_currency") as string;
    const salary_period = formData.get("salary_period") as string;
    const internal_notes = formData.get("internal_notes") as string;
    const additional_comments = formData.get("additional_comments") as string;

    // Phase 2 Fields
    const job_id = formData.get("job_id") as string;
    const job_class = formData.get("job_class") as string;
    const application_deadline = formData.get("application_deadline") ? formData.get("application_deadline") as string : null;
    const application_link = formData.get("application_link") as string;
    const department_overview = formData.get("department_overview") as string;
    const eeo_statement = formData.get("eeo_statement") as string;

    // Parse JSON arrays
    let responsibilities: string[] = [];
    let qualifications: string[] = [];
    let preferred_qualifications: string[] = [];
    let benefits: string[] = [];
    let schedule: string[] = [];

    try {
        const respJson = formData.get("responsibilities") as string;
        if (respJson) responsibilities = JSON.parse(respJson);

        const qualJson = formData.get("qualifications") as string;
        if (qualJson) qualifications = JSON.parse(qualJson);

        const prefQualJson = formData.get("preferred_qualifications") as string;
        if (prefQualJson) preferred_qualifications = JSON.parse(prefQualJson);

        const benJson = formData.get("benefits") as string;
        if (benJson) benefits = JSON.parse(benJson);

        const scheduleJson = formData.get("schedule") as string;
        if (scheduleJson) schedule = JSON.parse(scheduleJson);
    } catch (e) {
        console.error("Error parsing job arrays", e);
    }

    // Fetch org_id (MVP)
    const { data: roles } = await supabase
        .from("user_roles")
        .select("org_id")
        .eq("user_id", user.id)
        .limit(1);

    if (!roles || roles.length === 0) {
        return { error: "No organization found for user" };
    }

    const orgId = roles[0].org_id;

    const { error } = await supabase.from("job_postings").insert({
        org_id: orgId,
        title,
        description,
        location,
        type,
        department,
        schedule,
        remote_type,
        education,
        experience,
        salary_min,
        salary_max,
        salary_currency,
        salary_period,
        responsibilities,
        qualifications,
        benefits,
        internal_notes,
        additional_comments,
        job_id,
        job_class,
        application_deadline,
        application_link,
        department_overview,
        preferred_qualifications,
        eeo_statement,
        status: 'draft' // Always start as draft during install/creation
    });

    if (error) {
        console.error("Insert Error:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/jobs");
    // We don't redirect here because this might be called from the wizard which handles its own navigation
    // But if used from a standard form, the redirect could be handled by the client
    return { success: true };
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
