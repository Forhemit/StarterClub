export const metadata = {
  title: "Contact | Third Space",
  description: "Get in touch with the Third Space team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1>Contact Us</h1>

      <div className="mt-8 space-y-6">
        <p className="text-lg text-muted-foreground">
          Have questions about Third Space Charging? We'd love to hear from
          you.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">General Inquiries</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For questions about our services and partnerships.
            </p>
            <a
              href="mailto:info@forhemit.com"
              className="text-sm text-primary hover:underline"
            >
              info@forhemit.com
            </a>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Partner Inquiries</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Interested in becoming a partner location?
            </p>
            <a
              href="mailto:partners@forhemit.com"
              className="text-sm text-primary hover:underline"
            >
              partners@forhemit.com
            </a>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Government Relations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For government stakeholders and policy inquiries.
            </p>
            <a
              href="mailto:government@forhemit.com"
              className="text-sm text-primary hover:underline"
            >
              government@forhemit.com
            </a>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Investor Relations</h3>
            <p className="text-sm text-muted-foreground mb-4">
              For investment and financial information.
            </p>
            <a
              href="mailto:investors@forhemit.com"
              className="text-sm text-primary hover:underline"
            >
              investors@forhemit.com
            </a>
          </div>
        </div>

        <div className="mt-8 p-6 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Migrating Platform</h3>
          <p className="text-sm text-muted-foreground">
            Our platform is currently being upgraded. If you experience any
            issues accessing your account or partner portal, please contact us
            and we'll assist you promptly.
          </p>
        </div>
      </div>
    </div>
  );
}
