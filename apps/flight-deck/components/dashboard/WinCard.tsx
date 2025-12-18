import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export function WinCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Wins</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                        <Badge variant="secondary">Win</Badge>
                        <div>
                            <p className="text-sm font-medium">Domain Purchased</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Badge variant="secondary">Win</Badge>
                        <div>
                            <p className="text-sm font-medium">First Sale</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
