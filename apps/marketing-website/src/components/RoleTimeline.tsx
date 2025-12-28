'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TimelineEvent {
    assigned_at: string;
    effective_until?: string;
    revoked_at?: string;
    is_active: boolean;
    assigned_by: string;
    assigned_reason: string;
}

interface RoleTimelineProps {
    history: Record<string, TimelineEvent[]>;
}

export default function RoleTimeline({ history }: RoleTimelineProps) {
    const [expandedRole, setExpandedRole] = useState<string | null>(null);

    if (!history || Object.keys(history).length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {Object.entries(history).map(([roleSlug, events]) => (
                <div key={roleSlug} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setExpandedRole(expandedRole === roleSlug ? null : roleSlug)}
                        className="w-full p-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="font-medium capitalize text-gray-900">
                                {roleSlug.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${events[0]?.is_active
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                }`}>
                                {events[0]?.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">
                            {events.length} event{events.length !== 1 ? 's' : ''}
                        </span>
                    </button>

                    {expandedRole === roleSlug && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="space-y-4">
                                {events.map((event, index) => (
                                    <div key={index} className="flex items-start space-x-3 group">
                                        <div className="flex-shrink-0 mt-1">
                                            {event.is_active && !event.revoked_at ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : event.revoked_at ? (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">
                                                        {event.revoked_at ? 'Role Revoked' : 'Role Assigned'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {event.assigned_reason || 'No reason provided'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-600">
                                                        {new Date(event.assigned_at).toLocaleDateString()}
                                                    </p>
                                                    {event.revoked_at && (
                                                        <p className="text-xs text-gray-500">
                                                            until {new Date(event.revoked_at).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center text-xs text-gray-400">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                <span>
                                                    {event.assigned_by === 'system' ? 'System' : 'User'} action
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
