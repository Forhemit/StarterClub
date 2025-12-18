import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export function BlockerCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Blockers</CardTitle>
                <Badge variant="destructive">1 Active</Badge>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Waiting on API Key</div>
                <p className="text-xs text-gray-500">Reported 2 hours ago</p>
            </CardContent>
        </Card>
    )
}
