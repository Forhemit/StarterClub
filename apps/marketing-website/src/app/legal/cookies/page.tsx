import { type Metadata } from "next";

export const dynamic = "force-static";

export default function CookiesPolicy() {
    return (
        <div className="space-y-6">
            <h1 className="font-bebas text-4xl mb-8">About Cookies</h1>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">1. What Are Cookies?</h2>
                <p>
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">2. How We Use Cookies</h2>
                <p>
                    We use cookies to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Understand how you use our website</li>
                    <li>Remember your preferences</li>
                    <li>Improve your user experience</li>
                    <li>Deliver relevant advertising</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">3. Managing Cookies</h2>
                <p>
                    Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="font-bold text-xl uppercase">4. Contact Us</h2>
                <p>
                    If you have questions about our use of cookies, please contact us at: <br />
                    <strong>Email:</strong> admin@StarterClubSF.com <br />
                    <strong>Address:</strong> 55 9th Street, San Francisco, CA 94103
                </p>
            </section>
        </div >
    );
}
