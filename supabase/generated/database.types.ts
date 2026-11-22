/* Auto-generated from isolated ContributorOps Staging project tckrlgsercznivfayffb after migrations 001–004.
 * Read-only schema reference; never add API keys or service-role credentials.
 * Regenerate from staging after any schema migration.
 */
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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      approval_requests: {
        Row: {
          action_type: string
          approved_at: string | null
          created_at: string
          executed_at: string | null
          id: string
          idempotency_key: string | null
          payload: Json
          status: string
          target_ref: string | null
          target_repo: string
          user_id: string
        }
        Insert: {
          action_type: string
          approved_at?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          idempotency_key?: string | null
          payload: Json
          status?: string
          target_ref?: string | null
          target_repo: string
          user_id: string
        }
        Update: {
          action_type?: string
          approved_at?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          idempotency_key?: string | null
          payload?: Json
          status?: string
          target_ref?: string | null
          target_repo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          stripe_event_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_plans: {
        Row: {
          created_at: string
          id: string
          issue_number: number
          issue_title: string | null
          plan_content: Json
          repo: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_number: number
          issue_title?: string | null
          plan_content?: Json
          repo: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_number?: number
          issue_title?: string | null
          plan_content?: Json
          repo?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_runs: {
        Row: {
          action_type: string
          approval_request_id: string | null
          executed_at: string
          github_result: Json | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          action_type: string
          approval_request_id?: string | null
          executed_at?: string
          github_result?: Json | null
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          action_type?: string
          approval_request_id?: string | null
          executed_at?: string
          github_result?: Json | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_runs_approval_request_id_fkey"
            columns: ["approval_request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_plans: {
        Row: {
          created_at: string
          date: string
          id: string
          issues: Json
          markdown: string | null
          mission: string | null
          plan_summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          issues?: Json
          markdown?: string | null
          mission?: string | null
          plan_summary?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          issues?: Json
          markdown?: string | null
          mission?: string | null
          plan_summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discovered_issues: {
        Row: {
          discovered_at: string
          github_issue_number: number
          github_repo: string
          id: string
          labels: string[] | null
          plan_generated: boolean
          score: Json | null
          title: string
          url: string
          user_id: string
        }
        Insert: {
          discovered_at?: string
          github_issue_number: number
          github_repo: string
          id?: string
          labels?: string[] | null
          plan_generated?: boolean
          score?: Json | null
          title: string
          url: string
          user_id: string
        }
        Update: {
          discovered_at?: string
          github_issue_number?: number
          github_repo?: string
          id?: string
          labels?: string[] | null
          plan_generated?: boolean
          score?: Json | null
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovered_issues_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      github_connections: {
        Row: {
          connected_at: string
          github_user_id: number | null
          github_username: string
          id: string
          is_active: boolean
          last_used_at: string | null
          scopes: string[] | null
          user_id: string
        }
        Insert: {
          connected_at?: string
          github_user_id?: number | null
          github_username: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          scopes?: string[] | null
          user_id: string
        }
        Update: {
          connected_at?: string
          github_user_id?: number | null
          github_username?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          scopes?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_accounts: {
        Row: {
          access_token_encrypted: string | null
          created_at: string
          id: string
          provider: string
          provider_user_id: string
          scopes: string[] | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          created_at?: string
          id?: string
          provider: string
          provider_user_id: string
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          created_at?: string
          id?: string
          provider?: string
          provider_user_id?: string
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_states: {
        Row: {
          browser_binding_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          requested_scope: string
          state_hash: string
          user_id: string
        }
        Insert: {
          browser_binding_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          requested_scope: string
          state_hash: string
          user_id: string
        }
        Update: {
          browser_binding_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          requested_scope?: string
          state_hash?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oauth_states_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          accepted_at: string | null
          id: string
          invited_at: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          invited_at?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          id?: string
          invited_at?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string | null
          plan: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id?: string | null
          plan?: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string | null
          plan?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_entries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          merged_at: string | null
          pr_url: string | null
          proof: Json | null
          repo: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          merged_at?: string | null
          pr_url?: string | null
          proof?: Json | null
          repo: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          merged_at?: string | null
          pr_url?: string | null
          proof?: Json | null
          repo?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      public_portfolio_profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string | null
          headline: string | null
          id: string
          is_visible: boolean
          slug: string
          summary: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id?: string
          is_visible?: boolean
          slug: string
          summary?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          headline?: string | null
          id?: string
          is_visible?: boolean
          slug?: string
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_portfolio_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_counters: {
        Row: {
          count: number
          id: string
          metric: string
          period: string
          user_id: string
        }
        Insert: {
          count?: number
          id?: string
          metric: string
          period: string
          user_id: string
        }
        Update: {
          count?: number
          id?: string
          metric?: string
          period?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_counters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scoped_state: {
        Row: {
          state_key: string
          updated_at: string
          user_id: string
          value: Json
        }
        Insert: {
          state_key: string
          updated_at?: string
          user_id: string
          value: Json
        }
        Update: {
          state_key?: string
          updated_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "user_scoped_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      waitlist_entries: {
        Row: {
          created_at: string
          email: string
          github_username: string | null
          id: string
          name: string | null
          plan_interest: string | null
          problem_statement: string | null
          source: string
          target_role: string | null
        }
        Insert: {
          created_at?: string
          email: string
          github_username?: string | null
          id?: string
          name?: string | null
          plan_interest?: string | null
          problem_statement?: string | null
          source?: string
          target_role?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          github_username?: string | null
          id?: string
          name?: string | null
          plan_interest?: string | null
          problem_statement?: string | null
          source?: string
          target_role?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          event_type: string
          id: string
          payload: Json
          processed: boolean
          processing_error: string | null
          received_at: string
          signature_verified: boolean
          source: string
        }
        Insert: {
          event_type: string
          id?: string
          payload: Json
          processed?: boolean
          processing_error?: string | null
          received_at?: string
          signature_verified?: boolean
          source: string
        }
        Update: {
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean
          processing_error?: string | null
          received_at?: string
          signature_verified?: boolean
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
