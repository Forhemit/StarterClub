import React from 'react';

export const StepContainer = ({ children, title }: React.PropsWithChildren<{ title: string }>) => (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">{title}</h2>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            {children}
        </div>
    </div>
);

export const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }: any) => {
    const base = "w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-blue-300",
        secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600",
        outline: "border-2 border-slate-300 text-slate-500 hover:text-slate-700",
        green: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-transparent hover:border-red-200"
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}>
            {children}
        </button>
    );
};
