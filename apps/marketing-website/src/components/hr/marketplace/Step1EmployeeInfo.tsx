"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, MapPin, Calendar } from "lucide-react";
import { formatPhone } from "@/lib/utils";

import { type EmployeeInfo } from "./types";

interface Step1EmployeeInfoProps {
    data: EmployeeInfo;
    onChange: (data: EmployeeInfo) => void;
}

export const DEFAULT_EMPLOYEE_INFO: EmployeeInfo = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    startDate: "",
};

const US_STATES = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "DC", label: "Washington D.C." },
];



export function Step1EmployeeInfo({ data, onChange }: Step1EmployeeInfoProps) {
    const updateField = (field: keyof EmployeeInfo, value: string) => {
        onChange({ ...data, [field]: value });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        updateField("phone", formatted);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Employee Information
                </CardTitle>
                <CardDescription>
                    Enter the new hire's contact information and expected start date.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            value={data.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            value={data.lastName}
                            onChange={(e) => updateField("lastName", e.target.value)}
                        />
                    </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={data.email}
                            onChange={(e) => updateField("email", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={data.phone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                </div>

                {/* Address Fields */}
                <div className="space-y-4">
                    <Label>
                        Mailing Address
                    </Label>
                    <Input
                        placeholder="Street Address"
                        value={data.addressLine1 || ""}
                        onChange={(e) => updateField("addressLine1", e.target.value)}
                    />
                    <Input
                        placeholder="Apt, Suite, Unit (optional)"
                        value={data.addressLine2 || ""}
                        onChange={(e) => updateField("addressLine2", e.target.value)}
                    />
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            placeholder="City"
                            value={data.city || ""}
                            onChange={(e) => updateField("city", e.target.value)}
                        />
                        <Select value={data.state || ""} onValueChange={(v) => updateField("state", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {US_STATES.map((state) => (
                                    <SelectItem key={state.value} value={state.value}>
                                        {state.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="ZIP Code"
                            value={data.zipCode || ""}
                            onChange={(e) => updateField("zipCode", e.target.value)}
                        />
                    </div>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                    <Label htmlFor="startDate">
                        Expected Start Date *
                    </Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={data.startDate}
                        onChange={(e) => updateField("startDate", e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
