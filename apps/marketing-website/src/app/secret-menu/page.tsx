import { PlaceholderPage } from "@/components/placeholder/PlaceholderPage";

export const metadata = {
  title: "Secret Menu | Starter Club",
  description: "Shhh... you found the secret menu!",
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Secret Menu"
      subtitle="Shhh... you found the secret menu!"
      imageQuery="default"
    />
  );
}
