declare namespace NodeJS {
  interface ProcessEnv {
    // API envs
    NODE_ENV: 'development' | 'production' | 'test';
    PROTOCOL: 'http' | 'https';
    HOST: string;
    PORT: number;
    LOGGING_LEVEL: 'error' | 'warn' | 'info' | 'verbose' | 'debug';
    CORS_WHITE_LIST: string;
    JWT_TOKEN: string;
    FRONTEND_URL: string;

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

    // Storage
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_ENDPOINT: string;
    S3_BUCKET: string;

    // Mongo_db

    MONGO_PORT: number;
    MONGO_HOST: string;
    MONGO_DB: string;

    // Redis

    REDIS_PORT: number;
  }
}
