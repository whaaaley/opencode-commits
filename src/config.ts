import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { z } from 'zod/v4'
import { safeAsync } from './utils/safe.ts'

export const DEFAULT_TYPES = [
  'feat',
  'fix',
  'build',
  'chore',
  'ci',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'revert',
] as const

export const DEFAULT_MAX_LENGTH = 72

const rawConfigSchema = z.object({
  types: z.array(z.string()).optional(),
  scopes: z.record(z.string(), z.array(z.string())).optional(),
  maxLength: z.number().optional(),
})

export interface CommitsConfig {
  types: string[]
  scopes?: Record<string, string[]>
  maxLength: number
}

export const loadConfig = async (directory: string): Promise<CommitsConfig> => {
  const configPath = join(directory, 'opencode-commits.json')

  const result = await safeAsync(async () => {
    const raw = await readFile(configPath, 'utf-8')
    return rawConfigSchema.parse(JSON.parse(raw))
  })

  if (result.error) {
    return {
      types: [...DEFAULT_TYPES],
      maxLength: DEFAULT_MAX_LENGTH,
    }
  }

  return {
    types: result.data.types ?? [...DEFAULT_TYPES],
    scopes: result.data.scopes,
    maxLength: result.data.maxLength ?? DEFAULT_MAX_LENGTH,
  }
}

export const getAllScopes = (config: CommitsConfig): string[] | undefined => {
  if (!config.scopes) {
    return undefined
  }

  return Object.values(config.scopes).flat()
}
