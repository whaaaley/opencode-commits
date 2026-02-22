import { describe, expect, it } from 'bun:test'
import { commitMessageParseError, commitValidationError } from './errors.ts'
import { formatValidationError } from './tools.ts'

describe('formatValidationError', () => {
  it('should format a plain Error with just the message', () => {
    const error = new Error('Something went wrong')
    const result = formatValidationError(error)

    expect(result).toBe('**Error:** Something went wrong')
  })

  it('should format a CommitError without suggestions', () => {
    const error = commitValidationError('Invalid commit type: "foo"')
    const result = formatValidationError(error)

    expect(result).toBe('**Error:** Invalid commit type: "foo"')
  })

  it('should format a CommitError with suggestions', () => {
    const error = commitValidationError('Invalid commit type: "feta"', [
      'Did you mean "feat"?',
    ])
    const result = formatValidationError(error)

    expect(result).toBe([
      '**Error:** Invalid commit type: "feta"',
      '',
      '**Suggestions:**',
      '- Did you mean "feat"?',
    ].join('\n'))
  })

  it('should format a CommitError with multiple suggestions', () => {
    const error = commitValidationError('Invalid scope: "unknown"', [
      'Allowed scopes: api, ui, core',
      'Run "git config" to see available scopes',
    ])
    const result = formatValidationError(error)

    expect(result).toBe([
      '**Error:** Invalid scope: "unknown"',
      '',
      '**Suggestions:**',
      '- Allowed scopes: api, ui, core',
      '- Run "git config" to see available scopes',
    ].join('\n'))
  })

  it('should format a CommitMessageParseError the same as CommitValidationError', () => {
    const error = commitMessageParseError('Missing colon separator', [
      'Example: feat: add new feature',
    ])
    const result = formatValidationError(error)

    expect(result).toBe([
      '**Error:** Missing colon separator',
      '',
      '**Suggestions:**',
      '- Example: feat: add new feature',
    ].join('\n'))
  })
})
