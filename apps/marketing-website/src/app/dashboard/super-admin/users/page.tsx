import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Super Admin Users | Starter Club",
  description: "Manage super admin users.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Super Admin Users"
      subtitle="Manage super admin users."
      imageQuery="admin"
    />
  );
}
