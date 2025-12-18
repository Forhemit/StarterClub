import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"

export function StatusWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Flight Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Launch Progress</span>
                            <span className="text-sm font-medium">45%</span>
                        </div>
                        <ProgressBar value={45} />
                    </div>
                    <div className="text-sm text-gray-500">
                        Next Milestone: <span className="font-semibold text-gray-900">Prototype Review</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
