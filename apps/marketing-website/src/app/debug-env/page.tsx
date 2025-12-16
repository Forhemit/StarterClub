

export default function DebugPage() {
    const envVars = [
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON",
        "CLERK_SECRET_KEY",
        "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    ];

    return (
        <div className="p-8 font-mono text-sm space-y-4">
            <h1 className="text-xl font-bold">Environment Debugger</h1>
            <div className="space-y-2">
                {envVars.map((key) => (
                    <div key={key} className="flex gap-4 border-b py-2">
                        <span className="font-bold w-64">{key}:</span>
                        <span className={process.env[key] ? "text-green-500" : "text-red-500"}>
                            {process.env[key] ? (key.includes("KEY") || key.includes("SECRET") ? `${process.env[key]?.substring(0, 5)}...` : process.env[key]) : "UNDEFINED"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-bold">Process Env Keys:</h2>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-w-full">
                    {JSON.stringify(Object.keys(process.env).sort(), null, 2)}
                </pre>
            </div>
        </div>
    );
}
