"use server";

import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export type LegalDocument = {
    id: string;
    entity_id: string;
    document_type: string;
    file_path: string;
    upload_date: string;
    display_name?: string;
    expiration_date?: string;
    metadata?: any;
};

async function logDocumentAction(entityId: string, documentId: string | null, action: 'UPLOAD' | 'UPDATE' | 'DELETE', details: any) {
    const supabase = await createSupabaseAdminClient();
    await supabase.from('document_audit_logs').insert({
        entity_id: entityId,
        document_id: documentId,
        action,
        details,
        performed_by: 'system' // In real app, fetch user ID
    });
}

export async function uploadLegalDocument(formData: FormData) {
    const file = formData.get('file') as File;
    const entityId = formData.get('entityId') as string;
    const documentType = formData.get('documentType') as string;
    const displayName = formData.get('displayName') as string || file.name;
    const expirationDate = formData.get('expirationDate') as string || null;

    if (!file || !entityId || !documentType) {
        throw new Error("Missing required fields");
    }

    const supabase = await createSupabaseAdminClient();

    // Create clean path
    const sanitizedType = documentType.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = `${entityId}/${sanitizedType}/${Date.now()}_${file.name}`;

    // Upload with Admin Client (bypassing RLS/UUID owner checks)
    const { error: uploadError } = await supabase.storage
        .from('legal-documents')
        .upload(filePath, file, {
            upsert: true,
            contentType: file.type
        });

    if (uploadError) throw new Error(uploadError.message);

    // Save reference
    const docId = await saveDocumentReference(entityId, documentType, filePath, displayName, expirationDate);

    await logDocumentAction(entityId, docId, 'UPLOAD', { fileName: file.name, type: documentType });

    return { success: true, filePath };
}

export async function deleteLegalDocument(documentId: string, filePath: string, entityId: string) {
    const supabase = await createSupabaseAdminClient();

    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
        .from('legal-documents')
        .remove([filePath]);

    if (storageError) console.error("Storage delete failed", storageError);

    // 2. Delete from DB
    const { error: dbError } = await supabase
        .from('legal_documents')
        .delete()
        .eq('id', documentId);

    if (dbError) throw new Error(dbError.message);

    // 3. Log
    await logDocumentAction(entityId, documentId, 'DELETE', { filePath });
}

export async function saveDocumentReference(entityId: string, docType: string, filePath: string, displayName?: string, expirationDate?: string | null) {
    const supabase = await createSupabaseServerClient();

    // Check if exists to update or insert
    const { data: existing } = await supabase
        .from('legal_documents')
        .select('id')
        .eq('entity_id', entityId)
        .eq('document_type', docType)
        .single();

    if (existing) {
        const { error } = await supabase
            .from('legal_documents')
            .update({
                file_path: filePath,
                upload_date: new Date().toISOString(),
                display_name: displayName,
                expiration_date: expirationDate
            })
            .eq('id', existing.id);
        if (error) throw new Error(error.message);
        return existing.id;
    } else {
        const { data, error } = await supabase
            .from('legal_documents')
            .insert({
                entity_id: entityId,
                document_type: docType,
                file_path: filePath,
                display_name: displayName,
                expiration_date: expirationDate
            })
            .select('id')
            .single();
        if (error) throw new Error(error.message);
        return data.id;
    }
}

export async function getEntityDocuments(entityId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('entity_id', entityId);

    if (error) throw new Error(error.message);
    return data as LegalDocument[];
}

export async function getDocumentUrl(filePath: string) {
    const supabase = await createSupabaseServerClient();
    // Create signed URL since bucket is private
    const { data, error } = await supabase
        .storage
        .from('legal-documents')
        .createSignedUrl(filePath, 60 * 60); // 1 hour

    if (error) throw new Error(error.message);
    return data.signedUrl;
}
