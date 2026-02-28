import { PlaceholderPage } from "@/components/placeholder";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Partner FAQ | Starter Club",
  description: "Common questions about partnering with Starter Club.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Partner FAQ"
      subtitle="Common questions about partnering with Starter Club."
      imageQuery="faq"
    />
  );
}
