import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Partner Introductions | Starter Club",
  description: "Manage and track partner introductions.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner Introductions"
      subtitle="Manage and track partner introductions."
      imageQuery="partners"
    />
  );
}
