"use client"

import { useEffect } from 'react'

export default function MemberLoginPage() {
    useEffect(() => {
        // Redirect to the Flight Deck app (Partner Dashboard)
        // Using NEXT_PUBLIC_PARTNER_URL to match DEPLOYMENT.md and setup-vercel.sh
        window.location.href = process.env.NEXT_PUBLIC_PARTNER_URL || 'http://localhost:3002'
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-gray-500">Redirecting to Member Login...</p>
        </div>
    )
}
