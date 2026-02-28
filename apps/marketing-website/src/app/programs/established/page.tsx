import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Established Program | Starter Club",
  description: "Resources for established businesses.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Established Program"
      subtitle="Resources for established businesses."
      imageQuery="programs"
    />
  );
}
