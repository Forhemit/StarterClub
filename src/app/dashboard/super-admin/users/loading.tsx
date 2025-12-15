import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="space-y-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
}
