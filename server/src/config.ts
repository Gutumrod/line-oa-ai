export interface AppConfig {
  channelAccessToken: string;
  channelSecret: string;
  port: number;
}

export function loadConfigFromEnv(): AppConfig {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelAccessToken) {
    throw new Error('Missing required environment variable LINE_CHANNEL_ACCESS_TOKEN');
  }

  if (!channelSecret) {
    throw new Error('Missing required environment variable LINE_CHANNEL_SECRET');
  }

  return {
    channelAccessToken,
    channelSecret,
    port: Number(process.env.PORT || 3002),
  };
}
