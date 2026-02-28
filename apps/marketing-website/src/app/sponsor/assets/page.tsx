import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Sponsor Assets | Starter Club",
  description: "Brand assets and sponsorship materials.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Sponsor Assets"
      subtitle="Brand assets and sponsorship materials."
      imageQuery="sponsor"
    />
  );
}
