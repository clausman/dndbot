// See: https://api.slack.com/slash-commands#app_command_handling
export interface SlashCommand {
  token: string;
  team_id?: string;
  team_domain?: string;
  enterprise_id?: string;
  enterprise_name?: string;
  channel_id?: string;
  channel_name?: string;
  user_id: string;
  user_name: string;
  command: string;
  text?: string;
  response_url: string;
  trigger_id: string;
}


export function isSlashCommand(obj: any): obj is SlashCommand {
  return !!(obj.token && obj.command)
}

export function isValidToken(token: string, expectedToken: string): boolean {
  return expectedToken && token === expectedToken;
}