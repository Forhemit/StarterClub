import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
// import { Member } from '@/lib/supabase/types' // Types are rudimentary for now

export function useMemberProfile() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // In a real app we would fetch from 'profiles' table using user.id
                // const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                // setProfile(data)
                setProfile({ id: user.id, email: user.email, firstName: 'Test', lastName: 'User' })
            }
            setLoading(false)
        }
        fetchProfile()
    }, [])

    return { profile, loading }
}
