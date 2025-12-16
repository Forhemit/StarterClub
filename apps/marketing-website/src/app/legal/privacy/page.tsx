export { type Metadata } from "next";

export const dynamic = "force-static";

export default function PrivacyPolicy() {
    return (
        <div className="space-y-6">
            <h1 className="font-bebas text-4xl mb-8">Privacy Policy</h1>

            <p className="text-sm text-black/60 italic">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">1. Introduction</h2>
                <p>
                    Starter Club SF ("we," "us," or "our") respects your privacy and is committed to protecting your personal data.
                    This privacy policy will inform you as to how we look after your personal data and tell you about your privacy rights and how the law protects you.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">2. Contact Details</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Full name of legal entity:</strong> Starter Club SF</li>
                    <li><strong>Email address:</strong> admin@StarterClubSF.com</li>
                    <li><strong>Postal address:</strong> 55 9th Street, San Francisco, CA 94103</li>
                    <li><strong>Telephone number:</strong> (202) 505-3567</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">3. Data We Collect</h2>
                <p>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                </ul>
            </section>

            {/* Add more sections as standard for a privacy policy */}
            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">4. How We Use Your Personal Data</h2>
                <p>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li>Where we need to comply with a legal obligation.</li>
                </ul>
            </section>
        </div>
    );
}
