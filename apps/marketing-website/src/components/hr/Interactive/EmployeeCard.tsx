"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmployeeCardProps {
    employeeId: string;
}

export function EmployeeCard({ employeeId }: EmployeeCardProps) {
    // In a real app, fetch data. Mocking for now.
    const employee = {
        name: "New Hire",
        role: "Software Engineer",
        department: "Engineering",
        avatar: "Unknown"
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarFallback>{employee.avatar}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{employee.name}</CardTitle>
                    <CardDescription>{employee.role} • {employee.department}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">ID: {employeeId}</p>
            </CardContent>
        </Card>
    );
}
