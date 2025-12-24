import { DeveloperLogin } from "@/components/DeveloperLogin";

export default function EmployeeLoginPage() {
    // Super Admin runs on 3000
    return <DeveloperLogin redirectUrl="/employee-portal/selection" title="Employee Login" />;
}
