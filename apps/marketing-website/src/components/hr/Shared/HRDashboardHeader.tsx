import { Badge } from "@/components/ui/badge";

interface HRDashboardHeaderProps {
    title: string;
    subtitle: string;
    userType?: string;
}

export function HRDashboardHeader({ title, subtitle, userType = 'admin' }: HRDashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize">
                    {userType} View
                </Badge>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-teal-400" />
            </div>
        </div>
    );
}
