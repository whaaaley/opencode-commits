import type { CommitsConfig } from './config.ts'
import { getAllScopes } from './config.ts'
import { commitValidationError } from './errors.ts'
import { parseCommitMessage } from './parser.ts'

export const validateCommitMessage = (message: string, config: CommitsConfig): void => {
  const parsed = parseCommitMessage(message)

  if (!config.types.includes(parsed.type)) {
    const firstChar = parsed.type[0]
    const close = firstChar ? config.types.filter(t => t.startsWith(firstChar)) : []

    const suggestions = close.length > 0
      ? [`Did you mean: ${close.join(', ')}?`]
      : [`Valid types are: ${config.types.join(', ')}`]

    throw commitValidationError(`Invalid commit type: "${parsed.type}"`, suggestions)
  }

  const allowedScopes = getAllScopes(config)
  if (parsed.scope && allowedScopes) {
    if (!allowedScopes.includes(parsed.scope)) {
      throw commitValidationError(`Invalid scope: "${parsed.scope}"`, [
        `Allowed scopes are: ${allowedScopes.join(', ')}`,
      ])
    }
  }

  if (/^[A-Z]/.test(parsed.description)) {
    throw commitValidationError('Description must start with a lowercase letter', [
      `Change "${parsed.description}" to start with a lowercase letter`,
    ])
  }

  if (/[.!,;:]$/.test(parsed.description)) {
    throw commitValidationError('Description must not end with punctuation', [
      `Remove the trailing "${parsed.description.slice(-1)}" from the description`,
    ])
  }

  if (parsed.raw.length > config.maxLength) {
    throw commitValidationError(
      `Commit message exceeds ${config.maxLength} characters (${parsed.raw.length})`,
      ['Be more concise'],
    )
  }
}
