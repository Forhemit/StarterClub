import { createSupabaseServerClient } from "@/lib/supabase/server";
import { JobPostingPreview } from "@/components/jobs/marketplace/JobPostingPreview";
import { notFound } from "next/navigation";
import { JobPostingData } from "@/components/jobs/marketplace/types";

export default async function JobEmbedPage({ params }: { params: { id: string } }) {
    const supabase = await createSupabaseServerClient();

    const { data: job, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error || !job) {
        notFound();
    }

    // Map DB response to JobPostingData
    const jobData: JobPostingData = {
        title: job.title,
        department: job.department,
        type: job.type,
        remoteType: job.remote_type,
        location: job.location,
        description: job.description,
        responsibilities: job.responsibilities || [],
        qualifications: job.qualifications || [],
        benefits: job.benefits || [],
        schedule: job.schedule || [],
        education: job.education,
        experience: job.experience,
        salaryMin: job.salary_min ? job.salary_min.toString() : "",
        salaryMax: job.salary_max ? job.salary_max.toString() : "",
        salaryCurrency: job.salary_currency,
        salaryPeriod: job.salary_period,
        internalNotes: "", // Don't expose internal notes
        additionalComments: job.additional_comments,
        // Phase 2
        jobId: job.job_id,
        jobClass: job.job_class,
        jobGrade: job.job_grade || "",
        applicationDeadline: job.application_deadline,
        applicationLink: job.application_link,
        departmentOverview: job.department_overview,
        preferredQualifications: job.preferred_qualifications || [],
        eeoStatement: job.eeo_statement,
        successMetrics: job.success_metrics || [],
        restrictions: job.restrictions || [],
        // Accountability (publicly expose names? maybe just general info if needed, but keeping hidden for now unless requested)
        hrLead: "",
        hiringTeamLead: "",
        hiringTeamEmail: "",
        requestingDepartment: "",
        // Partner Type
        partnerType: job.partner_type || "",
    };

    return (
        <div className="bg-background min-h-screen p-4">
            <JobPostingPreview data={jobData} />
            <div className="mt-4 flex justify-center">
                <a
                    href={job.application_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                    Apply for this position
                </a>
            </div>
        </div>
    );
}
