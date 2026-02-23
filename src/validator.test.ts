import { describe, expect, it } from 'bun:test'
import type { CommitsConfig } from './config.ts'
import { DEFAULT_MAX_LENGTH, DEFAULT_TYPES } from './config.ts'
import { ParseError } from './parser.ts'
import { validateCommitMessage } from './validator.ts'

const defaultConfig: CommitsConfig = {
  types: [...DEFAULT_TYPES],
  maxLength: DEFAULT_MAX_LENGTH,
}

const scopedConfig: CommitsConfig = {
  types: [...DEFAULT_TYPES],
  maxLength: DEFAULT_MAX_LENGTH,
  scopes: {
    app: ['portal', 'dashboard'],
    layer: ['client', 'server', 'api'],
    infra: ['ci', 'build', 'docker'],
  },
}

describe('validateCommitMessage', () => {
  describe('valid messages', () => {
    it('all default types accepted', () => {
      for (const type of DEFAULT_TYPES) {
        expect(() => validateCommitMessage(`${type}: do something`, defaultConfig)).not.toThrow()
      }
    })

    it('message with valid scope', () => {
      expect(() => validateCommitMessage('feat(portal): add feature', scopedConfig)).not.toThrow()
    })

    it('all scope categories accepted', () => {
      expect(() => validateCommitMessage('feat(portal): add feature', scopedConfig)).not.toThrow()
      expect(() => validateCommitMessage('fix(api): fix endpoint', scopedConfig)).not.toThrow()
      expect(() => validateCommitMessage('ci(docker): update image', scopedConfig)).not.toThrow()
    })

    it('message at max length', () => {
      const msg = 'feat: ' + 'a'.repeat(DEFAULT_MAX_LENGTH - 6)
      expect(() => validateCommitMessage(msg, defaultConfig)).not.toThrow()
    })

    it('scope allowed when no scopes configured', () => {
      expect(() => validateCommitMessage('feat(anything): add feature', defaultConfig)).not.toThrow()
    })
  })

  describe('invalid type', () => {
    it('unknown type', () => {
      expect(() => validateCommitMessage('foo: do something', defaultConfig)).toThrow()
    })

    it('suggestions for similar types', () => {
      expect.assertions(2)

      try {
        validateCommitMessage('fea: do something', defaultConfig)
      } catch (error) {
        expect(error).toBeInstanceOf(ParseError)
        expect(error instanceof ParseError && error.suggestions[0]).toContain('feat')
      }
    })
  })

  describe('invalid scope', () => {
    it('unknown scope when scopes configured', () => {
      expect(() => validateCommitMessage('feat(unknown): add feature', scopedConfig)).toThrow()
    })

    it('includes allowed scopes in suggestion', () => {
      expect.assertions(2)

      try {
        validateCommitMessage('feat(unknown): add feature', scopedConfig)
      } catch (error) {
        expect(error).toBeInstanceOf(ParseError)
        expect(error instanceof ParseError && error.suggestions[0]).toContain('Allowed scopes')
      }
    })
  })

  describe('invalid description', () => {
    it('uppercase start', () => {
      expect(() => validateCommitMessage('feat: Add feature', defaultConfig)).toThrow('lowercase')
    })

    it('suggestions for uppercase start', () => {
      expect.assertions(2)

      try {
        validateCommitMessage('feat: Add feature', defaultConfig)
      } catch (error) {
        expect(error).toBeInstanceOf(ParseError)
        expect(error instanceof ParseError && error.suggestions.length).toBeGreaterThan(0)
      }
    })

    it('trailing period', () => {
      expect(() => validateCommitMessage('feat: add feature.', defaultConfig)).toThrow('punctuation')
    })

    it('trailing exclamation', () => {
      expect(() => validateCommitMessage('feat: add feature!', defaultConfig)).toThrow('punctuation')
    })

    it('trailing comma', () => {
      expect(() => validateCommitMessage('feat: add feature,', defaultConfig)).toThrow('punctuation')
    })

    it('trailing semicolon', () => {
      expect(() => validateCommitMessage('feat: add feature;', defaultConfig)).toThrow('punctuation')
    })

    it('trailing colon', () => {
      expect(() => validateCommitMessage('feat: add feature:', defaultConfig)).toThrow('punctuation')
    })
  })

  describe('message length', () => {
    it('exceeds max length', () => {
      const msg = 'feat: ' + 'a'.repeat(DEFAULT_MAX_LENGTH)
      expect(() => validateCommitMessage(msg, defaultConfig)).toThrow('exceeds')
    })

    it('suggestion to be concise', () => {
      expect.assertions(2)

      const msg = 'feat: ' + 'a'.repeat(DEFAULT_MAX_LENGTH)
      try {
        validateCommitMessage(msg, defaultConfig)
      } catch (error) {
        expect(error).toBeInstanceOf(ParseError)
        expect(error instanceof ParseError && error.suggestions[0]).toContain('concise')
      }
    })
  })

  describe('custom config', () => {
    it('custom types', () => {
      const config: CommitsConfig = { types: ['add', 'remove'], maxLength: 72 }
      expect(() => validateCommitMessage('add: new thing', config)).not.toThrow()
      expect(() => validateCommitMessage('feat: new thing', config)).toThrow()
    })

    it('custom max length', () => {
      const config: CommitsConfig = { types: [...DEFAULT_TYPES], maxLength: 50 }
      const msg = 'feat: ' + 'a'.repeat(50)
      expect(() => validateCommitMessage(msg, config)).toThrow('exceeds')
    })
  })
})
