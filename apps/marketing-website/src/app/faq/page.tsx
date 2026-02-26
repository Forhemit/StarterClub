import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "FAQ | Starter Club",
  description: "Find answers to commonly asked questions about Starter Club.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="FAQ"
      subtitle="Find answers to commonly asked questions about Starter Club."
      imageQuery="faq"
    />
  );
}
