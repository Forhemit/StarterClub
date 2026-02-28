import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Stripe Dashboard | Starter Club",
  description: "Stripe integration and payment management.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Stripe Dashboard"
      subtitle="Stripe integration and payment management."
      imageQuery="default"
    />
  );
}
