import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Accelerator Program | Starter Club",
  description: "Intensive program to accelerate your startup growth.",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Accelerator Program"
      subtitle="Intensive program to accelerate your startup growth."
      imageQuery="programs"
    />
  );
}
