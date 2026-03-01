import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Membership | Starter Club",
    description: "Join Starter Club and build a resilient business with our membership programs.",
};

export default function MembershipPage() {
    // Redirect to the benefits page for now
    redirect("/membership/benefits");
}
