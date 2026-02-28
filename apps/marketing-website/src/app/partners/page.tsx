import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Partners | Starter Club",
  description: "Strategic partners helping us build the future of entrepreneurship.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partners"
      subtitle="Strategic partners helping us build the future of entrepreneurship."
      imageQuery="partners"
    />
  );
}
