"use client"

import { useEffect } from 'react'

export default function MemberLoginPage() {
    useEffect(() => {
        // Redirect to the Flight Deck app
        // TODO: Update this URL based on environment (e.g. use env vars)
        // Development default: localhost:3001 (assuming flight-deck runs there)
        window.location.href = process.env.NEXT_PUBLIC_FLIGHT_DECK_URL || 'http://localhost:3002'
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-gray-500">Redirecting to Member Login...</p>
        </div>
    )
}
