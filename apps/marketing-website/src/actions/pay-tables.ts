"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CareerLevel {
    id: string;
    code: string;
    name: string;
    description: string;
    focus: string;
    anchor_salary: number;
    is_performance_based: boolean;
    sort_order: number;
    promotion_increase_pct: number;
    longevity_increase_pct: number;
    longevity_period_years: number;
}

export interface PayGradeClass {
    id: string;
    career_level_id: string;
    class_code: string;
    class_name: string;
    class_description: string;
    class_order: number;
    promotion_multiplier: number;
}

export interface PayGrade {
    id: string;
    career_level_id: string;
    class_id: string;
    years_of_service: number;
    grade_number: number;
    base_salary: number;
    target_bonus_pct: number | null;
    stretch_bonus_pct: number | null;
    home_run_bonus_pct: number | null;
    total_comp_min: number | null;
    total_comp_max: number | null;
    // Joined data
    class_code?: string;
    class_name?: string;
}

export interface PayTableData {
    careerLevel: CareerLevel;
    classes: PayGradeClass[];
    grades: PayGrade[];
}

/**
 * Fetches all career levels
 */
export async function getCareerLevels(): Promise<CareerLevel[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("career_levels")
        .select("*")
        .order("sort_order");

    if (error) {
        console.error("Error fetching career levels:", error);
        return [];
    }

    return data || [];
}

/**
 * Fetches pay grade classes for a career level
 */
export async function getPayGradeClasses(careerLevelId: string): Promise<PayGradeClass[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("pay_grade_classes")
        .select("*")
        .eq("career_level_id", careerLevelId)
        .order("class_order");

    if (error) {
        console.error("Error fetching pay grade classes:", error);
        return [];
    }

    return data || [];
}

/**
 * Fetches pay grades for a career level with class info
 */
export async function getPayGrades(careerLevelId: string): Promise<PayGrade[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("pay_grades")
        .select(`
      *,
      pay_grade_classes (
        class_code,
        class_name
      )
    `)
        .eq("career_level_id", careerLevelId)
        .order("years_of_service")
        .order("class_id");

    if (error) {
        console.error("Error fetching pay grades:", error);
        return [];
    }

    // Flatten the joined data
    return (data || []).map((pg: any) => ({
        ...pg,
        class_code: pg.pay_grade_classes?.class_code,
        class_name: pg.pay_grade_classes?.class_name,
        pay_grade_classes: undefined
    }));
}

/**
 * Fetches complete pay table data for a career level
 */
export async function getPayTableData(careerLevelCode: string): Promise<PayTableData | null> {
    const supabase = await createSupabaseServerClient();

    // Get career level
    const { data: levelData, error: levelError } = await supabase
        .from("career_levels")
        .select("*")
        .eq("code", careerLevelCode)
        .single();

    if (levelError || !levelData) {
        console.error("Error fetching career level:", levelError);
        return null;
    }

    // Get classes and grades in parallel
    const [classes, grades] = await Promise.all([
        getPayGradeClasses(levelData.id),
        getPayGrades(levelData.id)
    ]);

    return {
        careerLevel: levelData,
        classes,
        grades
    };
}

/**
 * Fetches all pay table data for all career levels
 */
export async function getAllPayTables(): Promise<PayTableData[]> {
    const levels = await getCareerLevels();

    const tables = await Promise.all(
        levels.map(async (level) => {
            const [classes, grades] = await Promise.all([
                getPayGradeClasses(level.id),
                getPayGrades(level.id)
            ]);

            return {
                careerLevel: level,
                classes,
                grades
            };
        })
    );

    return tables;
}

// ============================================
// UPDATE FUNCTIONS
// ============================================

export interface UpdateCareerLevelInput {
    anchor_salary?: number;
    description?: string;
    focus?: string;
    promotion_increase_pct?: number;
    longevity_increase_pct?: number;
    longevity_period_years?: number;
}

/**
 * Updates a career level's settings and recalculates all associated pay grades
 */
