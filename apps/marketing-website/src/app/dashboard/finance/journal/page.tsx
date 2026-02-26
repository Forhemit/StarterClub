import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Finance Journal | Starter Club",
  description: "Journal entries and financial records.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Finance Journal"
      subtitle="Journal entries and financial records."
      imageQuery="default"
    />
  );
}
