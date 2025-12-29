import React from 'react';
import { getEmployeeDetails } from '@/actions/people-culture';
import { notFound } from 'next/navigation';
import { LifecycleTimeline } from '@/components/hr/people-culture/LifecycleTimeline';
import { StatusBadge } from '@/components/hr/people-culture/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Calendar, Building, Briefcase, Phone, MoreHorizontal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const employee = await getEmployeeDetails(id);

    if (!employee) {
        return notFound();
    }

    // Calculate tenure badge logic again or reuse logic? 
    // For now simple display.
    const hireDate = new Date(employee.hire_date);
    const tenureYears = new Date().getFullYear() - hireDate.getFullYear();

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <Link href="/dashboard/hr/people-culture" className="hover:text-gray-900 flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Link>
                        <span>/</span>
                        <span>Employee Profile</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={employee.profiles?.image_url} />
                                    <AvatarFallback className="text-2xl">{employee.profiles?.first_name?.[0]}{employee.profiles?.last_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${employee.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                    }`} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{employee.profiles?.first_name} {employee.profiles?.last_name}</h1>
                                <div className="flex items-center gap-3 mt-1 text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        <span>{employee.current_title}</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <Building className="h-4 w-4" />
                                        <span>{employee.departments?.department_name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <StatusBadge status={employee.status} />
                                    {tenureYears >= 1 && (
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">
                                            {tenureYears} Year Club
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline">Message</Button>
                            <Button className="bg-[#FF6B35] hover:bg-[#E85A2D]">Edit Profile</Button>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info & Stats */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">{employee.profiles?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">{employee.work_phone || 'No phone listed'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">{employee.current_work_location || 'Remote'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">Hired {new Date(employee.hire_date).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Engagement</CardTitle></CardHeader>
                            <CardContent>
                                <div className="text-center py-4">
                                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-4 border-green-100 text-green-600 font-bold text-2xl">
                                        {employee.engagement_score || 0}%
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Engagement Score</p>
                                    <p className="text-xs text-green-600 font-medium mt-1">High Engagement</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Timeline & Tabs */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                                <div className="grid gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>About</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Placeholder for bio */}
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {employee.profiles?.first_name} is a {employee.current_title} in the {employee.departments?.department_name} department.
                                                They joined the company on {new Date(employee.hire_date).toLocaleDateString()}.
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Use Timeline here as well for overview? Or just recent events */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Activity</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <LifecycleTimeline events={employee.events?.slice(0, 3) || []} hireDate={employee.hire_date} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="timeline" className="mt-6">
                                <LifecycleTimeline events={employee.events || []} hireDate={employee.hire_date} />
                            </TabsContent>

                            <TabsContent value="documents" className="mt-6">
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Document management coming soon.
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="notes" className="mt-6">
                                <Card>
                                    <CardContent className="p-8 text-center text-gray-500">
                                        Private notes coming soon.
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
