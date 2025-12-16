import { type Metadata } from "next";

export const dynamic = "force-static";
export default function CaliforniaPrivacyRights() {
    return (
        <div className="space-y-6">
            <h1 className="font-bebas text-4xl mb-8">Your California Privacy Rights</h1>
            <p className="text-sm text-black/60 italic">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">1. California Consumer Privacy Act (CCPA)</h2>
                <p>
                    If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with specific rights regarding your personal information.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">2. Your Rights</h2>
                <p>
                    You have the right to request that we disclose certain information to you about our collection and use of your personal information over the past 12 months. You also have the right to request that we delete any of your personal information that we collected from you and retained, subject to certain exceptions.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">3. Do Not Sell My Information</h2>
                <p>
                    We do not sell your personal information.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">4. Exercising Your Rights</h2>
                <p>
                    To exercise your rights under the CCPA, please submit a verifiable consumer request to us by either:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Calling us at (202) 505-3567</li>
                    <li>Emailing us at admin@StarterClubSF.com</li>
                    <li>Writing to us at: <br />Starter Club SF<br />55 9th Street<br />San Francisco, CA 94103</li>
                </ul>
            </section>
        </div>
    );
}
