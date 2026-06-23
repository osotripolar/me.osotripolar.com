import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(import.meta.url)

// EXPORTAMOS CONSTANTES DE LA CONFIGURACIÓN GENERAL

export const ROOT = path.dirname(__dirname)

export const {
  PORT = 3005
} = process.env