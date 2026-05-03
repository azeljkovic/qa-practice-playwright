// Load local development variables from `.env` when the file exists.
// In CI, secrets are typically injected directly into process.env instead.
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import path from 'node:path';

const envFilePath = path.resolve(__dirname, '.env');

if (existsSync(envFilePath)) {
  loadEnvFile(envFilePath);
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  email: required('TEST_EMAIL'),
  password: required('TEST_PASSWORD'),
};
