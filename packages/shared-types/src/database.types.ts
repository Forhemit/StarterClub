export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          ai_category: string | null
          created_at: string | null
          description: string | null
          guest_data: Json | null
          id: string
          intent: string | null
          member_id: string | null
          payment_collected: number | null
          resource_duration_hours: number | null
          resource_used: string | null
          visit_type: string
        }
        Insert: {
          ai_category?: string | null
          created_at?: string | null
          description?: string | null
          guest_data?: Json | null
          id?: string
          intent?: string | null
          member_id?: string | null
          payment_collected?: number | null
          resource_duration_hours?: number | null
          resource_used?: string | null
          visit_type: string
        }
        Update: {
          ai_category?: string | null
          created_at?: string | null
          description?: string | null
          guest_data?: Json | null
          id?: string
          intent?: string | null
          member_id?: string | null
          payment_collected?: number | null
          resource_duration_hours?: number | null
          resource_used?: string | null
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          key_hash: string
          last_used_at: string | null
          name: string
          org_id: string | null
          scopes: string[] | null
          status: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          last_used_at?: string | null
          name: string
          org_id?: string | null
          scopes?: string[] | null
          status?: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          last_used_at?: string | null
          name?: string
          org_id?: string | null
          scopes?: string[] | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "partner_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          resource_id: string
          resource_type: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id: string
          resource_type: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string
          resource_type?: string
        }
        Relationships: []
      }
      calculator_presets: {
        Row: {
          defaults: Json | null
          id: string
          name: string
          track: string
          updated_at: string | null
        }
        Insert: {
          defaults?: Json | null
          id?: string
          name: string
          track: string
          updated_at?: string | null
        }
        Update: {
          defaults?: Json | null
          id?: string
          name?: string
          track?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calculator_runs: {
        Row: {
          created_at: string | null
          id: string
          inputs: Json
          org_id: string | null
          outputs: Json
          track: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inputs: Json
          org_id?: string | null
          outputs: Json
          track: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inputs?: Json
          org_id?: string | null
          outputs?: Json
          track?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculator_runs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "partner_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          created_at: string | null
          id: string
          intro: string | null
          member_type: string | null
          outcome: string | null
          partner_quote: string | null
          problem: string | null
          published: boolean | null
          timeline: string | null
          track: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          intro?: string | null
          member_type?: string | null
          outcome?: string | null
          partner_quote?: string | null
          problem?: string | null
          published?: boolean | null
          timeline?: string | null
          track: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          intro?: string | null
          member_type?: string | null
          outcome?: string | null
          partner_quote?: string | null
          problem?: string | null
          published?: boolean | null
          timeline?: string | null
          track?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      member_progress: {
        Row: {
          badges: string[] | null
          current_streak: number | null
          last_check_in: string | null
          level: number | null
          longest_streak: number | null
          member_id: string
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          badges?: string[] | null
          current_streak?: number | null
          last_check_in?: string | null
          level?: number | null
          longest_streak?: number | null
          member_id: string
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          badges?: string[] | null
          current_streak?: number | null
          last_check_in?: string | null
          level?: number | null
          longest_streak?: number | null
          member_id?: string
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_progress_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_inquiries: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string
          organization: string
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message: string
          organization: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string
          organization?: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_orgs: {
        Row: {
          category_tags: string[] | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category_tags?: string[] | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category_tags?: string[] | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      partner_submissions: {
        Row: {
          created_at: string | null
          id: string
          org_id: string | null
          payload: Json
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id?: string | null
          payload: Json
          status?: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string | null
          payload?: Json
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_submissions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "partner_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_users: {
        Row: {
          clerk_user_id: string
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          org_id: string | null
          role: string
        }
        Insert: {
          clerk_user_id: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          org_id?: string | null
          role: string
        }
        Update: {
          clerk_user_id?: string
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          org_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_users_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "partner_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_in_building: boolean | null
          last_name: string | null
          phone: string | null
          photo_url: string | null
          role: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_in_building?: boolean | null
          last_name?: string | null
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_in_building?: boolean | null
          last_name?: string | null
          phone?: string | null
          photo_url?: string | null
          role?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resource_assets: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          description: string | null
          doc_type: string | null
          file_size: string | null
          file_url: string
          id: string
          status: string | null
          tags: string[] | null
          title: string
          track: string
          type: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          doc_type?: string | null
          file_size?: string | null
          file_url: string
          id?: string
          status?: string | null
          tags?: string[] | null
          title: string
          track: string
          type: string
          updated_at?: string | null
          visibility: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          doc_type?: string | null
          file_size?: string | null
          file_url?: string
          id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          track?: string
          type?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_assets_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "partner_users"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_submissions: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          project_idea: string | null
          source: Database["public"]["Enums"]["submission_source"] | null
          status: Database["public"]["Enums"]["waitlist_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          project_idea?: string | null
          source?: Database["public"]["Enums"]["submission_source"] | null
          status?: Database["public"]["Enums"]["waitlist_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          project_idea?: string | null
          source?: Database["public"]["Enums"]["submission_source"] | null
          status?: Database["public"]["Enums"]["waitlist_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_jwt: { Args: never; Returns: Json }
      requesting_user_id: { Args: never; Returns: string }
    }
    Enums: {
      inquiry_status: "new" | "viewed" | "contacted" | "converted" | "rejected"
      submission_source: "main_form" | "modal_popup" | "other"
      waitlist_status:
        | "pending"
        | "approved"
        | "waitlisted"
        | "contacted"
        | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      inquiry_status: ["new", "viewed", "contacted", "converted", "rejected"],
      submission_source: ["main_form", "modal_popup", "other"],
      waitlist_status: [
        "pending",
        "approved",
        "waitlisted",
        "contacted",
        "archived",
      ],
    },
  },
} as const
