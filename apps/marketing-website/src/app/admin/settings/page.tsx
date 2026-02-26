import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Admin Settings | Starter Club",
  description: "System-wide configuration and settings.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Admin Settings"
      subtitle="System-wide configuration and settings."
      imageQuery="admin"
    />
  );
}
