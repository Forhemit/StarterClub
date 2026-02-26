import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Spaces Tour | Starter Club",
  description: "Take a virtual tour of our spaces.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Spaces Tour"
      subtitle="Take a virtual tour of our spaces."
      imageQuery="default"
    />
  );
}
