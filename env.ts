// Instead of dotenv, we can use the built-in loadEnvFile function from Node.js (v24+)
// to load environment variables from a .env file without an additional dependency
import { loadEnvFile } from 'node:process';
import path from 'node:path';

loadEnvFile(path.resolve(__dirname, '.env'));

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
