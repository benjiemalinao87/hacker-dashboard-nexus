export interface WorkspaceData {
  name: string;
  timezone: string;
  plan: string;
  bot_user_used: number;
  bot_user_limit: number;
  bot_used: number;
  bot_limit: number;
  member_used: number;
  member_limit: number;
  billing_start_at: string;
  billing_end_at: string;
}