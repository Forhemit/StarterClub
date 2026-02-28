import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Resource Toolkit | Starter Club",
  description: "Essential tools and templates for entrepreneurs.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Resource Toolkit"
      subtitle="Essential tools and templates for entrepreneurs."
      imageQuery="resources"
    />
  );
}
