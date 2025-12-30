"use client";

import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js"; // mocking for now

export function useSupabaseHR(table: string) {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch
        setTimeout(() => {
            setData([
                {
                    id: "1",
                    candidate_name: "Alice Johnson",
                    position: "Frontend Dev",
                    interview_date: "2024-03-15",
                    score: 85,
                    status: "decision_pending",
                    interviewers: ["Bob", "Charlie"],
                    feedback: ["Great coding skills", "Good culture fit"]
                },
                {
                    id: "2",
                    candidate_name: "David Smith",
                    position: "Product Manager",
                    interview_date: "2024-03-16",
                    score: 92,
                    status: "hired",
                    interviewers: ["Eve"],
                    feedback: ["Excellent communication"]
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, [table]);

    return { data, isLoading };
}
