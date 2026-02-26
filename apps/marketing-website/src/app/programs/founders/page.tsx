import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Founders Program | Starter Club",
  description: "Support and resources for first-time founders.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Founders Program"
      subtitle="Support and resources for first-time founders."
      imageQuery="programs"
    />
  );
}
