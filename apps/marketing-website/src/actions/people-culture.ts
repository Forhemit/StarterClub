'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface EmployeeFilter {
    status?: string[];
    department?: string[];
    search?: string;
    minTenure?: number;
}

export async function getEmployees(filters?: EmployeeFilter) {
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from('employees')
        .select(`
      id,
      clerk_user_id,
      internal_employee_id,
      status,
      current_title,
      current_department_id,
      current_work_location,
      hire_date,
      engagement_score,
      tenure_days,
      profiles:clerk_user_id (
        first_name, 
        last_name, 
        email, 
        image_url
      ),
      departments:current_department_id (
        department_name
      )
    `);

    if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching employees:', error);
        return [];
    }

    let employees = data.map((emp: any) => ({
        id: emp.id,
        first_name: emp.profiles?.first_name || 'Unknown',
        last_name: emp.profiles?.last_name || 'User',
        email: emp.profiles?.email || '',
        avatar_url: emp.profiles?.image_url,
        title: emp.current_title || 'No Title',
        department: emp.departments?.department_name || 'Unassigned',
        status: emp.status || 'inactive',
        location: emp.current_work_location,
        hire_date: emp.hire_date,
        engagement_score: emp.engagement_score,
        tenure_days: emp.tenure_days
    }));

    // Client-side filtering for joined fields (temporary simplification)
    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        employees = employees.filter((e: any) =>
            e.first_name.toLowerCase().includes(searchLower) ||
            e.last_name.toLowerCase().includes(searchLower) ||
            e.email.toLowerCase().includes(searchLower) ||
            e.title.toLowerCase().includes(searchLower)
        );
    }

    if (filters?.department && filters.department.length > 0) {
        employees = employees.filter((e: any) => filters.department?.includes(e.department));
    }

    return employees;
}

export async function getPeopleStats() {
    const supabase = await createSupabaseServerClient();

    // Total Employees
    const { count: total } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });

    // Active
    const { count: active } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    // On Leave
    const { count: onLeave } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'on_leave');

    // Risk (Low engagement < 50)
    const { count: risk } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .lt('engagement_score', 50)
        .eq('status', 'active');

    return {
        total: total || 0,
        active: active || 0,
        onLeave: onLeave || 0,
        turnoverRisk: risk || 0
    };
}

export async function getDepartments() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('departments').select('id, department_name');
    if (error) return [];
    return data;
}

export async function createEmployee(data: any) {
    const supabase = await createSupabaseServerClient();

    // Generate a placeholder ID since we don't have a real Clerk ID yet.
    // In production, this should integrate with Clerk API to invite the user.
    const tempId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 1. Create Profile
    const { error: profileError } = await supabase.from('profiles').insert({
        id: tempId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        // role: 'employee' // assuming role column exists or handled by RLS/Trigger
    });

    // Note: If profile creation fails due to missing column 'role' or similar, we might need to adjust.
    // Assuming profiles has basic fields.

    if (profileError) {
        console.error("Profile creation failed", profileError);
        return { success: false, error: profileError.message };
    }

    // 2. Create Employee
    const { error: empError } = await supabase.from('employees').insert({
        clerk_user_id: tempId,
        internal_employee_id: `EMP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        status: 'active', // The new column we added
        current_title: data.jobTitle,
        current_department_id: data.departmentId,
        hire_date: data.startDate,
        engagement_score: 100, // Start high!
        tenure_days: 0,
        current_work_location: 'Headquarters' // Default
    });

    if (empError) {
        console.error("Employee creation failed", empError);
        return { success: false, error: empError.message };
    }

    return { success: true };
}

export async function getEmployeeDetails(id: string) {
    const supabase = await createSupabaseServerClient();

    const { data: emp, error } = await supabase
        .from('employees')
        .select(`
            *,
            profiles:clerk_user_id (
                first_name, 
                last_name, 
                email, 
                image_url
            ),
            departments:current_department_id (
                department_name
            ),
            employee_lifecycle_events (*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching employee details", error);
        return null;
    }

    return {
        ...emp,
        first_name: emp.profiles?.first_name || 'Unknown',
        last_name: emp.profiles?.last_name || 'User',
        email: emp.profiles?.email || '',
        avatar_url: emp.profiles?.image_url,
        department: emp.departments?.department_name || 'Unassigned',
        events: emp.employee_lifecycle_events || []
    };
}

export async function updateEmployeeStatus(id: string, status: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('employees').update({ status }).eq('id', id);
    if (error) return { success: false, error: error.message };
    try {
        revalidatePath('/dashboard/hr/people-culture');
        revalidatePath(`/dashboard/hr/people-culture/employee/${id}`);
    } catch (e) {
        // ignore if outside request context
    }
    return { success: true };
}
