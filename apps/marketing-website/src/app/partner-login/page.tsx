"use client";

import DevLogin from "@/components/DevLogin";

export default function PartnerLoginPage() {
    return (
        <DevLogin
            title="Flight Deck Access"
            description="Redirects to Partner Dashboard (localhost:3002)"
            targetUrl="http://localhost:3002"
        />
    );
}
