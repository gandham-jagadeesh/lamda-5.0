import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = 'development';
export const SLOT_GENERATION_DAYS = Number(process.env.SLOT_GENERATION_DAYS);
export const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS;
export const TEMPORAL_NAMESPACE = process.env.TEMPORAL_NAMESPACE || 'default'
export const TEMPORAL_ENABLED = process.env.TEMPORAL_ENABLED || 'false';
export const TEMPORAL_TASK_QUEUE = process.env.TEMPORAL_TASK_QUEUE || 'default-queue';
export const SMTP_PORT = process.env.SMTP_PORT || 1025;
export const SMTP_HOST = process.env.SMTP_HOST || 'localhost'
export const EMAIL_FROM = process.env.EMAIL_FROM || "gandhamphotos@gmail.com";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_REDIRECT_URL = process.env.REDIRECT_URL || '';
