import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Sponsor Signals | Starter Club",
  description: "Monitor sponsorship performance signals.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Sponsor Signals"
      subtitle="Monitor sponsorship performance signals."
      imageQuery="sponsor"
    />
  );
}
