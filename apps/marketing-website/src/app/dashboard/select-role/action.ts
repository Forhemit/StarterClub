'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function selectRole(formData: FormData) {
    const role = formData.get('role') as string

    if (role) {
        const cookieStore = await cookies()
        cookieStore.set('mock_role', role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
    }

    redirect('/dashboard')
}
