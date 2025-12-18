'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from './action'

function SimpleLoginContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Development Access
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Please enter the password to access the dashboard.
                    </p>
                </div>

                <form action={login} className="mt-8 space-y-6">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Sign in
                    </button>
                </form>
                <div className="text-center">
                    <a href="/" className="text-sm text-indigo-600 hover:text-indigo-500">
                        &larr; Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}

export default function SimpleLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SimpleLoginContent />
        </Suspense>
    )
}
