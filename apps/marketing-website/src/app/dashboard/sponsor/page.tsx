import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Sponsor Dashboard | Starter Club",
  description: "Your sponsor dashboard and overview.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Sponsor Dashboard"
      subtitle="Your sponsor dashboard and overview."
      imageQuery="sponsor"
    />
  );
}
