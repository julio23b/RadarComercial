const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export type DashboardAnalyticsProperties = Record<string, unknown>;

export const dashboardAnalyticsConfig = {
  provider: 'posthog',
  enabled: Boolean(POSTHOG_KEY),
};

export const trackDashboardEvent = async (
  event: string,
  properties: DashboardAnalyticsProperties = {},
) => {
  const payload = {
    api_key: POSTHOG_KEY,
    event,
    properties: {
      ...properties,
      source: 'admin-dashboard',
      platform: 'web',
    },
  };

  if (!POSTHOG_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[analytics:${dashboardAnalyticsConfig.provider}]`, payload);
    }
    return;
  }

  await fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};
