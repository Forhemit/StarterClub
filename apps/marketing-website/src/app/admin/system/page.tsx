import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "System | Starter Club",
  description: "System monitoring and health checks.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="System"
      subtitle="System monitoring and health checks."
      imageQuery="admin"
    />
  );
}
