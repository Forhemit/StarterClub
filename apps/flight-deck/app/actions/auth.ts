'use server'

import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const password = formData.get('password')

    if (password === 'StarterClub!2025') {
        const cookieStore = await cookies()
        cookieStore.set('flight_deck_auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        return { success: true }
    }

    return { success: false, error: 'Invalid password' }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('flight_deck_auth')
    return { success: true }
}
