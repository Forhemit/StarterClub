import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Partner Studio | Starter Club",
  description: "Create and manage partner content.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner Studio"
      subtitle="Create and manage partner content."
      imageQuery="partners"
    />
  );
}
