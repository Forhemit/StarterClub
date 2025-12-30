"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function WaitPoolManager({ candidateId }: { candidateId: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Wait Pool Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                    <span className="text-sm font-medium">Current Status</span>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">Eligible for Rehire</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Candidate agreed to be contacted for future roles similar to "Software Engineer".
                </p>
            </CardContent>
        </Card>
    );
}
