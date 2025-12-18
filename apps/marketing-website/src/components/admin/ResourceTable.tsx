import React, { ReactNode } from "react";

interface ResourceTableProps {
    headers: string[];
    children: ReactNode;
}

export function ResourceTable({ headers, children }: ResourceTableProps) {
    return (
        <div className="w-full overflow-auto rounded-md border">
            <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors bg-gray-50/50 hover:bg-gray-50/50">
                        {headers.map((h, i) => (
                            <th key={i} className="h-12 px-4 align-middle font-medium text-muted-foreground">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function ResourceRow({ children, className = "" }: { children: ReactNode, className?: string }) {
    return (
        <tr className={`border-b transition-colors hover:bg-muted/50 ${className}`}>
            {children}
        </tr>
    );
}

export function ResourceCell({ children, className = "", ...props }: { children: ReactNode, className?: string } & React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={`p-4 align-middle ${className}`} {...props}>
            {children}
        </td>
    );
}
