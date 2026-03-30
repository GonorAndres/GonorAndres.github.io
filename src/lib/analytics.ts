import posthog from 'posthog-js';

let initialized = false;

const key = import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined;

if (key && typeof window !== 'undefined' && !/localhost|127\.0\.0\.1/.test(window.location.hostname)) {
  posthog.init(key, {
    api_host: 'https://us.i.posthog.com',
    autocapture: false,
    capture_pageview: true,
  });
  initialized = true;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(event, { site: window.location.hostname, ...props });
}
