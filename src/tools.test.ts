import { describe, expect, it } from 'bun:test'
import { ParseError } from './errors.ts'
import { formatValidationError } from './tools.ts'

describe('formatValidationError', () => {
  it('should format a plain Error with just the message', () => {
    const error = new Error('Something went wrong')
    const result = formatValidationError(error)

    expect(result).toBe('Something went wrong')
  })

  it('should format a ParseError without suggestions', () => {
    const error = new ParseError('Invalid commit type: "foo"')
    const result = formatValidationError(error)

    expect(result).toBe('Invalid commit type: "foo"')
  })

  it('should format a ParseError with suggestions', () => {
    const error = new ParseError('Invalid commit type: "feta"', [
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

  it('should format a ParseError with multiple suggestions', () => {
    const error = new ParseError('Invalid scope: "unknown"', [
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
