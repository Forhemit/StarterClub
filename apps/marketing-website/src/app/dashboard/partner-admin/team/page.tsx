import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Partner Admin Team | Starter Club",
  description: "Manage your partner admin team.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner Admin Team"
      subtitle="Manage your partner admin team."
      imageQuery="partners"
    />
  );
}
