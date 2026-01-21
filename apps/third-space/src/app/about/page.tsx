export const metadata = {
  title: "About | Third Space",
  description: "Learn about Third Space Charging and our mission to build climate-resilient community infrastructure.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1>About Third Space</h1>

      <div className="mt-8 space-y-6">
        <section>
          <h2>Our Mission</h2>
          <p>
            Third Space Charging is a Public Benefit Corporation (PBC) building
            climate-resilient community infrastructure through a network of EV
            charging stations integrated with local businesses.
          </p>
        </section>

        <section>
          <h2>What We Do</h2>
          <p>
            We partner with coffee shops, membership clubs, EV dealers, and
            property landlords to create charging stations that serve as
            community hubs. Our digital platform serves as:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Primary information hub for the Forhemit Ecosystem</li>
            <li>Partner management system for 4 partner types</li>
            <li>Government stakeholder engagement tool</li>
            <li>AI-powered content creation platform</li>
          </ul>
        </section>

        <section>
          <h2>Partner Framework</h2>
          <p>
            Our partner framework provides specialized tools and resources for:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Coffee Shops</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Charging stations integrated into cafe environments
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Membership Clubs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Exclusive charging for club members
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">EV Dealers</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Dealer integration and customer education
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Property Landlords</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Site selection and infrastructure support
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Government Engagement</h2>
          <p>
            We work closely with government stakeholders to ensure our
            infrastructure aligns with climate goals and community needs.
            Our government portal provides access to business plans, financial
            projections, and crisis mitigation strategies.
          </p>
        </section>
      </div>
    </div>
  );
}
