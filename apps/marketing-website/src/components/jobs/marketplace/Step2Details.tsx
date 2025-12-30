import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { JobPostingData } from "./JobsCareersWizard";

interface Step2DetailsProps {
    data: JobPostingData;
    onChange: (data: JobPostingData) => void;
}

export function Step2Details({ data, onChange }: Step2DetailsProps) {
    const updateField = (field: keyof JobPostingData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const addListItem = (field: 'responsibilities' | 'qualifications' | 'preferredQualifications') => {
        const currentList = data[field];
        onChange({ ...data, [field]: [...currentList, ""] });
    };

    const updateListItem = (field: 'responsibilities' | 'qualifications' | 'preferredQualifications', index: number, value: string) => {
        const currentList = [...data[field]];
        currentList[index] = value;
        onChange({ ...data, [field]: currentList });
    };

    const removeListItem = (field: 'responsibilities' | 'qualifications' | 'preferredQualifications', index: number) => {
        const currentList = data[field].filter((_, i) => i !== index);
        onChange({ ...data, [field]: currentList });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                    Define the role's responsibilities and requirements.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="deptOverview">Department Overview</Label>
                    <Textarea
                        id="deptOverview"
                        className="min-h-[100px]"
                        placeholder="Tell candidates about the team they'll be joining..."
                        value={data.departmentOverview}
                        onChange={(e) => updateField("departmentOverview", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                        id="description"
                        className="min-h-[150px]"
                        placeholder="Overview of the role and team..."
                        value={data.description}
                        onChange={(e) => updateField("description", e.target.value)}
                    />
                </div>

                {/* Responsibilities */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label>Responsibilities</Label>
                        <Button variant="outline" size="sm" onClick={() => addListItem('responsibilities')}>
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    {data.responsibilities.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No responsibilities added yet.</p>
                    )}
                    <div className="space-y-2">
                        {data.responsibilities.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={item}
                                    placeholder="e.g. Lead the development of new features"
                                    onChange={(e) => updateListItem('responsibilities', index, e.target.value)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeListItem('responsibilities', index)}>
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Qualifications */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label>Minimum Qualifications</Label>
                        <Button variant="outline" size="sm" onClick={() => addListItem('qualifications')}>
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    {data.qualifications.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No qualifications added yet.</p>
                    )}
                    <div className="space-y-2">
                        {data.qualifications.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={item}
                                    placeholder="e.g. 5+ years of experience with React"
                                    onChange={(e) => updateListItem('qualifications', index, e.target.value)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeListItem('qualifications', index)}>
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preferred Qualifications */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label>Preferred Qualifications</Label>
                        <Button variant="outline" size="sm" onClick={() => addListItem('preferredQualifications' as any)}>
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    {data.preferredQualifications.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No preferred qualifications added yet.</p>
                    )}
                    <div className="space-y-2">
                        {data.preferredQualifications.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={item}
                                    placeholder="e.g. Experience with Next.js"
                                    onChange={(e) => updateListItem('preferredQualifications' as any, index, e.target.value)}
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeListItem('preferredQualifications' as any, index)}>
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Education & Experience */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Education Level</Label>
                        <Select value={data.education} onValueChange={(v) => updateField("education", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select education" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High School Diploma">High School Diploma</SelectItem>
                                <SelectItem value="Associate's Degree">Associate's Degree</SelectItem>
                                <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                <SelectItem value="Doctorate">Doctorate</SelectItem>
                                <SelectItem value="No Degree Required">No Degree Required</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Experience Level</Label>
                        <Select value={data.experience} onValueChange={(v) => updateField("experience", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Internship">Internship</SelectItem>
                                <SelectItem value="Entry Level (0-1 years)">Entry Level (0-1 years)</SelectItem>
                                <SelectItem value="Junior (1-3 years)">Junior (1-3 years)</SelectItem>
                                <SelectItem value="Mid-Level (3-5 years)">Mid-Level (3-5 years)</SelectItem>
                                <SelectItem value="Senior (5-8 years)">Senior (5-8 years)</SelectItem>
                                <SelectItem value="Lead (8-10 years)">Lead (8-10 years)</SelectItem>
                                <SelectItem value="Staff/Principal (10+ years)">Staff/Principal (10+ years)</SelectItem>
                                <SelectItem value="Executive (12+ years)">Executive (12+ years)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Internal Notes & Comments */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                        <Label htmlFor="additionalComments">Additional Comments</Label>
                        <Textarea
                            id="additionalComments"
                            placeholder="Any other comments or details..."
                            value={data.additionalComments}
                            onChange={(e) => updateField("additionalComments", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="internalNotes">Internal Notes</Label>
                        <Textarea
                            id="internalNotes"
                            placeholder="Notes visible only to the internal team..."
                            value={data.internalNotes}
                            onChange={(e) => updateField("internalNotes", e.target.value)}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
