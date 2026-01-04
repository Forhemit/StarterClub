
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AcquisitionReadinessData } from "./types";
import { cn } from "@/lib/utils";

interface Step2Props {
    data: AcquisitionReadinessData;
    onUpdate: (data: Partial<AcquisitionReadinessData>) => void;
}

export function Step2RedFlagScanner({ data, onUpdate }: Step2Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-400">Red Flag Scanner</h4>
                        <p className="text-sm text-amber-800 dark:text-amber-500 mt-1">
                            Identify potential deal-breakers early using our automated checklist.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Financial Health</h3>
                    <div className="bg-card border rounded-lg p-4">
                        <Label className="text-base mb-3 block">What is the status of your financial audits?</Label>
                        <RadioGroup
                            value={data.financial_audit_status}
                            onValueChange={(val) => onUpdate({ financial_audit_status: val as any })}
                            className="space-y-2"
                        >
                            <div className={cn("flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors", data.financial_audit_status === 'complete' && "bg-green-50 dark:bg-green-900/20")}>
                                <RadioGroupItem value="complete" id="fin-complete" />
                                <Label htmlFor="fin-complete" className="flex-1 cursor-pointer">Audited (GAAP Compliant)</Label>
                                {data.financial_audit_status === 'complete' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            </div>
                            <div className={cn("flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors", data.financial_audit_status === 'in_progress' && "bg-blue-50 dark:bg-blue-900/20")}>
                                <RadioGroupItem value="in_progress" id="fin-progress" />
                                <Label htmlFor="fin-progress" className="flex-1 cursor-pointer">In Progress / Review</Label>
                            </div>
                            <div className={cn("flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors", data.financial_audit_status === 'not_started' && "bg-red-50 dark:bg-red-900/20")}>
                                <RadioGroupItem value="not_started" id="fin-not" />
                                <Label htmlFor="fin-not" className="flex-1 cursor-pointer">Not Started / Unaudited</Label>
                                {data.financial_audit_status === 'not_started' && <XCircle className="h-4 w-4 text-red-500" />}
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Legal & IP</h3>
                    <div className="bg-card border rounded-lg p-4">
                        <Label className="text-base mb-3 block">Have all IP assignments been signed by employees/contractors?</Label>
                        <RadioGroup
                            value={data.legal_audit_status}
                            onValueChange={(val) => onUpdate({ legal_audit_status: val as any })}
                            className="space-y-2"
                        >
                            <div className={cn("flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors", data.legal_audit_status === 'complete' && "bg-green-50 dark:bg-green-900/20")}>
                                <RadioGroupItem value="complete" id="legal-complete" />
                                <Label htmlFor="legal-complete" className="flex-1 cursor-pointer">Yes, 100% Coverage</Label>
                            </div>
                            <div className={cn("flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors", data.legal_audit_status === 'in_progress' && "bg-blue-50 dark:bg-blue-900/20")}>
                                <RadioGroupItem value="in_progress" id="legal-progress" />
                                <Label htmlFor="legal-progress" className="flex-1 cursor-pointer">Some Missing</Label>
                            </div>
                            <div className={cn("flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors", data.legal_audit_status === 'not_started' && "bg-red-50 dark:bg-red-900/20")}>
                                <RadioGroupItem value="not_started" id="legal-not" />
                                <Label htmlFor="legal-not" className="flex-1 cursor-pointer">No / Unknown</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}
