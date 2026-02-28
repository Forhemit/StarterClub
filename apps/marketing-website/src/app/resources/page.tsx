import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Resources | Starter Club",
  description: "Curated resources to help you on your entrepreneurial journey.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Resources"
      subtitle="Curated resources to help you on your entrepreneurial journey."
      imageQuery="resources"
    />
  );
}
