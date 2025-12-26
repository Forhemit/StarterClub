import { useUser as useClerkUser } from "@clerk/nextjs";
import { ROLES, Role } from "@/lib/roles";

export function useUser() {
    const { user, isLoaded, isSignedIn } = useClerkUser();

    // Map Clerk user to our application user structure
    // Assuming publicMetadata or privateMetadata holds the role and company_id
    const role = (user?.publicMetadata?.role as Role) || ROLES.EMPLOYEE;
    const company_id = user?.publicMetadata?.company_id as string;

    return {
        user: user ? {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            fullName: user.fullName,
            imageUrl: user.imageUrl,
            company_id: company_id,
        } : null,
        role,
        isLoaded,
        isSignedIn
    };
}
