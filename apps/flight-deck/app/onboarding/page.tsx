import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { createBusiness } from '../actions/onboarding';
import { Plane, Rocket } from 'lucide-react';

export default async function OnboardingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if business already exists
    const { data: business } = await supabase
        .from('user_businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (business) {
        redirect('/dashboard');
    }

    // Fetch Industries (Modules)
    // We filter for 'industry' type to give high-level choices
    const { data: modules } = await supabase
        .from('modules')
        .select('id, name, description')
        .eq('module_type', 'industry')
        .order('name');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Rocket className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                        Register your Business
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Select your industry to generate a tailored launch checklist.
                    </p>
                </div>
                
                <form action={createBusiness} className="mt-8 space-y-6 bg-card p-8 rounded-xl shadow-sm border border-border">
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="business-name" className="block text-sm font-medium leading-6 text-foreground">
                                Business Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="business-name"
                                    name="businessName"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                        </div>
                        <div>
                             <label htmlFor="industry" className="block text-sm font-medium leading-6 text-foreground">
                                Industry / Sector
                            </label>
                             <div className="mt-2">
                                <select
                                    id="industry"
                                    name="moduleId"
                                    required
                                    className="block w-full rounded-md border-input bg-background py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select an industry...</option>
                                    {modules?.map((module) => (
                                        <option key={module.id} value={module.id}>
                                            {module.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                This helps us recommend the right tools and permits.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Plane className="h-4 w-4 text-primary-foreground/70 group-hover:text-primary-foreground" />
                            </span>
                            Launch Mission
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
