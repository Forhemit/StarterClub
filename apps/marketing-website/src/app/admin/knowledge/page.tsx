import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Knowledge Base | Starter Club",
  description: "Centralized knowledge repository for the team.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Knowledge Base"
      subtitle="Centralized knowledge repository for the team."
      imageQuery="admin"
    />
  );
}
