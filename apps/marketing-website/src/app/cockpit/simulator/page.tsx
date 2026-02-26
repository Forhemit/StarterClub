import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Simulator | Starter Club",
  description: "Test scenarios and simulate business outcomes.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Simulator"
      subtitle="Test scenarios and simulate business outcomes."
      imageQuery="cockpit"
    />
  );
}
