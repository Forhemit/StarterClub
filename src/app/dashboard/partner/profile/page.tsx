import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
            <UserProfile routing="hash" />
        </div>
    );
}
