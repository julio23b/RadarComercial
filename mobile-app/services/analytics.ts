const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
const DEFAULT_USER_ID = process.env.EXPO_PUBLIC_ANALYTICS_USER_ID || undefined;

let analyticsUserId = DEFAULT_USER_ID;

export type AnalyticsProperties = Record<string, unknown>;

export const analyticsConfig = {
  provider: 'posthog',
  enabled: Boolean(POSTHOG_KEY),
};

export const setAnalyticsUserId = (userId?: string) => {
  analyticsUserId = userId;
};

export const getAnalyticsUserId = () => analyticsUserId;

export const trackEvent = async (event: string, properties: AnalyticsProperties = {}) => {
  const payload = {
    api_key: POSTHOG_KEY,
    event,
    properties: {
      ...properties,
      user_id: properties.user_id || analyticsUserId,
      source: 'mobile-app',
      platform: 'react-native',
    },
  };

  if (!POSTHOG_KEY) {
    if (__DEV__) {
      console.info(`[analytics:${analyticsConfig.provider}]`, payload);
    }
    return;
  }

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('Analytics capture failed', error);
    }
  }
};
