import { getModuleByIdAction } from '@/app/actions/marketplace';
import { ModuleForm } from '@/components/marketplace/ModuleForm';
import { ModuleChecklistEditor } from '@/components/marketplace/ModuleChecklistEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: moduleData, success } = await getModuleByIdAction(id);

    if (!success || !moduleData) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Module</h2>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Module Configuration</CardTitle>
                        <CardDescription>
                            Update module details, pricing, and visibility.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModuleForm initialData={moduleData} isEditing />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Checklist Content</CardTitle>
                        <CardDescription>
                            Manage the specific checklist items included in this module.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModuleChecklistEditor moduleId={id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
