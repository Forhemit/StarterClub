"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Step6Tax() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Federal Tax Classification</h3>
                <RadioGroup defaultValue="default">
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
