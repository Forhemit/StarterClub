import { getJobs, deleteJob } from "@/actions/jobs";
import { EmbedButton } from "@/components/jobs/EmbedButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, MapPin, Briefcase, BriefcaseBusiness, DollarSign } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function JobsDashboardPage() {
    const { data: jobs, error } = await getJobs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display tracking-tight">Job Postings</h1>
                    <p className="text-muted-foreground">Manage your open positions and applications.</p>
                </div>
                <Link href="/dashboard/jobs/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                    </Button>
                </Link>
            </div>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-red-600">
                        Error loading jobs: {error}
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {jobs && jobs.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Briefcase className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium">No jobs posted yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Create your first job posting to start attracting talent to your organization.
                            </p>
                            <Link href="/dashboard/jobs/new">
                                <Button variant="outline">Create Job Posting</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {jobs?.map((job) => (
                            <Card key={job.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="line-clamp-1 text-lg">{job.title}</CardTitle>
                                        <Badge variant={job.status === 'published' ? 'default' : 'secondary'}>
                                            {job.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>{job.department}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {job.location || "Remote"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BriefcaseBusiness className="w-4 h-4" />
                                            {job.type}
                                        </div>
                                        {job.salary_range && (
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salary_range}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end items-center pt-2 border-t mt-4 gap-2">
                                        <EmbedButton jobId={job.id} jobTitle={job.title} />
                                        <form action={async () => {
                                            "use server";
                                            await deleteJob(job.id);
                                        }}>
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
