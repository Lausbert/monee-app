import "@/styles/globals.scss";
import { TranslationsProvider } from "@/context/TranslationsContext";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

let posthogInitialized = false;

export default function App({ Component, pageProps }) {
  // Extract translations from pageProps
  const { globalTranslations = {}, ...restPageProps } = pageProps;
  const router = useRouter();
  const leaveSentRef = useRef(false);

  // Initialize PostHog in the browser only
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Avoid initializing multiple times (Next.js Fast Refresh / HMR)
    if (posthogInitialized) return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

    if (!key) return; // Skip if not configured

    posthog.init(key, {
      api_host: host,
      cookieless_mode: 'always',
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      // Respect development mode by disabling autocapture
      autocapture: process.env.NODE_ENV === "production",
      capture_pageview: false, // we'll capture manually on route change
    });
    posthogInitialized = true;
  }, []);

  // Track page views on route change (including first load)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = () => {
      if (posthog?.capture) {
        posthog.capture("$pageview");
      }
      // reset flag for pageleave dedupe
      leaveSentRef.current = false;
    };

    // Initial page load
    handleRouteChange();

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Lightweight pageleave tracking to measure time-on-page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const capturePageLeave = () => {
      if (leaveSentRef.current) return;
      leaveSentRef.current = true;

      if (posthog?.capture) {
        const path = window.location?.pathname || "";
        posthog.capture("$pageleave", {
          path,
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        capturePageLeave();
      }
    };

    router.events.on("routeChangeStart", capturePageLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", capturePageLeave);

    return () => {
      router.events.off("routeChangeStart", capturePageLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", capturePageLeave);
    };
  }, [router.events]);
  
  // Wrap with TranslationsProvider for global access
  return (
    <PostHogProvider client={posthog}>
      <TranslationsProvider translations={globalTranslations}>
        <Component {...restPageProps} />
      </TranslationsProvider>
    </PostHogProvider>
  );
}
