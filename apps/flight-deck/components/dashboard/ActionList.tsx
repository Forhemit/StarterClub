import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

const actions = [
    { id: 1, text: "Complete user profile", done: true },
    { id: 2, text: "Schedule onboarding call", done: false },
    { id: 3, text: "Define first project", done: false },
]

export function ActionList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Next Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {actions.map((action) => (
                        <li key={action.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={action.done}
                                readOnly
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span
                                className={
                                    action.done ? "line-through text-gray-400" : "text-gray-900"
                                }
                            >
                                {action.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
