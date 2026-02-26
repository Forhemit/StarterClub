import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Partner Profile | Starter Club",
  description: "Your partner profile and public information.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner Profile"
      subtitle="Your partner profile and public information."
      imageQuery="partners"
    />
  );
}
