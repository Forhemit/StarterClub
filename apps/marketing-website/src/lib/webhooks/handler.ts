import { Webhook } from 'svix';
import { headers } from 'next/headers';
import {
    handleUserCreated,
    handleUserUpdated,
    handleSubscriptionCreated,
    handleSubscriptionUpdated,
    handleSubscriptionDeleted
} from './actions';

// Clerk event types
type ClerkEvent = {
    type: string;
    data: any;
    object: string;
};

export async function POST(request: Request) {
    const payload = await request.json();
    const headersList = await headers();

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    let evt: ClerkEvent;

    try {
        evt = wh.verify(
            JSON.stringify(payload),
            {
                'svix-id': headersList.get('svix-id')!,
                'svix-timestamp': headersList.get('svix-timestamp')!,
                'svix-signature': headersList.get('svix-signature')!,
            }
        ) as ClerkEvent;
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return new Response('Webhook verification failed', { status: 400 });
    }

    const eventType = evt.type;

    try {
        switch (eventType) {
            case 'user.created':
                await handleUserCreated(evt.data);
                break;

            case 'user.updated':
                await handleUserUpdated(evt.data);
                break;

            case 'subscription.created':
                await handleSubscriptionCreated(evt.data);
                break;

            case 'subscription.updated':
                await handleSubscriptionUpdated(evt.data);
                break;

            case 'subscription.deleted':
                await handleSubscriptionDeleted(evt.data);
                break;

            default:
                console.log(`Unhandled event type: ${eventType}`);
        }

        return new Response('Webhook processed', { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response('Error processing webhook', { status: 500 });
    }
}
