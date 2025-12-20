"use client";

import DevLogin from "@/components/DevLogin";

export default function EmployeeLoginPage() {
    return (
        <DevLogin
            title="Super Admin Access"
            description="Redirects to Mission Control (localhost:3003)"
            targetUrl="http://localhost:3003"
        />
    );
}
