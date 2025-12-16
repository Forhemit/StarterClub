"use client";

import { useState, useMemo } from "react";
import { useSupabase } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Download, Share2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

type Track = "banks" | "insurance" | "hardware" | "saas" | "custom";

interface RoiCalculatorProps {
    orgId: string | null;
}

export default function RoiCalculator({ orgId }: RoiCalculatorProps) {
    const supabase = useSupabase();
    const { toast } = useToast();
    const [track, setTrack] = useState<Track>("banks");
    const [loading, setLoading] = useState(false);

    // State for all inputs
    const [inputs, setInputs] = useState({
        // Banks
        bank_intros: 50,
        bank_open_rate: 40,
        bank_profit: 500,
        bank_retention: 5,
        bank_annual_cost: 20000,
        // Insurance
        ins_intros: 50,
        ins_quote_rate: 60,
        ins_bind_rate: 30,
        ins_premium: 1200,
        ins_margin: 15,
        ins_retention: 3,
        ins_annual_cost: 20000,
        // Hardware
        hw_impressions: 5000,
        hw_buy_rate: 1.5,
        hw_order_val: 150,
        hw_margin: 40,
        hw_annual_cost: 25000,
        // SaaS
        saas_intros: 50,
        saas_trial_rate: 50,
        saas_active_rate: 40,
        saas_paid_rate: 25,
        saas_arpu: 50,
        saas_lifetime: 24,
        saas_annual_cost: 15000,
        // Custom
        custom_leads: 100,
        custom_conv_rate: 10,
        custom_val_per_customer: 1000,
        custom_annual_cost: 10000
    });

    const handleChange = (key: string, val: string) => {
        setInputs(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
    };

    // Calculations
    const results = useMemo(() => {
        let newCustomers = 0;
        let valueCreated = 0;
        let annualCost = 0;

        switch (track) {
            case "banks":
                newCustomers = (inputs.bank_intros * 12) * (inputs.bank_open_rate / 100);
                valueCreated = newCustomers * inputs.bank_profit * inputs.bank_retention;
                annualCost = inputs.bank_annual_cost;
                break;
            case "insurance":
                newCustomers = (inputs.ins_intros * 12) * (inputs.ins_quote_rate / 100) * (inputs.ins_bind_rate / 100);
                const annualProfit = (inputs.ins_premium * (inputs.ins_margin / 100));
                valueCreated = newCustomers * annualProfit * inputs.ins_retention;
                annualCost = inputs.ins_annual_cost;
                break;
            case "hardware":
                // Hardware impressions usually monthly, so annualize
                newCustomers = (inputs.hw_impressions * 12) * (inputs.hw_buy_rate / 100);
                const profitPerOrder = inputs.hw_order_val * (inputs.hw_margin / 100);
                valueCreated = newCustomers * profitPerOrder;
                annualCost = inputs.hw_annual_cost;
                break;
            case "saas":
                const trials = (inputs.saas_intros * 12) * (inputs.saas_trial_rate / 100);
                const active = trials * (inputs.saas_active_rate / 100);
                newCustomers = active * (inputs.saas_paid_rate / 100);
                valueCreated = newCustomers * inputs.saas_arpu * inputs.saas_lifetime;
                annualCost = inputs.saas_annual_cost;
                break;
            case "custom":
                // Assume leads are monthly unless specified. Let's assume annual logic to keep it simple or allow user to specify?
                // Common pattern: "Monthly Leads" normalized to annual
                newCustomers = (inputs.custom_leads * 12) * (inputs.custom_conv_rate / 100);
                valueCreated = newCustomers * inputs.custom_val_per_customer;
                annualCost = inputs.custom_annual_cost;
                break;
        }

        const roi = annualCost > 0 ? ((valueCreated - annualCost) / annualCost) * 100 : 0;

        return {
            newCustomers: Math.round(newCustomers * 10) / 10,
            valueCreated: Math.round(valueCreated),
            roi: Math.round(roi)
        };
    }, [inputs, track]);

    const handleSave = async () => {
        if (!orgId) {
            toast.error("No organization found. Cannot save.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.from("calculator_runs").insert({
            org_id: orgId,
            track,
            inputs,
            outputs: results
        });
        setLoading(false);

        if (error) {
            toast.error("Failed to save run.");
        } else {
            toast.success("Scenario saved successfully.");
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Inputs Column */}
            <div className="lg:col-span-2">
                <Tabs value={track} onValueChange={(v) => setTrack(v as Track)} className="w-full">
                    <TabsList className="mb-6 grid w-full grid-cols-5 bg-gray-100 p-1">
                        <TabsTrigger value="banks">Banks</TabsTrigger>
                        <TabsTrigger value="insurance">Insurance</TabsTrigger>
                        <TabsTrigger value="hardware">Hardware</TabsTrigger>
                        <TabsTrigger value="saas">SaaS</TabsTrigger>
                        <TabsTrigger value="custom">Custom</TabsTrigger>
                    </TabsList>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <TabsContent value="banks" className="space-y-4 mt-0">
                            <h3 className="font-semibold text-lg mb-4">Bank Partner Inputs</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="bank_intros">Monthly Intros</Label>
                                    <Input id="bank_intros" type="number" value={inputs.bank_intros} onChange={(e) => handleChange("bank_intros", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bank_open_rate">Account Open Rate (%)</Label>
                                    <Input id="bank_open_rate" type="number" value={inputs.bank_open_rate} onChange={(e) => handleChange("bank_open_rate", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bank_profit">Profit per Account ($/yr)</Label>
                                    <Input id="bank_profit" type="number" value={inputs.bank_profit} onChange={(e) => handleChange("bank_profit", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bank_retention">Avg Retention (Years)</Label>
                                    <Input id="bank_retention" type="number" value={inputs.bank_retention} onChange={(e) => handleChange("bank_retention", e.target.value)} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="bank_annual_cost">Annual Partnership Cost ($)</Label>
                                    <Input id="bank_annual_cost" type="number" value={inputs.bank_annual_cost} onChange={(e) => handleChange("bank_annual_cost", e.target.value)} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="insurance" className="space-y-4 mt-0">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="ins_intros">Monthly Intros</Label><Input id="ins_intros" type="number" value={inputs.ins_intros} onChange={(e) => handleChange("ins_intros", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="ins_quote_rate">Quote Rate (%)</Label><Input id="ins_quote_rate" type="number" value={inputs.ins_quote_rate} onChange={(e) => handleChange("ins_quote_rate", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="ins_bind_rate">Bind Rate (%)</Label><Input id="ins_bind_rate" type="number" value={inputs.ins_bind_rate} onChange={(e) => handleChange("ins_bind_rate", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="ins_premium">Avg Annual Premium ($)</Label><Input id="ins_premium" type="number" value={inputs.ins_premium} onChange={(e) => handleChange("ins_premium", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="ins_margin">Your Margin (%)</Label><Input id="ins_margin" type="number" value={inputs.ins_margin} onChange={(e) => handleChange("ins_margin", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="ins_retention">Retention (Years)</Label><Input id="ins_retention" type="number" value={inputs.ins_retention} onChange={(e) => handleChange("ins_retention", e.target.value)} /></div>
                                <div className="space-y-2 col-span-2"><Label htmlFor="ins_annual_cost">Annual Partnership Cost ($)</Label><Input id="ins_annual_cost" type="number" value={inputs.ins_annual_cost} onChange={(e) => handleChange("ins_annual_cost", e.target.value)} /></div>
                            </div>
                        </TabsContent>

                        <TabsContent value="hardware" className="space-y-4 mt-0">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="hw_impressions">Monthly Impressions</Label><Input id="hw_impressions" type="number" value={inputs.hw_impressions} onChange={(e) => handleChange("hw_impressions", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="hw_buy_rate">Buy Rate (%)</Label><Input id="hw_buy_rate" type="number" value={inputs.hw_buy_rate} onChange={(e) => handleChange("hw_buy_rate", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="hw_order_val">Avg Order Value ($)</Label><Input id="hw_order_val" type="number" value={inputs.hw_order_val} onChange={(e) => handleChange("hw_order_val", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="hw_margin">Margin (%)</Label><Input id="hw_margin" type="number" value={inputs.hw_margin} onChange={(e) => handleChange("hw_margin", e.target.value)} /></div>
                                <div className="space-y-2 col-span-2"><Label htmlFor="hw_annual_cost">Annual Partnership Cost ($)</Label><Input id="hw_annual_cost" type="number" value={inputs.hw_annual_cost} onChange={(e) => handleChange("hw_annual_cost", e.target.value)} /></div>
                            </div>
                        </TabsContent>

                        <TabsContent value="saas" className="space-y-4 mt-0">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="saas_intros">Monthly Intros</Label><Input id="saas_intros" type="number" value={inputs.saas_intros} onChange={(e) => handleChange("saas_intros", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="saas_trial_rate">Trial Rate (%)</Label><Input id="saas_trial_rate" type="number" value={inputs.saas_trial_rate} onChange={(e) => handleChange("saas_trial_rate", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="saas_active_rate">Active User Rate (%)</Label><Input id="saas_active_rate" type="number" value={inputs.saas_active_rate} onChange={(e) => handleChange("saas_active_rate", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="saas_paid_rate">Paid Conversion (%)</Label><Input id="saas_paid_rate" type="number" value={inputs.saas_paid_rate} onChange={(e) => handleChange("saas_paid_rate", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="saas_arpu">Avg Monthly Sub ($)</Label><Input id="saas_arpu" type="number" value={inputs.saas_arpu} onChange={(e) => handleChange("saas_arpu", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="saas_lifetime">Avg Lifetime (Months)</Label><Input id="saas_lifetime" type="number" value={inputs.saas_lifetime} onChange={(e) => handleChange("saas_lifetime", e.target.value)} /></div>
                                <div className="space-y-2 col-span-2"><Label htmlFor="saas_annual_cost">Annual Partnership Cost ($)</Label><Input id="saas_annual_cost" type="number" value={inputs.saas_annual_cost} onChange={(e) => handleChange("saas_annual_cost", e.target.value)} /></div>
                            </div>
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-4 mt-0">
                            <h3 className="font-semibold text-lg mb-4">Custom Model</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="custom_leads">Monthly Leads/Traffic</Label><Input id="custom_leads" type="number" value={inputs.custom_leads} onChange={(e) => handleChange("custom_leads", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="custom_conv_rate">Conversion Rate (%)</Label><Input id="custom_conv_rate" type="number" value={inputs.custom_conv_rate} onChange={(e) => handleChange("custom_conv_rate", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="custom_val_per_customer">Total Lifetime Value per Customer ($)</Label><Input id="custom_val_per_customer" type="number" value={inputs.custom_val_per_customer} onChange={(e) => handleChange("custom_val_per_customer", e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="custom_annual_cost">Annual Partnership Cost ($)</Label><Input id="custom_annual_cost" type="number" value={inputs.custom_annual_cost} onChange={(e) => handleChange("custom_annual_cost", e.target.value)} /></div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Results Column */}
            <div className="space-y-6">
                <div className="rounded-xl bg-[var(--accent)] text-white p-6 shadow-lg">
                    <h2 className="text-lg font-bebas tracking-wide opacity-90 mb-6">PROJECTED OUTCOMES (ANNUALIZED)</h2>

                    <div className="space-y-6">
                        <div>
                            <p className="text-sm opacity-80 mb-1">Total Value Created (Lifetime)</p>
                            <p className="text-4xl font-bold">${results.valueCreated.toLocaleString()}</p>
                            <p className="text-xs opacity-60 mt-1">Based on 12 months of traffic/leads</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                            <div>
                                <p className="text-xs opacity-80 mb-1">New Customers (Yr)</p>
                                <p className="text-xl font-bold">{results.newCustomers}</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-80 mb-1">Est. ROI</p>
                                <p className="text-xl font-bold">{results.roi}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3">
                    <Button onClick={handleSave} disabled={loading} className="w-full bg-black hover:bg-black/80 text-white h-12">
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Saving..." : "Save Scenario"}
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Card
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
