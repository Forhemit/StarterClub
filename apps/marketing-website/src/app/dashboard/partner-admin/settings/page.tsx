import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Partner Admin Settings | Starter Club",
  description: "Configure partner admin settings.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner Admin Settings"
      subtitle="Configure partner admin settings."
      imageQuery="partners"
    />
  );
}
