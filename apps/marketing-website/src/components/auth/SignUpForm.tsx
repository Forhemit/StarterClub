"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

export default function SignUpForm() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    if (!isLoaded) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);

        try {
            await signUp.create({
                emailAddress: email,
                password,
                unsafeMetadata: {
                    company: company,
                },
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setPendingVerification(true);
            toast.success("Account created! Please check your email for the verification code.");
        } catch (err: any) {
            console.error('Auth signup error:', err.errors?.[0]?.code || 'unknown_error');
            toast.error(err.errors?.[0]?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const onPressVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status !== "complete") {
                /*  investigate the response, to see if there was an error
                    or if the user needs to complete more steps.*/
                // Log only status for debugging (no sensitive data)
                if (process.env.NODE_ENV === 'development') {
                    console.log('Verification status:', completeSignUp.status);
                }
                toast.error("Verification failed. Please try again.");
            }

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push("/dashboard/partner");
                toast.success("Welcome to the Partner Portal!");
            }
        } catch (err: any) {
            console.error('Auth verification error:', err.errors?.[0]?.code || 'unknown_error');
            toast.error(err.errors?.[0]?.message || "Invalid code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-4 space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bebas text-[var(--accent)] text-4xl mb-2">JOIN THE CLUB</h1>
                <p className="text-muted-foreground text-sm">Partner Access Application</p>
            </div>

            {!pendingVerification ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Acme Corp"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full bg-black hover:bg-black/90" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Create Account
                    </Button>

                    <div className="text-center text-xs mt-4">
                        Already have an account? <Link href="/sign-in" className="underline font-bold">Sign In</Link>
                    </div>
                </form>
            ) : (
                <form onSubmit={onPressVerify} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="verification-code">Verification Code</Label>
                        <Input
                            id="verification-code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter code from email..."
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-[var(--accent)]" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Verify Email
                    </Button>
                    <div className="text-center text-xs mt-4">
                        <button type="button" onClick={() => setPendingVerification(false)} className="underline text-gray-500">Back to form</button>
                    </div>
                </form>
            )}
        </div>
    );
}
