"use client";

import { ResourceTable, ResourceRow, ResourceCell } from "@/components/admin/ResourceTable";
import { Badge } from "@/components/ui/badge";

export default function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
    return (
        <ResourceTable headers={["Time", "Actor", "Action", "Resource", "Details"]}>
            {initialLogs.map(log => (
                <ResourceRow key={log.id}>
                    <ResourceCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                    </ResourceCell>
                    <ResourceCell>
                        <span className="font-mono text-xs text-gray-500" title={log.actor_id}>
                            {log.actor_id.substr(0, 10)}...
                        </span>
                    </ResourceCell>
                    <ResourceCell>
                        <Badge variant="outline" className="uppercase text-[10px]">
                            {log.action}
                        </Badge>
                    </ResourceCell>
                    <ResourceCell>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{log.resource_type}</span>
                            <span className="text-xs text-muted-foreground font-mono">{log.resource_id.substr(0, 8)}...</span>
                        </div>
                    </ResourceCell>
                    <ResourceCell>
                        <pre className="text-[10px] bg-slate-50 p-1 rounded max-w-[200px] overflow-hidden truncate">
                            {JSON.stringify(log.metadata)}
                        </pre>
                    </ResourceCell>
                </ResourceRow>
            ))}
            {initialLogs.length === 0 && (
                <ResourceRow>
                    <ResourceCell colSpan={5} className="text-center p-8 text-muted-foreground">
                        No audit logs found.
                    </ResourceCell>
                </ResourceRow>
            )}
        </ResourceTable>
    );
}
