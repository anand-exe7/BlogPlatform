import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url().or(z.string().startsWith('postgresql://')),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false'),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  EMAIL_HOST: z.string().default('smtp.gmail.com'),
  EMAIL_PORT: z.coerce.number().int().positive().default(587),
  EMAIL_USER: z.string().default(''),
  EMAIL_PASS: z.string().default(''),
  EMAIL_FROM: z.string().default('noreply@yourdomain.com'),
  EMAIL_DISABLE: z.enum(['true', 'false']).default('false'),
  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().min(8).default('Admin@123456'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  const errors = parsed.error.flatten().fieldErrors;
  for (const [key, msgs] of Object.entries(errors)) {
    console.error(`  ${key}: ${msgs?.join(', ')}`);
  }
  process.exit(1);
}

export const env = parsed.data;
