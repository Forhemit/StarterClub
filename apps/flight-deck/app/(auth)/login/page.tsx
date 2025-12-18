'use client'

import { login } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        if (result.success) {
            router.push('/dashboard')
            router.refresh()
        } else {
            setError(result.error || 'Login failed')
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        Flight Deck Access
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter password to continue
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Enter Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Access Dashboard'}
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center">
                    <a
                        href={process.env.NEXT_PUBLIC_MARKETING_URL || 'http://localhost:3000'}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        &larr; Back to Website
                    </a>
                </div>
            </div>
        </div>
    )
}
