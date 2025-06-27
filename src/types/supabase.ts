export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          contract_address: string | null
          created_at: string | null
          created_by: string | null
          deploy_status: string | null
          description: string | null
          id: string
          max_supply: number | null
          mint_price: number | null
          name: string
          partner_id: string | null
          price: number | null
        }
        Insert: {
          contract_address?: string | null
          created_at?: string | null
          created_by?: string | null
          deploy_status?: string | null
          description?: string | null
          id?: string
          max_supply?: number | null
          mint_price?: number | null
          name: string
          partner_id?: string | null
          price?: number | null
        }
        Update: {
          contract_address?: string | null
          created_at?: string | null
          created_by?: string | null
          deploy_status?: string | null
          description?: string | null
          id?: string
          max_supply?: number | null
          mint_price?: number | null
          name?: string
          partner_id?: string | null
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_logs: {
        Row: {
          campaign_name: string | null
          contract_address: string | null
          created_at: string | null
          created_by: string | null
          deploy_status: string | null
          id: string
          log_message: string | null
        }
        Insert: {
          campaign_name?: string | null
          contract_address?: string | null
          created_at?: string | null
          created_by?: string | null
          deploy_status?: string | null
          id?: string
          log_message?: string | null
        }
        Update: {
          campaign_name?: string | null
          contract_address?: string | null
          created_at?: string | null
          created_by?: string | null
          deploy_status?: string | null
          id?: string
          log_message?: string | null
        }
        Relationships: []
      }
      mints: {
        Row: {
          campaign_id: string | null
          created_by: string | null
          id: string
          metadata_uri: string | null
          minted_at: string | null
          token_id: number | null
          tx_hash: string | null
          wallet_address: string
        }
        Insert: {
          campaign_id?: string | null
          created_by?: string | null
          id?: string
          metadata_uri?: string | null
          minted_at?: string | null
          token_id?: number | null
          tx_hash?: string | null
          wallet_address: string
        }
        Update: {
          campaign_id?: string | null
          created_by?: string | null
          id?: string
          metadata_uri?: string | null
          minted_at?: string | null
          token_id?: number | null
          tx_hash?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "mints_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ticket_types: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          max_supply: number | null
          metadata_uri: string | null
          price: number | null
          type_name: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          max_supply?: number | null
          metadata_uri?: string | null
          price?: number | null
          type_name?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          max_supply?: number | null
          metadata_uri?: string | null
          price?: number | null
          type_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role: string | null
          user_id: string
        }
        Insert: {
          role?: string | null
          user_id: string
        }
        Update: {
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: string
          role: string | null
          wallet_address: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          role?: string | null
          wallet_address?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          role?: string | null
          wallet_address?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