export async function updateCareerLevel(
    careerLevelId: string,
    updates: UpdateCareerLevelInput
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseAdminClient();

    // First, get the current career level data to fill in any missing values
    const { data: currentLevel, error: fetchError } = await supabase
        .from("career_levels")
        .select("anchor_salary, is_performance_based, promotion_increase_pct, longevity_increase_pct, longevity_period_years")
        .eq("id", careerLevelId)
        .single();

    if (fetchError || !currentLevel) {
        return { success: false, error: fetchError?.message || "Career level not found" };
    }

    // Update the career level
    const { error: updateError } = await supabase
        .from("career_levels")
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq("id", careerLevelId);

    if (updateError) {
        console.error("Error updating career level:", updateError);
        return { success: false, error: updateError.message };
    }

    // Check if any salary-affecting fields changed - if so, recalculate pay grades
    const needsRecalc = updates.anchor_salary !== undefined ||
        updates.promotion_increase_pct !== undefined ||
        updates.longevity_increase_pct !== undefined ||
        updates.longevity_period_years !== undefined;

    if (needsRecalc) {
        // Merge updates with current values - use NEW values if provided, else use current
        const config = {
            anchorSalary: updates.anchor_salary ?? currentLevel.anchor_salary,
            isExecutive: currentLevel.is_performance_based || false,
            promotionPct: updates.promotion_increase_pct ?? currentLevel.promotion_increase_pct ?? 10,
            longevityPct: updates.longevity_increase_pct ?? currentLevel.longevity_increase_pct ?? 3,
            longevityPeriod: updates.longevity_period_years ?? currentLevel.longevity_period_years ?? 2
        };

        const recalcResult = await recalculatePayGrades(careerLevelId, config);
        if (!recalcResult.success) {
            return recalcResult;
        }
    }

    revalidatePath("/dashboard/hr/pay-tables");
    revalidatePath("/dashboard/hr/pay-tables/manage");

    return { success: true };
}

interface RecalcConfig {
    anchorSalary: number;
    isExecutive: boolean;
    promotionPct: number;
    longevityPct: number;
    longevityPeriod: number;
}

/**
 * Recalculates all pay grades for a career level using provided config values
 * (avoids timing issues by not re-reading from DB)
 */
async function recalculatePayGrades(
    careerLevelId: string,
    config: RecalcConfig
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseAdminClient();

    const { anchorSalary, isExecutive, promotionPct, longevityPct, longevityPeriod } = config;

    // Get all classes for this level
    const { data: classes, error: classesError } = await supabase
        .from("pay_grade_classes")
        .select("id, class_order")
        .eq("career_level_id", careerLevelId)
        .order("class_order");

    if (classesError || !classes) {
        console.error("[recalculatePayGrades] Failed to fetch classes:", classesError);
        return { success: false, error: classesError?.message || "Failed to fetch classes" };
    }

    console.log(`[recalculatePayGrades] Found ${classes.length} classes for career level ${careerLevelId}`);
    console.log("[recalculatePayGrades] Config:", { anchorSalary, promotionPct, longevityPct, longevityPeriod, isExecutive });

    // For each class, recalculate the promotion multiplier and all pay grades
    for (const cls of classes) {
        // Calculate promotion multiplier: e.g., Class A = 1.0, Class B = 1.15, Class C = 1.3225 (for 15%)
        const promotionMultiplier = Math.pow(1 + (promotionPct / 100), cls.class_order - 1);

        console.log(`[recalculatePayGrades] Class ${cls.class_order}: multiplier = ${promotionMultiplier.toFixed(5)}`);

        // Update the class with new promotion multiplier
        const { error: classUpdateError, count: classCount } = await supabase
            .from("pay_grade_classes")
            .update({
                promotion_multiplier: promotionMultiplier,
                updated_at: new Date().toISOString()
            })
            .eq("id", cls.id);

        if (classUpdateError) {
            console.error(`[recalculatePayGrades] Error updating class ${cls.id}:`, classUpdateError);
        } else {
            console.log(`[recalculatePayGrades] Updated class ${cls.id}, count: ${classCount}`);
        }

        for (let year = 1; year <= 20; year++) {
            let finalBaseSalary: number;

            if (isExecutive) {
                // Executive level: no longevity, just anchor * promotion multiplier
                finalBaseSalary = Math.round(anchorSalary * promotionMultiplier * 100) / 100;
            } else {
                // Regular level: apply longevity increase
                // Longevity multiplier: e.g., at 3% every 2 years:
                // Years 1-2: 1.0, Years 3-4: 1.03, Years 5-6: 1.0609, etc.
                const longevityMultiplier = Math.pow(1 + (longevityPct / 100), Math.floor((year - 1) / longevityPeriod));
                finalBaseSalary = Math.round(anchorSalary * promotionMultiplier * longevityMultiplier * 100) / 100;
            }

            // Update the pay grade
            const { error, count } = await supabase
                .from("pay_grades")
                .update({
                    base_salary: finalBaseSalary,
                    updated_at: new Date().toISOString()
                })
                .eq("career_level_id", careerLevelId)
                .eq("class_id", cls.id)
                .eq("years_of_service", year);

            if (error) {
                console.error(`[recalculatePayGrades] Error updating pay grade (class ${cls.class_order}, year ${year}):`, error);
                return { success: false, error: error.message };
            }

            // Log first year of each class for debugging
            if (year === 1) {
                console.log(`[recalculatePayGrades] Updated pay grade: class ${cls.class_order}, year ${year}, salary $${finalBaseSalary}, rows affected: ${count}`);
            }
        }
    }

    return { success: true };
}

