export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Marketplace</h1>
                <p className="text-muted-foreground text-sm max-w-2xl">
                    Discover and install powerful modules to extend your Business Operating System.
                    From financial controls to investor reporting, build your perfect infrastructure.
                </p>
            </div>
            {children}
        </div>
    );
}
