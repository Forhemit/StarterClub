export default function FlagsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Content Flags</h1>
                <p className="text-muted-foreground">Review user-flagged content or system alerts.</p>
            </div>
            <div className="p-12 border rounded-lg bg-gray-50 text-center flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-full shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                    >
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" x2="4" y1="22" y2="15" />
                    </svg>
                </div>
                <h3 className="font-medium text-lg">No Active Flags</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                    There is currently no flagged content requiring review. When users report content, it will appear here.
                </p>
            </div>
        </div>
    );
}
