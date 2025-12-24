import { createAdminClient } from "@/lib/privileged/supabase-admin";
import { logger } from "@/lib/logger";

export type AuditAction =
    | "USER_INVITE"
    | "USER_DELETE"
    | "USER_UPDATE"
    | "ORG_CREATE"
    | "ORG_UPDATE"
    | "ORG_DELETE"
    | "KIOSK_UNLOCK"
    | "MODULE_CREATE"
    | "MODULE_UPDATE"
    | "MODULE_DELETE"
    | "ITEM_CREATE"
    | "MODULE_ADD_ITEM"
    | "MODULE_REMOVE_ITEM";

export async function logAdminAction(
    actorId: string,
    action: AuditAction,
    targetId: string,
    targetType: "USER" | "ORG" | "SYSTEM" | "MODULE" | "CHECKLIST_ITEM" | "MODULE_ITEM",
    metadata: Record<string, any> = {}
) {
    const supabase = createAdminClient() as any;

    try {
        const { error } = await supabase.from("audit_logs").insert({
            actor_id: actorId,
            action,
            target_id: targetId,
            target_type: targetType,
            metadata
        });

        if (error) {
            logger.error({
                msg: "AUDIT LOG FAILURE",
                error: error.message,
                payload: { actorId, action, targetId }
            });
            // In a strict environment, we might throw here to abort the transaction.
            // For now, we log the failure to the logger.
        }
    } catch (e: any) {
        logger.error({
            msg: "AUDIT LOG EXCEPTION",
            error: e.message
        });
    }
}
