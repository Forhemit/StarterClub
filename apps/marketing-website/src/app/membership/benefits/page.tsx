import { Metadata } from "next";
import MemberBenefitsPage from "@/components/membership/MemberBenefitsPage";

export const metadata: Metadata = {
    title: "Member Benefits | Starter Club",
    description: "Discover the tiered membership structure and high-value Starter Club Business Certification. Build your legacy with exclusive operational infrastructure.",
    openGraph: {
        title: "Member Benefits | Starter Club",
        description: "Discover the tiered membership structure and high-value Starter Club Business Certification.",
        type: "website",
    },
};

export default function MemberBenefitsRoute() {
    return <MemberBenefitsPage />;
}
