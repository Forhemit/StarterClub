import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Partner Admin | Starter Club",
  description: "Administrative tools for managing partners.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner Admin"
      subtitle="Administrative tools for managing partners."
      imageQuery="partners"
    />
  );
}
