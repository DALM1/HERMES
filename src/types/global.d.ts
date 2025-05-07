interface ApiConfig {
  baseUrl: string;
  wsUrl: string;
}

declare global {
  interface Window {
    apiConfig: ApiConfig;
  }
}

export {};