export interface UpdateExecutiveBonusInput {
    classId: string;
    target_bonus_pct: number;
    stretch_bonus_pct: number;
}

/**
 * Updates bonus percentages for Senior Lead Partner classes
 */
export async function updateExecutiveBonus(
    input: UpdateExecutiveBonusInput
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseAdminClient();

    // Get the class to find base salary
    const { data: grades } = await supabase
        .from("pay_grades")
        .select("id, base_salary")
        .eq("class_id", input.classId)
        .limit(1);

    if (!grades || grades.length === 0) {
        return { success: false, error: "No pay grades found for this class" };
    }

    const baseSalary = grades[0].base_salary;

    // Calculate new total comp values
    const totalCompMin = Math.round((baseSalary + (baseSalary * input.target_bonus_pct / 100)) * 100) / 100;
    const totalCompMax = Math.round((baseSalary + (baseSalary * input.target_bonus_pct / 100) + (baseSalary * input.stretch_bonus_pct / 100)) * 100) / 100;

    // Update all pay grades for this class
    const { error } = await supabase
        .from("pay_grades")
        .update({
            target_bonus_pct: input.target_bonus_pct,
            stretch_bonus_pct: input.stretch_bonus_pct,
            total_comp_min: totalCompMin,
            total_comp_max: totalCompMax,
            updated_at: new Date().toISOString()
        })
        .eq("class_id", input.classId);

    if (error) {
        console.error("Error updating executive bonus:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/hr/pay-tables");
    revalidatePath("/dashboard/hr/pay-tables/manage");

    return { success: true };
}

export interface UpdateExecutiveConfigInput {
    careerLevelId: string;
    baseVpSalary: number;
    promotionIncreasePct: number;
    targetBonusPct: number;
    stretchBonusPct: number;
    homeRunBonusPct: number;
}

/**
 * Updates all executive salaries based on base VP salary and promotion increase percentage.
 * Recalculates all class salaries using the promotion multiplier pattern.
 */
export async function updateExecutiveConfig(
    input: UpdateExecutiveConfigInput
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createSupabaseAdminClient();

    // Update career level with new anchor salary and promotion increase
    const { error: levelError } = await supabase
        .from("career_levels")
        .update({
            anchor_salary: input.baseVpSalary,
            promotion_increase_pct: input.promotionIncreasePct,
            updated_at: new Date().toISOString()
        })
        .eq("id", input.careerLevelId);

    if (levelError) {
        console.error("Error updating career level:", levelError);
        return { success: false, error: levelError.message };
    }

    // Get all classes for this level
    const { data: classes, error: classesError } = await supabase
        .from("pay_grade_classes")
        .select("id, class_order")
        .eq("career_level_id", input.careerLevelId)
        .order("class_order");

    if (classesError || !classes) {
        return { success: false, error: classesError?.message || "Failed to fetch classes" };
    }

    // Update each class with calculated salary
    for (const cls of classes) {
        // Class A = base, Class B = base * 1.10, Class C = base * 1.21, etc.
        const promotionMultiplier = Math.pow(1 + (input.promotionIncreasePct / 100), cls.class_order - 1);
        const classSalary = Math.round(input.baseVpSalary * promotionMultiplier * 100) / 100;

        // Calculate comp ranges
        const targetBonusAmount = classSalary * (input.targetBonusPct / 100);
        const stretchBonusAmount = classSalary * (input.stretchBonusPct / 100);
        const homeRunBonusAmount = classSalary * (input.homeRunBonusPct / 100);

        const totalCompMin = Math.round((classSalary + targetBonusAmount) * 100) / 100;
        const totalCompMax = Math.round((classSalary + targetBonusAmount + stretchBonusAmount + homeRunBonusAmount) * 100) / 100;

        // Update all pay grades for this class
        const { error: updateError } = await supabase
            .from("pay_grades")
            .update({
                base_salary: classSalary,
                target_bonus_pct: input.targetBonusPct,
                stretch_bonus_pct: input.stretchBonusPct,
                home_run_bonus_pct: input.homeRunBonusPct,
                total_comp_min: totalCompMin,
                total_comp_max: totalCompMax,
                updated_at: new Date().toISOString()
            })
            .eq("class_id", cls.id);

        if (updateError) {
            console.error("Error updating pay grades for class:", updateError);
            return { success: false, error: updateError.message };
        }

        // Update the promotion_multiplier in pay_grade_classes
        const { error: classUpdateError } = await supabase
            .from("pay_grade_classes")
            .update({
                promotion_multiplier: promotionMultiplier,
                updated_at: new Date().toISOString()
            })
            .eq("id", cls.id);

        if (classUpdateError) {
            console.error("Error updating class multiplier:", classUpdateError);
        }
    }

    revalidatePath("/dashboard/hr/pay-tables");
    revalidatePath("/dashboard/hr/pay-tables/manage");

    return { success: true };
}
