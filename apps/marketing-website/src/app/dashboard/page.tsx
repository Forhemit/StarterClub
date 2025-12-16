import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardRoot() {
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
