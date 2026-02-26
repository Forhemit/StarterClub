import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Partner ROI | Starter Club",
  description: "Track return on investment for partner activities.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner ROI"
      subtitle="Track return on investment for partner activities."
      imageQuery="partners"
    />
  );
}
