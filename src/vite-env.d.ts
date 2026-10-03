/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL_API: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_SITE_URL?: string;
}

interface Window {
  dataLayer: Array<Record<string, unknown>>;
}
