declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PROTOCOL: 'http' | 'https';
    HOST: string;
    PORT: number;
    LOGGING_LEVEL: 'error' | 'warn' | 'info' | 'verbose' | 'debug';
    CORS_WHITE_LIST: string;
  }
}
