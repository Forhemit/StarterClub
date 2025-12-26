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
      },
      user_businesses: {
        Row: {
          id: string
          user_id: string
          business_name: string
          primary_module_id: string | null
          legal_structure: string | null
          ein: string | null
          start_date: string | null
          address: string | null
          contact_info: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          primary_module_id?: string | null
          legal_structure?: string | null
          ein?: string | null
          start_date?: string | null
          address?: string | null
          contact_info?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          primary_module_id?: string | null
          legal_structure?: string | null
          ein?: string | null
          start_date?: string | null
          address?: string | null
          contact_info?: Json
          created_at?: string
          updated_at?: string
        }
      },
      modules: {
        Row: {
          id: string
          name: string
          description: string | null
          module_type: string
          parent_id: string | null
          version: string
          author_name: string
          tags: string[]
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          module_type?: string
          parent_id?: string | null
          version?: string
          author_name?: string
          tags?: string[]
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          module_type?: string
          parent_id?: string | null
          version?: string
          author_name?: string
          tags?: string[]
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      module_items: {
        Row: {
          id: string
          module_id: string
          item_id: string
          display_order: number
        }
        Insert: {
          id?: string
          module_id: string
          item_id: string
          display_order?: number
        }
        Update: {
          id?: string
          module_id?: string
          item_id?: string
          display_order?: number
        }
      },
      checklist_items: {
        Row: {
          id: string
          title: string
          description: string | null
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      },
      user_checklist_status: {
        Row: {
          id: string
          user_business_id: string
          item_id: string
          status_id: string | null
          completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_business_id: string
          item_id: string
          status_id?: string | null
          completed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_business_id?: string
          item_id?: string
          status_id?: string | null
          completed_at?: string | null
          notes?: string | null
        }
      },
      statuses: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      },
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      },
      clients: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          user_business_id: string
          created_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          user_business_id: string
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          user_business_id?: string
          created_at?: string
        }
      },
      audit_logs: {
        Row: {
          id: string
          actor_id: string
          action: string
          target_id: string
          target_type: string
          metadata: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id: string
          action: string
          target_id: string
          target_type: string
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string
          action?: string
          target_id?: string
          target_type?: string
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      },
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
      roles: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      },
      permissions: {
        Row: {
          id: string
          slug: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      },
      role_permissions: {
        Row: {
          role_id: string
          permission_id: string
        }
        Insert: {
          role_id: string
          permission_id: string
        }
        Update: {
          role_id?: string
          permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          }
        ]
      },
      user_roles: {
        Row: {
          user_id: string
          role_id: string
          created_at: string | null
        }
        Insert: {
          user_id: string
          role_id: string
          created_at?: string | null
        }
        Update: {
          user_id?: string
          role_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      },
      role_requests: {
        Row: {
          id: string
          user_id: string | null
          role_slug: string
          status: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          role_slug: string
          status?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          role_slug?: string
          status?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      },
    }
    Views: {
      marketplace_modules: {
        Row: {
          id: string
          name: string
          description: string | null
          module_type: string
          parent_id: string | null
          parent_name: string | null
          version: string
          author_name: string
          tags: string[]
          install_count: number
          is_premium: boolean
          price_monthly: number | null
          icon: string | null
          color: string | null
          avg_rating: number
          review_count: number
          business_count: number
          dependency_count: number
          created_at: string
          updated_at: string
        }
      }
    },
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
