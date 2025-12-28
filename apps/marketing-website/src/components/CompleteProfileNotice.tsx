'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CompleteProfileNoticeProps {
    userName: string;
    role: string;
    onComplete: () => void;
}

export default function CompleteProfileNotice({
    userName,
    role,
    onComplete
}: CompleteProfileNoticeProps) {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm relative">
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded"
            >
                <X size={16} />
            </button>

            <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">!</span>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-blue-800">
                        Complete Your Profile, {userName}!
                    </h3>
                    <p className="text-blue-700 text-sm mt-1">
                        You are registered as a <strong>{role}</strong>, but we need a few more details
                        to personalize your experience and unlock all features.
                    </p>

                    <div className="mt-3 flex gap-3">
                        <button
                            onClick={onComplete}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                            Complete Profile Now
                        </button>

                        <button
                            onClick={() => setDismissed(true)}
                            className="px-4 py-2 border border-blue-300 text-blue-700 text-sm rounded hover:bg-blue-50 transition-colors"
                        >
                            Remind Me Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
