import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Crew | Starter Club",
  description: "Team management and collaboration tools.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Crew"
      subtitle="Team management and collaboration tools."
      imageQuery="cockpit"
    />
  );
}
