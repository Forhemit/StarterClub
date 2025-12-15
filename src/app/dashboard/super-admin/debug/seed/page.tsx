"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { seedDatabaseAction } from "./actions";

export default function SeedPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const runSeed = async () => {
        setLoading(true);
        setLogs(["Requesting seed..."]);

        try {
            const { success, logs: serverLogs, error } = await seedDatabaseAction();
            if (serverLogs) {
                setLogs(prev => [...prev, ...serverLogs]);
            }
            if (!success) {
                setLogs(prev => [...prev, `Error: ${error}`]);
            } else {
                setLogs(prev => [...prev, "Seed completed successfully."]);
            }
        } catch (e: any) {
            setLogs(prev => [...prev, `Client Error: ${e.message}`]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Data Seeder</h1>
            <p className="text-muted-foreground">Creates default accounts for testing. requires 'admin' role in Clerk metadata.</p>

            <Button onClick={runSeed} disabled={loading}>
                {loading ? "Seeding..." : "Run Seed Script"}
            </Button>

            <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-64 overflow-auto">
                {logs.map((s, i) => <div key={i}>{s}</div>)}
            </div>
        </div>
    );
}
