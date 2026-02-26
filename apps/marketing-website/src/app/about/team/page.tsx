import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Our Team | Starter Club",
  description: "Meet the passionate people building Starter Club.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Our Team"
      subtitle="Meet the passionate people building Starter Club."
      imageQuery="team"
    />
  );
}
