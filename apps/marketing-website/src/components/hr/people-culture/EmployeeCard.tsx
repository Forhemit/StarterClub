import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Mail, Phone, MapPin, Calendar, Award, TrendingUp } from 'lucide-react';
import { StatusBadge, EmployeeStatus } from './StatusBadge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
    title: string;
    department: string;
    status: EmployeeStatus;
    location?: string;
    hire_date: string;
    engagement_score?: number; // 0-100
    tenure_days?: number;
}

interface EmployeeCardProps {
    employee: Employee;
    onEdit?: (id: string) => void;
    onViewProfile?: (id: string) => void;
}

export function EmployeeCard({ employee, onEdit, onViewProfile }: EmployeeCardProps) {
    // Gamification: Calculate tenure badge
    const getTenureBadge = (days: number) => {
        const years = Math.floor(days / 365);
        if (years >= 10) return { label: "10 Year Royalty", emoji: "👑", color: "text-purple-600 bg-purple-100" };
        if (years >= 5) return { label: "5 Year Legend", emoji: "🥇", color: "text-amber-600 bg-amber-100" };
        if (years >= 3) return { label: "3 Year Veteran", emoji: "🥈", color: "text-slate-600 bg-slate-100" };
        if (years >= 1) return { label: "1 Year Club", emoji: "🥉", color: "text-orange-600 bg-orange-100" };
        if (days <= 90) return { label: "New Hire", emoji: "✨", color: "text-blue-600 bg-blue-100" };
        return null;
    };

    const tenureBadge = getTenureBadge(employee.tenure_days || 0);

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-[#FF6B35]">
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={employee.avatar_url} alt={`${employee.first_name} ${employee.last_name}`} />
                            <AvatarFallback>{employee.first_name[0]}{employee.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${employee.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 leading-none">{employee.first_name} {employee.last_name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{employee.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{employee.department}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewProfile?.(employee.id)}>View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(employee.id)}>Edit Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Mark as Inactive</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="pb-3 text-sm">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        <span className="truncate text-xs">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />
                        <span className="truncate text-xs">{employee.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs">Hired {new Date(employee.hire_date).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    <StatusBadge status={employee.status} className="text-[10px] px-2 py-0.5 h-auto" />
                    {tenureBadge && (
                        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${tenureBadge.color}`}>
                            <span>{tenureBadge.emoji}</span>
                            {tenureBadge.label}
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 pb-3 flex items-center justify-between border-t bg-gray-50/50 mt-2 px-4 py-2">
                <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> Engagement
                        </span>
                        <span className="text-xs font-bold text-gray-700">{employee.engagement_score || 0}%</span>
                    </div>
                    <Progress value={employee.engagement_score || 0} className="h-1.5" indicatorClassName={
                        (employee.engagement_score || 0) > 80 ? 'bg-green-500' :
                            (employee.engagement_score || 0) > 50 ? 'bg-yellow-500' : 'bg-red-500'
                    } />
                </div>
            </CardFooter>
        </Card>
    );
}
