import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "User Management | Starter Club",
  description: "Manage users, roles, and permissions.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="User Management"
      subtitle="Manage users, roles, and permissions."
      imageQuery="admin"
    />
  );
}
