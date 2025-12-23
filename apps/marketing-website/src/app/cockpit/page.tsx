import React from 'react';
import { CockpitLayout } from '@/components/cockpit/CockpitLayout';
import { StatusGauge } from '@/components/cockpit/StatusGauge';

export default function CockpitPage() {
    return (
        <CockpitLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">Telemetry</h1>
                    <p className="text-muted-foreground">Real-time business resilience monitoring.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase">Structure Status</h3>
                        <div className="mt-4">
                            <StatusGauge status="wood" />
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase">Decay Rate</h3>
                        <div className="mt-4 text-2xl font-mono text-foreground">
                            -12.4% <span className="text-xs text-destructive">/ month</span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase">Next Inspection</h3>
                        <div className="mt-4 text-2xl font-mono text-foreground">
                            4 Days
                        </div>
                    </div>
                </div>
            </div>
        </CockpitLayout>
    );
}
