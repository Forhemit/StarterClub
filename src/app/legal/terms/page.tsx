import { type Metadata } from "next";

export const dynamic = "force-static";

export default function TermsOfUse() {
    return (
        <div className="space-y-6">
            <h1 className="font-bebas text-4xl mb-8">Terms of Use</h1>
            <p className="text-sm text-black/60 italic">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">1. Agreement to Terms</h2>
                <p>
                    By accessing or using the Starter Club SF website and services, you agree to be bound by these Terms of Use and our Privacy Policy.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">2. Use of Services</h2>
                <p>
                    You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">3. Intellectual Property</h2>
                <p>
                    The content, features, and functionality of our services are owned by Starter Club SF and are protected by copyright, trademark, and other intellectual property laws.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">4. Contact Information</h2>
                <p>
                    For any questions about these Terms, please contact us at:
                </p>
                <ul className="list-none space-y-1">
                    <li>Starter Club SF</li>
                    <li>55 9th Street, San Francisco, CA 94103</li>
                    <li>Email: admin@StarterClubSF.com</li>
                    <li>Phone: (202) 505-3567</li>
                </ul>
            </section>
        </div>
    );
}
