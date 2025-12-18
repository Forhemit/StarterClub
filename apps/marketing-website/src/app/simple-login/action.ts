'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const password = formData.get('password')

    if (password === 'StarterClub!2025') {
        const cookieStore = await cookies()
        cookieStore.set('simple_auth_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        redirect('/dashboard')
    } else {
        redirect('/simple-login?error=Invalid password')
    }
}
