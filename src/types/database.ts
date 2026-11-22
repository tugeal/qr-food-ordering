// Mirrors the migrations. Regenerate with `pnpm db:types` after changing the database.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      menu_items: {
        Row: {
          category_id: string;
          created_at: string;
          description: string;
          emoji: string;
          id: string;
          image_url: string | null;
          is_available: boolean;
          name: string;
          price: number;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          description?: string;
          emoji?: string;
          id?: string;
          image_url?: string | null;
          is_available?: boolean;
          name: string;
          price: number;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          description?: string;
          emoji?: string;
          id?: string;
          image_url?: string | null;
          is_available?: boolean;
          name?: string;
          price?: number;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          item_name: string;
          line_total: number;
          menu_item_id: string | null;
          order_id: string;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: string;
          item_name: string;
          line_total: number;
          menu_item_id?: string | null;
          order_id: string;
          quantity: number;
          unit_price: number;
        };
        Update: {
          id?: string;
          item_name?: string;
          line_total?: number;
          menu_item_id?: string | null;
          order_id?: string;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          contact_number: string;
          created_at: string;
          customer_name: string;
          id: string;
          instructions: string | null;
          order_number: number;
          order_type: Database["public"]["Enums"]["order_type"];
          status: Database["public"]["Enums"]["order_status"];
          subtotal: number;
          table_number: string | null;
          total: number;
          updated_at: string;
        };
        Insert: {
          contact_number: string;
          created_at?: string;
          customer_name: string;
          id?: string;
          instructions?: string | null;
          order_number?: never;
          order_type: Database["public"]["Enums"]["order_type"];
          status?: Database["public"]["Enums"]["order_status"];
          subtotal: number;
          table_number?: string | null;
          total: number;
          updated_at?: string;
        };
        Update: {
          contact_number?: string;
          created_at?: string;
          customer_name?: string;
          id?: string;
          instructions?: string | null;
          order_number?: never;
          order_type?: Database["public"]["Enums"]["order_type"];
          status?: Database["public"]["Enums"]["order_status"];
          subtotal?: number;
          table_number?: string | null;
          total?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: { key: string; updated_at: string; value: string };
        Insert: { key: string; updated_at?: string; value?: string };
        Update: { key?: string; updated_at?: string; value?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      create_order: {
        Args: {
          p_contact_number: string;
          p_customer_name: string;
          p_instructions: string;
          p_items: Json;
          p_order_type: Database["public"]["Enums"]["order_type"];
          p_table_number: string;
        };
        Returns: { new_order_id: string; new_order_number: number }[];
      };
      parse_order_items: {
        Args: { p_items: Json };
        Returns: { menu_item_id: string; quantity: number }[];
      };
    };
    Enums: {
      order_status: "pending" | "confirmed" | "preparing" | "completed" | "cancelled";
      order_type: "dine_in" | "takeout";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
