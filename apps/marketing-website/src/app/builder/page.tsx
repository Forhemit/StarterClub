import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Builder | Starter Club",
  description: "Tools and resources to build your business from idea to reality.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Builder"
      subtitle="Tools and resources to build your business from idea to reality."
      imageQuery="builder"
    />
  );
}
