"use client";

import DevLogin from "@/components/DevLogin";

export default function MemberLoginPage() {
    return (
        <DevLogin
            title="Member Portal Access"
            description="Redirects to Onboard App (localhost:3001)"
            targetUrl="http://localhost:3001"
        />
    );
}
