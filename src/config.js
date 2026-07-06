import path from 'node:path'
import { fileURLToPath } from 'node:url'

import 'dotenv/config';

const __dirname = fileURLToPath(import.meta.url)

// EXPORT CONFIG CONST

export const ROOT = path.dirname(__dirname)
export const PORT = Number(process.env.PORT) || 3005
export const SALT_ROUND = Number(process.env.SALT_ROUND) || 10

export const {
  HASH_USER_PASSWORD,
  JWT_SECRET
} = process.env 