import { DeveloperLogin } from "@/components/DeveloperLogin";

export default function PartnerLoginPage() {
    // Flight Deck runs on 3002
    return <DeveloperLogin targetPort={3002} title="Partner Login" />;
}
