import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Chassis | Starter Club",
  description: "Core infrastructure and foundation settings.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Chassis"
      subtitle="Core infrastructure and foundation settings."
      imageQuery="cockpit"
    />
  );
}
