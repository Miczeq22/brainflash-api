declare namespace NodeJS {
  interface ProcessEnv {
    // API envs
    NODE_ENV: 'development' | 'production' | 'test';
    PROTOCOL: 'http' | 'https';
    HOST: string;
    PORT: number;
    LOGGING_LEVEL: 'error' | 'warn' | 'info' | 'verbose' | 'debug';
    CORS_WHITE_LIST: string;

    // Postgres Database envs
    POSTGRES_MIGRATION_PATH: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTRGRES_HOSTNAME: string;

    // Mailer envs
    MAILHOG_CLIENT_PORT: number;
    SMTP_PORT: number;
    MAILHOG_HOST: string;
    SERVICE_MAIL: string;
    VERIFICATION_TOKEN_SECRET: string;
    ADMIN_EMAIL: string;
  }
}
