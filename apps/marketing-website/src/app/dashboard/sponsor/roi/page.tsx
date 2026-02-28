import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Sponsor ROI | Starter Club",
  description: "Measure the impact of your sponsorship.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Sponsor ROI"
      subtitle="Measure the impact of your sponsorship."
      imageQuery="sponsor"
    />
  );
}
