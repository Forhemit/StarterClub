import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedEvents() {
    console.log('Starting event seed...');

    // First, get some test user IDs
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('Error fetching users:', userError);
        return;
    }

    if (!users.users || users.users.length === 0) {
        console.error('No users found. Please create users first.');
        return;
    }

    const userIds = users.users.map(u => u.id);
    const eventTypes = ['meeting', 'workshop', 'social', 'training', 'conference'];
    const events = [];

    // Create past events (last 30 days)
    for (let i = 0; i < 15; i++) {
        const eventDate = faker.date.recent({ days: 30 });
        events.push({
            title: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(2),
            event_date: eventDate.toISOString(),
            end_date: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
            location: faker.location.streetAddress(),
            event_type: faker.helpers.arrayElement(eventTypes),
            created_by: faker.helpers.arrayElement(userIds),
            status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
    }

    // Create upcoming events (next 30 days)
    for (let i = 0; i < 15; i++) {
        const eventDate = faker.date.soon({ days: 30 });
        events.push({
            title: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(2),
            event_date: eventDate.toISOString(),
            end_date: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
            location: faker.location.streetAddress(),
            event_type: faker.helpers.arrayElement(eventTypes),
            created_by: faker.helpers.arrayElement(userIds),
            status: 'scheduled',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
    }

    // Insert events
    const { data, error } = await supabase
        .from('events')
        .insert(events)
        .select();

    if (error) {
        console.error('Error seeding events:', error);
    } else {
        console.log(`Successfully seeded ${data?.length} events`);
    }
}

// Run the seed function
seedEvents();
