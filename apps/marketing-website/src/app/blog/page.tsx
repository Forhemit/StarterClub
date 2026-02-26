import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Blog | Starter Club",
  description: "Insights, stories, and updates from the Starter Club community.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Blog"
      subtitle="Insights, stories, and updates from the Starter Club community."
      imageQuery="blog"
    />
  );
}
