"use client";

import * as React from "react";
import { Eye, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const roles = [
    {
        value: "super-admin",
        label: "Super Admin",
    },
    {
        value: "member",
        label: "Member",
    },
    {
        value: "partner",
        label: "Partner",
    },
    {
        value: "sponsor",
        label: "Sponsor",
    },
    {
        value: "employee",
        label: "Employee",
    },
];

interface RoleSwitcherProps {
    selectedRoles: string[];
    onRolesChange: (roles: string[]) => void;
}

export function RoleSwitcher({ selectedRoles, onRolesChange }: RoleSwitcherProps) {
    const toggleRole = (currentValue: string) => {
        let newRoles = [...selectedRoles];
        if (newRoles.includes(currentValue)) {
            newRoles = newRoles.filter((role) => role !== currentValue);
        } else {
            newRoles.push(currentValue);
        }
        onRolesChange(newRoles);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-between h-auto py-2">
                    <div className="flex flex-col items-start text-left">
                        <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> View Dashboard As:
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {selectedRoles.length > 0 ? (
                                selectedRoles.map((role) => (
                                    <Badge key={role} variant="secondary" className="px-1 py-0 text-[10px]">
                                        {roles.find((r) => r.value === role)?.label}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm">Select view...</span>
                            )}
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Views</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                    <DropdownMenuCheckboxItem
                        key={role.value}
                        checked={selectedRoles.includes(role.value)}
                        onCheckedChange={() => toggleRole(role.value)}
                    >
                        {role.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
