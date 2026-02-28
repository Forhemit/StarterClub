import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Directory | Starter Club",
  description: "Member and partner directory.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Directory"
      subtitle="Member and partner directory."
      imageQuery="directory"
    />
  );
}
