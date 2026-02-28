import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "System Logs | Starter Club",
  description: "System logs and audit trails.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="System Logs"
      subtitle="System logs and audit trails."
      imageQuery="admin"
    />
  );
}
