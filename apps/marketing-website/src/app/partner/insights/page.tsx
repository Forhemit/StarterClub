import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Partner Insights | Starter Club",
  description: "Data-driven insights for partners.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner Insights"
      subtitle="Data-driven insights for partners."
      imageQuery="partners"
    />
  );
}
