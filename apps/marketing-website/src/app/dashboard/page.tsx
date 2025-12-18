import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardRoot() {
    // Check for temporary simple connection
    const isSimpleAuth = process.env.NEXT_PUBLIC_USE_SIMPLE_AUTH === 'true';

    if (isSimpleAuth) {
        // In simple auth mode, we check for a selected mock role
        const cookieStore = await cookies();
        const mockRole = cookieStore.get('mock_role')?.value;

        if (!mockRole) {
            redirect("/dashboard/select-role");
        }

        if (mockRole === "admin") {
            redirect("/dashboard/super-admin");
        } else if (mockRole === "partner_admin") {
            redirect("/dashboard/partner-admin");
        } else {
            redirect("/dashboard/partner");
        }
    }

    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect("/sign-in");
    }

    const role = user?.publicMetadata?.role;

    if (role === "admin") {
        redirect("/dashboard/super-admin");
    } else if (role === "partner_admin") {
        redirect("/dashboard/partner-admin");
    } else {
        redirect("/dashboard/partner");
    }
}
