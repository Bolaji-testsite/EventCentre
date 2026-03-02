export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: 'USER' | 'ADMIN';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          role?: 'USER' | 'ADMIN';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          role?: 'USER' | 'ADMIN';
          created_at?: string;
        };
      };
      booking_requests: {
        Row: {
          id: string;
          user_id: string | null;
          guest_name: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          start_date: string;
          end_date: string;
          event_type: string;
          attendees: number;
          notes: string | null;
          status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
          evidence_status: 'NONE' | 'SUBMITTED' | 'RECEIVED_EMAIL' | 'VERIFIED';
          booking_ref: string;
          created_at: string;
          updated_at: string;
          confirmed_at: string | null;
          confirmed_by: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          start_date: string;
          end_date: string;
          event_type: string;
          attendees?: number;
          notes?: string | null;
          status?: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
          evidence_status?: 'NONE' | 'SUBMITTED' | 'RECEIVED_EMAIL' | 'VERIFIED';
          booking_ref: string;
          created_at?: string;
          updated_at?: string;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          start_date?: string;
          end_date?: string;
          event_type?: string;
          attendees?: number;
          notes?: string | null;
          status?: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
          evidence_status?: 'NONE' | 'SUBMITTED' | 'RECEIVED_EMAIL' | 'VERIFIED';
          booking_ref?: string;
          created_at?: string;
          updated_at?: string;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
        };
      };
      payment_evidence: {
        Row: {
          id: string;
          booking_request_id: string;
          type: 'UPLOAD' | 'EMAIL';
          file_url: string | null;
          storage_key: string | null;
          original_filename: string | null;
          uploaded_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          booking_request_id: string;
          type: 'UPLOAD' | 'EMAIL';
          file_url?: string | null;
          storage_key?: string | null;
          original_filename?: string | null;
          uploaded_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          booking_request_id?: string;
          type?: 'UPLOAD' | 'EMAIL';
          file_url?: string | null;
          storage_key?: string | null;
          original_filename?: string | null;
          uploaded_at?: string;
          notes?: string | null;
        };
      };
      date_locks: {
        Row: {
          date: string;
          confirmed_booking_request_id: string;
          created_at: string;
        };
        Insert: {
          date: string;
          confirmed_booking_request_id: string;
          created_at?: string;
        };
        Update: {
          date?: string;
          confirmed_booking_request_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_date_available: {
        Args: { check_date: string };
        Returns: boolean;
      };
      get_date_interest_count: {
        Args: { check_date: string };
        Returns: number;
      };
      generate_booking_ref: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
