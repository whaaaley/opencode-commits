import { tool } from '@opencode-ai/plugin'
import type { CommitsConfig } from './config.ts'
import { isCommitError } from './errors.ts'
import type { BunShell } from './shell.ts'
import { safe, safeAsync } from './utils/safe.ts'
import { validateCommitMessage } from './validator.ts'

const formatValidationError = (error: Error): string => {
  if (isCommitError(error)) {
    let message = `**Error:** ${error.message}`

    if (error.suggestions.length > 0) {
      message += '\n\n**Suggestions:**\n' + error.suggestions.map(s => `- ${s}`).join('\n')
    }

    return message
  }

  return `**Error:** ${error.message}`
}

export const createCommitTool = ($: BunShell, config: CommitsConfig) => {
  return tool({
    description: 'Validate and commit staged changes with a conventional commit message',
    args: {
      message: tool.schema.string().describe('Conventional commit message (e.g. "feat(api): add endpoint")'),
    },
    async execute(args) {
      const validation = safe(() => validateCommitMessage(args.message, config))
      if (validation.error) {
        return formatValidationError(validation.error)
      }

      const result = await safeAsync(() => $`git commit -m ${args.message}`.text())
      if (result.error) {
        return `**Error:** Failed to commit staged changes: ${result.error.message}`
      }

      return `**Committed successfully**\n\n\`\`\`\n${result.data.trim()}\n\`\`\``
    },
  })
}

export const createAmendTool = ($: BunShell, config: CommitsConfig) => {
  return tool({
    description: 'Amend the last commit with a new validated conventional commit message',
    args: {
      message: tool.schema.string().describe('New conventional commit message'),
    },
    async execute(args) {
      const validation = safe(() => validateCommitMessage(args.message, config))
      if (validation.error) {
        return formatValidationError(validation.error)
      }

      const result = await safeAsync(() => $`git commit --amend -m ${args.message}`.text())
      if (result.error) {
        return `**Error:** Failed to amend commit: ${result.error.message}`
      }

      return `**Amended successfully**\n\n\`\`\`\n${result.data.trim()}\n\`\`\``
    },
  })
}

export const createDiffTool = ($: BunShell) => {
  return tool({
    description: 'Show the currently staged diff',
    args: {},
    async execute() {
      const result = await safeAsync(() => $`git diff --staged`.text())
      if (result.error) {
        return `**Error:** Failed to get staged diff: ${result.error.message}`
      }

      const trimmed = result.data.trim()
      if (!trimmed) {
        return 'Nothing is currently staged.'
      }

      return `\`\`\`diff\n${trimmed}\n\`\`\``
    },
  })
}

export const createLogTool = ($: BunShell) => {
  return tool({
    description: 'List recent commits',
    args: {
      count: tool.schema.number().optional().describe('Number of commits to show (default: 10)'),
    },
    async execute(args) {
      const count = args.count ?? 10

      const result = await safeAsync(() => $`git log --oneline -n ${count}`.text())
      if (result.error) {
        return `**Error:** Failed to get git log: ${result.error.message}`
      }

      const trimmed = result.data.trim()
      if (!trimmed) {
        return 'No commits found.'
      }

      return `\`\`\`\n${trimmed}\n\`\`\``
    },
  })
}

export const createStatusTool = ($: BunShell) => {
  return tool({
    description: 'Show the working tree status including staged, unstaged, and untracked files',
    args: {},
    async execute() {
      const result = await safeAsync(() => $`git status`.text())
      if (result.error) {
        return `**Error:** Failed to get git status: ${result.error.message}`
      }

      return `\`\`\`\n${result.data.trim()}\n\`\`\``
    },
  })
}
