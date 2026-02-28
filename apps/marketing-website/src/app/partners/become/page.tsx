import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Become a Partner | Starter Club",
  description: "Join our partner ecosystem and help entrepreneurs succeed.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Become a Partner"
      subtitle="Join our partner ecosystem and help entrepreneurs succeed."
      imageQuery="partners"
    />
  );
}
