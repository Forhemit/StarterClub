import { ModuleForm } from '@/components/marketplace/ModuleForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NewModulePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Create New Module</h2>
            <div className="grid gap-4 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Module Details</CardTitle>
                        <CardDescription>
                            Define the core attributes of this marketplace module.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModuleForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
