import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LegalVaultData } from "./types";

interface Step6Props {
    data: LegalVaultData;
    onUpdate: (data: Partial<LegalVaultData>) => void;
}

export function Step6Tax({ data, onUpdate }: Step6Props) {
    const { tax_classification = "default" } = data;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Federal Tax Classification</h3>
                <RadioGroup
                    value={tax_classification}
                    onValueChange={(val) => onUpdate({ tax_classification: val })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="default" id="r1" />
                        <Label htmlFor="r1">Default Classification (Disregarded Entity)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="c-corp" id="r2" />
                        <Label htmlFor="r2">C-Corporation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="s-corp" id="r3" />
                        <Label htmlFor="r3">S-Corporation (Form 2553 filed)</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
}
