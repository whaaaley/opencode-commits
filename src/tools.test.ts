import { describe, expect, it } from 'bun:test'
import { CommitError } from './errors.ts'
import { formatValidationError } from './tools.ts'

describe('formatValidationError', () => {
  it('should format a plain Error with just the message', () => {
    const error = new Error('Something went wrong')
    const result = formatValidationError(error)

    expect(result).toBe('Something went wrong')
  })

  it('should format a CommitError without suggestions', () => {
    const error = new CommitError('Invalid commit type: "foo"')
    const result = formatValidationError(error)

    expect(result).toBe('Invalid commit type: "foo"')
  })

  it('should format a CommitError with suggestions', () => {
    const error = new CommitError('Invalid commit type: "feta"', [
      'Did you mean "feat"?',
    ])
    const result = formatValidationError(error)

    expect(result).toBe([
      'Invalid commit type: "feta"',
      '',
      'Suggestions:',
      '- Did you mean "feat"?',
    ].join('\n'))
  })

  it('should format a CommitError with multiple suggestions', () => {
    const error = new CommitError('Invalid scope: "unknown"', [
      'Allowed scopes: api, ui, core',
      'Run "git config" to see available scopes',
    ])
    const result = formatValidationError(error)

    expect(result).toBe([
      'Invalid scope: "unknown"',
      '',
      'Suggestions:',
      '- Allowed scopes: api, ui, core',
      '- Run "git config" to see available scopes',
    ].join('\n'))
  })
})
