import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Vault | Starter Club",
  description: "Secure storage for important documents and assets.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Vault"
      subtitle="Secure storage for important documents and assets."
      imageQuery="cockpit"
    />
  );
}
