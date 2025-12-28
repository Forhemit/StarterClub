"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreditCard, Calendar, ArrowUpRight, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionTabProps {
    profile: any;
    userId?: string;
}

// Mock subscription data - in production, fetch from Stripe/database
const mockSubscription = {
    planName: "Starter Pro",
    status: "active",
    price: "$49",
    interval: "month",
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
};

const plans = [
    { id: "starter_pro", name: "Starter Pro", price: "$49/mo", current: true },
    { id: "builder", name: "Builder", price: "$99/mo", current: false },
    { id: "founder", name: "Founder", price: "$249/mo", current: false },
];

export function SubscriptionTab({ profile, userId }: SubscriptionTabProps) {
    const [loading, setLoading] = useState(false);
    const [canceling, setCanceling] = useState(false);

    const subscription = mockSubscription;
    const daysUntilRenewal = Math.ceil(
        (new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const handleManageBilling = async () => {
        setLoading(true);
        try {
            // TODO: Create Stripe customer portal session and redirect
            // const response = await createBillingPortalSession(userId);
            // window.location.href = response.url;
            toast.info("Redirecting to billing portal...");
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.open("https://billing.stripe.com/p/login/test", "_blank");
        } catch (error) {
            toast.error("Failed to open billing portal");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        setCanceling(true);
        try {
            // TODO: Implement cancel subscription action
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("Subscription canceled. You'll retain access until the end of your billing period.");
        } catch (error) {
            toast.error("Failed to cancel subscription");
        } finally {
            setCanceling(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Current Plan */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-primary" />
                                Current Plan
                            </CardTitle>
                            <CardDescription>Your active subscription details.</CardDescription>
                        </div>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {subscription.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-bold">{subscription.planName}</h3>
                                <p className="text-muted-foreground">
                                    {subscription.price}/{subscription.interval}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Renews in</p>
                                <p className="text-lg font-bold text-primary">{daysUntilRenewal} days</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                                Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Plan Options */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Available Plans</CardTitle>
                    <CardDescription>Upgrade or change your subscription plan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`p-4 rounded-lg border-2 flex items-center justify-between transition-colors ${plan.current
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div>
                                    <h4 className="font-medium flex items-center gap-2">
                                        {plan.name}
                                        {plan.current && (
                                            <Badge variant="secondary" className="text-[10px]">Current</Badge>
                                        )}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{plan.price}</p>
                                </div>
                                {!plan.current && (
                                    <Button variant="outline" size="sm">
                                        Switch <ArrowUpRight className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Billing Management */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Billing Management</CardTitle>
                    <CardDescription>Update payment method or view invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={handleManageBilling}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Opening portal...
                            </>
                        ) : (
                            <>
                                <span>Manage Billing & Payment</span>
                                <ArrowUpRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full justify-between text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <span className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Cancel Subscription
                                </span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You'll continue to have access until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                                    After that, you'll lose access to premium features.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancelSubscription}
                                    className="bg-destructive hover:bg-destructive/90"
                                    disabled={canceling}
                                >
                                    {canceling ? "Canceling..." : "Yes, Cancel"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
