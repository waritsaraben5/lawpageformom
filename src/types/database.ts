export type ArticleCategory = "legal" | "health";

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
      content_blocks: {
        Row: {
          id: string;
          page_key: string;
          section_key: string;
          content_text: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_key: string;
          section_key: string;
          content_text: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_key?: string;
          section_key?: string;
          content_text?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string;
          category: ArticleCategory;
          summary: string;
          body: string;
          image_url: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: ArticleCategory;
          summary: string;
          body: string;
          image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: ArticleCategory;
          summary?: string;
          body?: string;
          image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      member_feedback: {
        Row: {
          id: string;
          member_name: string | null;
          contact_info: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_name?: string | null;
          contact_info?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_name?: string | null;
          contact_info?: string | null;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type ContentBlock = Database["public"]["Tables"]["content_blocks"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type MemberFeedback =
  Database["public"]["Tables"]["member_feedback"]["Row"];
