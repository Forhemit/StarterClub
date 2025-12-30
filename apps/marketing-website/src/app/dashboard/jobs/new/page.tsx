import { createJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewJobPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/dashboard/jobs">
                <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                </Button>
            </Link>

            <div className="space-y-1">
                <h1 className="text-3xl font-bold font-display tracking-tight">Post New Job</h1>
                <p className="text-muted-foreground">Fill in the details for your new open position.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>
                        This information will be displayed on your public careers page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createJob} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input id="title" name="title" placeholder="e.g. Senior Software Engineer" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" name="department" placeholder="e.g. Engineering" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Employment Type</Label>
                                <Select name="type" defaultValue="Full-time">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Temporary">Temporary</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" placeholder="e.g. San Francisco / Remote" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary_range">Salary Range</Label>
                                <Input id="salary_range" name="salary_range" placeholder="e.g. $120k - $160k" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter the job description, responsibilities, and requirements..."
                                className="min-h-[200px]"
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/dashboard/jobs">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit">Publish Job</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
