"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Building2,
    Hash,
    TrendingUp,
    Info,
    Target
} from "lucide-react";
import type { BusinessCreditData, Tradeline } from "../types";

interface Step6Props {
    data: BusinessCreditData;
    onSave: (data: Partial<BusinessCreditData>) => void;
    tradelines?: Tradeline[];
}

// Score guidance
const PAYDEX_TARGETS = [
    { min: 80, max: 100, label: "Excellent", color: "text-green-600", bg: "bg-green-50" },
    { min: 70, max: 79, label: "Good", color: "text-lime-600", bg: "bg-lime-50" },
    { min: 50, max: 69, label: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" },
    { min: 0, max: 49, label: "Poor", color: "text-red-600", bg: "bg-red-50" },
];

const INTELLISCORE_TARGETS = [
    { min: 76, max: 100, label: "Low Risk", color: "text-green-600", bg: "bg-green-50" },
    { min: 51, max: 75, label: "Medium Risk", color: "text-yellow-600", bg: "bg-yellow-50" },
    { min: 26, max: 50, label: "Moderate Risk", color: "text-orange-600", bg: "bg-orange-50" },
    { min: 1, max: 25, label: "High Risk", color: "text-red-600", bg: "bg-red-50" },
];

function getScoreGrade(score: number | undefined, targets: typeof PAYDEX_TARGETS) {
    if (!score) return null;
    return targets.find(t => score >= t.min && score <= t.max);
}

export function Step6BureauMapping({ data, onSave }: Step6Props) {
    const paydexGrade = getScoreGrade(data.paydexScore, PAYDEX_TARGETS);
    const intelliscoreGrade = getScoreGrade(data.intelliscorePlus, INTELLISCORE_TARGETS);

    return (
        <div className="space-y-8">
            {/* Bureau IDs Section */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Business Bureau IDs</Label>
                <p className="text-sm text-muted-foreground -mt-2">
                    These identifiers link your business across all credit bureaus.
                </p>

                <div className="grid gap-4">
                    {/* DUNS Number */}
                    <div className="p-4 rounded-xl border bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Hash className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h4 className="font-medium">DUNS Number</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Dun &amp; Bradstreet unique 9-digit identifier
                                    </p>
                                </div>
                                <Input
                                    placeholder="12-345-6789"
                                    value={data.dunsNumber || ""}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                        const formatted = val.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                                        onSave({ dunsNumber: formatted });
                                    }}
                                    className="font-mono"
                                />
                                {!data.dunsNumber && (
                                    <p className="text-xs text-blue-600">
                                        💡 Get a free DUNS at dnb.com/duns-number.html
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Experian BIN */}
                    <div className="p-4 rounded-xl border bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <Building2 className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h4 className="font-medium">Experian BIN</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Business Identification Number for Experian
                                    </p>
                                </div>
                                <Input
                                    placeholder="Your Experian BIN"
                                    value={data.experianBin || ""}
                                    onChange={(e) => onSave({ experianBin: e.target.value })}
                                    className="font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* EIN */}
                    <div className="p-4 rounded-xl border bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <Building2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h4 className="font-medium">EIN (Last 4)</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Employer Identification Number (stored securely)
                                    </p>
                                </div>
                                <Input
                                    placeholder="1234"
                                    maxLength={4}
                                    value={data.einLastFour || ""}
                                    onChange={(e) => onSave({ einLastFour: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                    className="font-mono max-w-[120px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Business Credit Scores */}
            <div className="space-y-4">
                <Label className="text-base font-semibold">Business Credit Scores</Label>
                <p className="text-sm text-muted-foreground -mt-2">
                    Track your scores from each business credit bureau.
                </p>

                <div className="grid gap-4">
                    {/* PAYDEX Score */}
                    <div className={`p-4 rounded-xl border ${paydexGrade?.bg || "bg-card/50"}`}>
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">PAYDEX Score</h4>
                                        <p className="text-xs text-muted-foreground">
                                            D&amp;B payment history (0-100)
                                        </p>
                                    </div>
                                    {paydexGrade && (
                                        <Badge variant="outline" className={paydexGrade.color}>
                                            {paydexGrade.label}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        placeholder="80"
                                        value={data.paydexScore || ""}
                                        onChange={(e) => onSave({
                                            paydexScore: e.target.value ? Math.min(100, parseInt(e.target.value)) : undefined
                                        })}
                                        className="max-w-[100px] font-mono text-center"
                                    />
                                    <div className="flex-1">
                                        <Progress
                                            value={data.paydexScore || 0}
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Target className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Target: 80+ (pays on time or early)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intelliscore Plus */}
                    <div className="p-4 rounded-xl border bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Intelliscore Plus</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Experian business score (1-100)
                                        </p>
                                    </div>
                                    {intelliscoreGrade && (
                                        <Badge variant="outline" className={intelliscoreGrade.color}>
                                            {intelliscoreGrade.label}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={100}
                                        placeholder="76"
                                        value={data.intelliscorePlus || ""}
                                        onChange={(e) => onSave({
                                            intelliscorePlus: e.target.value ? Math.min(100, parseInt(e.target.value)) : undefined
                                        })}
                                        className="max-w-[100px] font-mono text-center"
                                    />
                                    <div className="flex-1">
                                        <Progress
                                            value={data.intelliscorePlus || 0}
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Target className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Target: 76+ (low risk)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FICO SBSS */}
                    <div className="p-4 rounded-xl border bg-card/50">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h4 className="font-medium">FICO SBSS</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Small Business Scoring Service (0-300)
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        min={0}
                                        max={300}
                                        placeholder="160"
                                        value={data.ficoSbss || ""}
                                        onChange={(e) => onSave({
                                            ficoSbss: e.target.value ? Math.min(300, parseInt(e.target.value)) : undefined
                                        })}
                                        className="max-w-[100px] font-mono text-center"
                                    />
                                    <div className="flex-1">
                                        <Progress
                                            value={(data.ficoSbss || 0) / 3}
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Target className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Target: 160+ (SBA loan minimum)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">How to Check Your Scores</h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>• <strong>PAYDEX:</strong> D&amp;B CreditBuilder ($149/mo) or free with vendors</li>
                        <li>• <strong>Intelliscore:</strong> Experian Business Credit Advantage ($299/year)</li>
                        <li>• <strong>FICO SBSS:</strong> Through lender applications (not publicly available)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
