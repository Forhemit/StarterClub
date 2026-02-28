import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient as createServerClient } from '@/lib/supabase/server';
import { limiters } from '@/lib/rate-limit/server';

// Rate limiter for export endpoint
const exportLimiter = limiters.export;

export async function GET(req: NextRequest) {
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimit = exportLimiter.check(clientIP);
    
    if (!rateLimit.allowed) {
        return new NextResponse('Rate limit exceeded. Please try again later.', { 
            status: 429,
            headers: {
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
            }
        });
    }

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check Admin/Management role? 
    // RLS will handle data access, but we might want to block the request earlier.

    const { data, error } = await supabase
        .from('v_journal_entries')
        .select('*')
        .order('transaction_date', { ascending: false });

    if (error) {
        return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
    }

    // Convert to CSV
    if (!data || data.length === 0) {
        return new NextResponse('No data found', { status: 404 });
    }

    const headers = [
        'Journal Entry ID',
        'Date',
        'Description',
        'Ref ID',
        'Source',
        'Line ID',
        'Account Code',
        'Account Name',
        'Type',
        'Amount',
        'Entry Type',
        'Line Description'
    ].join(',');

    const rows = data.map((row: any) => {
        return [
            row.journal_entry_id,
            row.transaction_date,
            `"${(row.entry_description || '').replace(/"/g, '""')}"`, // Escape quotes
            row.external_reference_id || '',
            row.source_name || '',
            row.line_id,
            row.account_code,
            `"${(row.account_name || '').replace(/"/g, '""')}"`,
            row.account_type,
            row.amount,
            row.entry_type,
            `"${(row.line_description || '').replace(/"/g, '""')}"`
        ].join(',');
    });

    const csvContent = [headers, ...rows].join('\n');

    return new NextResponse(csvContent, {
        status: 200,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="journal_entries_${new Date().toISOString().split('T')[0]}.csv"`,
        },
    });
}
