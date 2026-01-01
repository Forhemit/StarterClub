"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Shield, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TwoPersonIntegrityRules {
    ndasConfidential: 'single' | '2pi';
    vendorUnder50k: 'single' | '2pi';
    vendorOver50k: 'single' | '2pi';
    employmentJunior: 'single' | '2pi';
    employmentSenior: 'single' | '2pi';
    bankWireChecks: 'single' | '2pi';
    voiceMemosHighValue: 'single' | '2pi';
    mentoringAgreements: 'single' | '2pi';
}

interface Step10Props {
    data: any;
    onSave: (data: any) => void;
}

const DEFAULT_RULES: TwoPersonIntegrityRules = {
    ndasConfidential: 'single',
    vendorUnder50k: 'single',
    vendorOver50k: '2pi',
    employmentJunior: 'single',
    employmentSenior: '2pi',
    bankWireChecks: '2pi',
    voiceMemosHighValue: 'single',
    mentoringAgreements: 'single',
};

interface PillOption {
    key: keyof TwoPersonIntegrityRules;
    label: string;
    description: string;
    category: 'documents' | 'financial' | 'knowledge';
}

const PILL_OPTIONS: PillOption[] = [
    { key: 'ndasConfidential', label: 'NDAs & Confidentiality', description: 'Non-disclosure agreements', category: 'documents' },
    { key: 'vendorUnder50k', label: 'Vendor Agreements < $50k', description: 'Standard vendor contracts', category: 'documents' },
    { key: 'vendorOver50k', label: 'Vendor Agreements ≥ $50k', description: 'High-value vendor contracts', category: 'documents' },
    { key: 'employmentJunior', label: 'Employment (Junior)', description: 'Entry-level hiring offers', category: 'documents' },
    { key: 'employmentSenior', label: 'Employment (Senior)', description: 'Director+ level hiring', category: 'documents' },
    { key: 'bankWireChecks', label: 'Bank Wire / Checks', description: 'Financial transactions', category: 'financial' },
    { key: 'voiceMemosHighValue', label: 'High-Value Voice Memos', description: 'Strategic knowledge recordings', category: 'knowledge' },
    { key: 'mentoringAgreements', label: 'Mentoring Agreements', description: 'Formal mentoring contracts', category: 'knowledge' },
];

export function Step10TwoPersonIntegrity({ data, onSave }: Step10Props) {
    const [rules, setRules] = useState<TwoPersonIntegrityRules>(
        data.twoPersonIntegrityRules || DEFAULT_RULES
    );

    useEffect(() => {
        onSave({ ...data, twoPersonIntegrityRules: rules });
    }, [rules]);

    const toggleRule = (key: keyof TwoPersonIntegrityRules) => {
        setRules(prev => ({
            ...prev,
            [key]: prev[key] === 'single' ? '2pi' : 'single'
        }));
    };

    const is2PI = (key: keyof TwoPersonIntegrityRules) => rules[key] === '2pi';

    const Pill = ({ option }: { option: PillOption }) => {
        const isRequired = is2PI(option.key);
        return (
            <button
                type="button"
                onClick={() => toggleRule(option.key)}
                className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left w-full",
                    isRequired
                        ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800"
                        : "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-800",
                    "hover:scale-[1.02] active:scale-[0.98]"
                )}
            >
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    isRequired ? "bg-red-200 dark:bg-red-800" : "bg-green-200 dark:bg-green-800"
                )}>
                    {isRequired ? (
                        <X className="w-4 h-4 text-red-700 dark:text-red-300" />
                    ) : (
                        <Check className="w-4 h-4 text-green-700 dark:text-green-300" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-medium text-sm",
                        isRequired ? "text-red-900 dark:text-red-200" : "text-green-900 dark:text-green-200"
                    )}>
                        {option.label}
                    </div>
                    <div className={cn(
                        "text-xs truncate",
                        isRequired ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
                    )}>
                        {option.description}
                    </div>
                </div>
                <div className={cn(
                    "text-[10px] font-semibold uppercase px-2 py-1 rounded",
                    isRequired
                        ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                        : "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                )}>
                    {isRequired ? "2PI" : "Single"}
                </div>
            </button>
        );
    };

    const documentOptions = PILL_OPTIONS.filter(o => o.category === 'documents');
    const financialOptions = PILL_OPTIONS.filter(o => o.category === 'financial');
    const knowledgeOptions = PILL_OPTIONS.filter(o => o.category === 'knowledge');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Two-Person Integrity Configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                    Select which actions require a second authorized signature (2PI).
                </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-200 border-2 border-green-400"></div>
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">Single Signature</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-200 border-2 border-red-400"></div>
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">2PI Required</span>
                </div>
                <div className="text-xs text-muted-foreground ml-auto">Click to toggle</div>
            </div>

            {/* Document Signing */}
            <Card className="p-5 space-y-4">
                <Label className="text-base font-semibold">Document Signing</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {documentOptions.map(option => (
                        <Pill key={option.key} option={option} />
                    ))}
                </div>
            </Card>

            {/* Financial Transactions */}
            <Card className="p-5 space-y-4">
                <Label className="text-base font-semibold">Financial Transactions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {financialOptions.map(option => (
                        <Pill key={option.key} option={option} />
                    ))}
                </div>
            </Card>

            {/* Knowledge Assets */}
            <Card className="p-5 space-y-4">
                <Label className="text-base font-semibold">Knowledge Assets</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {knowledgeOptions.map(option => (
                        <Pill key={option.key} option={option} />
                    ))}
                </div>
            </Card>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-amber-900 dark:text-amber-300 mb-2">Why Two-Person Integrity?</h4>
                <p className="text-xs text-amber-800 dark:text-amber-400">
                    2PI controls prevent fraud and ensure accountability. High-value transactions and sensitive operations should require dual authorization to protect both the organization and the individuals involved.
                </p>
            </div>
        </div>
    );
}
