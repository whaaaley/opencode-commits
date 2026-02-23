import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DEFAULT_MAX_LENGTH, DEFAULT_TYPES, getAllScopes, loadConfig } from './config.ts'

describe('loadConfig', () => {
  let dir: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'opencode-commits-test-'))
  })

  afterEach(async () => {
    await rm(dir, { recursive: true })
  })

  it('should return defaults when no config file exists', async () => {
    const config = await loadConfig(dir)

    expect(config.types).toEqual([...DEFAULT_TYPES])
    expect(config.maxLength).toBe(DEFAULT_MAX_LENGTH)
    expect(config.scopes).toBeUndefined()
  })

  it('should return defaults when config file is invalid JSON', async () => {
    await writeFile(join(dir, 'opencode-conventional-commits.json'), 'not json')
    const config = await loadConfig(dir)

    expect(config.types).toEqual([...DEFAULT_TYPES])
    expect(config.maxLength).toBe(DEFAULT_MAX_LENGTH)
  })

  it('should return defaults when config has invalid schema', async () => {
    await writeFile(join(dir, 'opencode-conventional-commits.json'), JSON.stringify({ types: 123 }))
    const config = await loadConfig(dir)

    expect(config.types).toEqual([...DEFAULT_TYPES])
    expect(config.maxLength).toBe(DEFAULT_MAX_LENGTH)
  })

  it('should merge custom types with defaults for other fields', async () => {
    const custom = { types: ['add', 'remove'] }
    await writeFile(join(dir, 'opencode-conventional-commits.json'), JSON.stringify(custom))
    const config = await loadConfig(dir)

    expect(config.types).toEqual(['add', 'remove'])
    expect(config.maxLength).toBe(DEFAULT_MAX_LENGTH)
    expect(config.scopes).toBeUndefined()
  })

  it('should merge custom maxLength with defaults for other fields', async () => {
    const custom = { maxLength: 100 }
    await writeFile(join(dir, 'opencode-conventional-commits.json'), JSON.stringify(custom))
    const config = await loadConfig(dir)

    expect(config.types).toEqual([...DEFAULT_TYPES])
    expect(config.maxLength).toBe(100)
  })

  it('should load scopes from config', async () => {
    const custom = {
      scopes: {
        feat: ['api', 'ui'],
        fix: ['core'],
      },
    }

    await writeFile(join(dir, 'opencode-conventional-commits.json'), JSON.stringify(custom))
    const config = await loadConfig(dir)

    expect(config.scopes).toEqual({ feat: ['api', 'ui'], fix: ['core'] })
  })

  it('should load a fully specified config', async () => {
    const custom = {
      types: ['add', 'remove'],
      scopes: { add: ['api'] },
      maxLength: 50,
    }

    await writeFile(join(dir, 'opencode-conventional-commits.json'), JSON.stringify(custom))
    const config = await loadConfig(dir)

    expect(config.types).toEqual(['add', 'remove'])
    expect(config.scopes).toEqual({ add: ['api'] })
    expect(config.maxLength).toBe(50)
  })

  it('should ignore unknown fields in config', async () => {
    const custom = { types: ['feat'], unknownField: true }
    await writeFile(join(dir, 'opencode-conventional-commits.json'), JSON.stringify(custom))
    const config = await loadConfig(dir)

    expect(config.types).toEqual(['feat'])
  })

  it('should return a fresh types array (not shared reference)', async () => {
    const config1 = await loadConfig(dir)
    const config2 = await loadConfig(dir)

    expect(config1.types).not.toBe(config2.types)
    expect(config1.types).toEqual(config2.types)
  })
})

describe('getAllScopes', () => {
  it('should return undefined when no scopes configured', () => {
    const result = getAllScopes({ types: ['feat'], maxLength: 72 })

    expect(result).toBeUndefined()
  })

  it('should flatten all scope values into a single array', () => {
    const result = getAllScopes({
      types: ['feat'],
      maxLength: 72,
      scopes: {
        feat: ['api', 'ui'],
        fix: ['core', 'db'],
      },
    })

    expect(result).toEqual(['api', 'ui', 'core', 'db'])
  })

  it('should return empty array when scopes object has no entries', () => {
    const result = getAllScopes({
      types: ['feat'],
      maxLength: 72,
      scopes: {},
    })

    expect(result).toEqual([])
  })

  it('should handle scopes with empty arrays', () => {
    const result = getAllScopes({
      types: ['feat'],
      maxLength: 72,
      scopes: { feat: [], fix: ['core'] },
    })

    expect(result).toEqual(['core'])
  })
})
