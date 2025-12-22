import BrandingHeaderAuth from "./BrandingHeaderAuth";

export function BrandingHeader() {
    return (
        <div className="mb-12 md:mb-20 w-full flex justify-between items-center bg-white/50 backdrop-blur-sm px-4 py-2 border-b-4 border-black">
            <h1 className="font-bebas text-3xl md:text-4xl tracking-widest uppercase text-black">
                Starter Club SF
            </h1>
            <BrandingHeaderAuth />
        </div>
    );
}
