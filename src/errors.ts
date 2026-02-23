export type CommitErrorKind = 'CommitMessageParseError' | 'CommitValidationError'

export type CommitError = Error & {
  kind: CommitErrorKind
  suggestions: string[]
}

const createCommitError = (kind: CommitErrorKind, message: string, suggestions: string[] = []): CommitError => {
  const error = new Error(message)
  error.name = kind

  return Object.assign(error, { kind, suggestions })
}

export const isCommitError = (error: unknown): error is CommitError => {
  if (!(error instanceof Error)) return false

  return 'kind' in error && 'suggestions' in error
}

export const commitMessageParseError = (message: string, suggestions: string[] = []): CommitError =>
  createCommitError('CommitMessageParseError', message, suggestions)

export const commitValidationError = (message: string, suggestions: string[] = []): CommitError =>
  createCommitError('CommitValidationError', message, suggestions)
