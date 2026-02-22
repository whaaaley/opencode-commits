import { describe, expect, it } from 'bun:test'
import { isCommitError } from './errors.ts'
import { parseCommitMessage } from './parser.ts'

describe('parseCommitMessage', () => {
  describe('valid messages', () => {
    it('type and description', () => {
      const result = parseCommitMessage('feat: add new feature')
      expect(result.type).toBe('feat')
      expect(result.scope).toBeUndefined()
      expect(result.description).toBe('add new feature')
      expect(result.raw).toBe('feat: add new feature')
    })

    it('type with scope', () => {
      const result = parseCommitMessage('fix(api): resolve timeout issue')
      expect(result.type).toBe('fix')
      expect(result.scope).toBe('api')
      expect(result.description).toBe('resolve timeout issue')
    })

    it('scope with hyphens', () => {
      const result = parseCommitMessage('feat(my-scope): add feature')
      expect(result.scope).toBe('my-scope')
    })

    it('scope with camelCase', () => {
      const result = parseCommitMessage('feat(myScope): add feature')
      expect(result.scope).toBe('myScope')
    })

    it('scope with numbers', () => {
      const result = parseCommitMessage('fix(api2): fix endpoint')
      expect(result.scope).toBe('api2')
    })

    it('trims whitespace', () => {
      const result = parseCommitMessage('  feat: add feature  ')
      expect(result.type).toBe('feat')
      expect(result.description).toBe('add feature')
    })

    it('multi-word description', () => {
      const result = parseCommitMessage('refactor: clean up the entire authentication flow')
      expect(result.description).toBe('clean up the entire authentication flow')
    })

    it('description with special characters', () => {
      const result = parseCommitMessage('docs: update README with `code` blocks')
      expect(result.description).toBe('update README with `code` blocks')
    })

    it('description with colons', () => {
      const result = parseCommitMessage('feat: add config: new options')
      expect(result.description).toBe('add config: new options')
    })
  })

  describe('invalid messages', () => {
    it('empty string', () => {
      expect(() => parseCommitMessage('')).toThrow('must not be empty')
      expect(() => parseCommitMessage('  ')).toThrow('must not be empty')
    })

    it('missing colon', () => {
      expect(() => parseCommitMessage('feat add feature')).toThrow('must contain a colon')
    })

    it('empty type', () => {
      expect(() => parseCommitMessage(': add feature')).toThrow('must not be empty')
    })

    it('empty description', () => {
      expect(() => parseCommitMessage('feat:')).toThrow('description must not be empty')
      expect(() => parseCommitMessage('feat:   ')).toThrow('description must not be empty')
    })

    it('uppercase type', () => {
      expect(() => parseCommitMessage('Feat: add feature')).toThrow('only lowercase letters')
    })

    it('type with numbers', () => {
      expect(() => parseCommitMessage('feat2: add feature')).toThrow('only lowercase letters')
    })

    it('type with hyphens', () => {
      expect(() => parseCommitMessage('hot-fix: fix bug')).toThrow('only lowercase letters')
    })

    it('missing closing parenthesis', () => {
      expect(() => parseCommitMessage('feat(api: fix bug')).toThrow('without closing parenthesis')
    })

    it('missing opening parenthesis', () => {
      expect(() => parseCommitMessage('feat api): fix bug')).toThrow('without opening parenthesis')
    })

    it('empty scope', () => {
      expect(() => parseCommitMessage('feat(): add feature')).toThrow('must not be empty')
    })

    it('uppercase scope start', () => {
      expect(() => parseCommitMessage('feat(Api): add feature')).toThrow('start with a lowercase')
    })

    it('scope with spaces', () => {
      expect(() => parseCommitMessage('feat(my scope): add feature')).toThrow('only contain letters')
    })

    it('scope with special characters', () => {
      expect(() => parseCommitMessage('feat(my_scope): add feature')).toThrow('only contain letters')
    })

    it('scope starting with number', () => {
      expect(() => parseCommitMessage('feat(2api): add feature')).toThrow('start with a lowercase')
    })

    it('scope starting with hyphen', () => {
      expect(() => parseCommitMessage('feat(-api): add feature')).toThrow('start with a lowercase')
    })
  })

  describe('error suggestions', () => {
    it('empty message includes format suggestion', () => {
      expect.assertions(3)

      try {
        parseCommitMessage('')
      } catch (error) {
        expect(isCommitError(error)).toBe(true)

        if (isCommitError(error)) {
          expect(error.kind).toBe('CommitMessageParseError')
          expect(error.suggestions.length).toBeGreaterThan(0)
        }
      }
    })

    it('missing colon includes example', () => {
      expect.assertions(3)

      try {
        parseCommitMessage('feat add feature')
      } catch (error) {
        expect(isCommitError(error)).toBe(true)

        if (isCommitError(error)) {
          expect(error.kind).toBe('CommitMessageParseError')
          expect(error.suggestions.some(s => s.includes('feat:'))).toBe(true)
        }
      }
    })
  })
})
