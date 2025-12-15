import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const dynamic = "force-static";

export default function SupportPage() {
    return (
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <Mail className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Need Help?</h1>
            <p className="text-muted-foreground text-lg">
                Our support team is here to assist you with any questions about the Partner Portal.
            </p>
            <div className="pt-4">
                <Button size="lg" asChild>
                    <a href="mailto:support@starterclubsf.com">Contact Support</a>
                </Button>
            </div>
        </div>
    );
}
