import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Sponsor Campaigns | Starter Club",
  description: "Manage your sponsorship campaigns.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Sponsor Campaigns"
      subtitle="Manage your sponsorship campaigns."
      imageQuery="sponsor"
    />
  );
}
