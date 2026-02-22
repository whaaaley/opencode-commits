import type { Plugin } from '@opencode-ai/plugin'
import { loadConfig } from './src/config.ts'
import {
  createAmendTool,
  createCommitTool,
  createDiffTool,
  createLogTool,
  createStatusTool,
  createUndoTool,
} from './src/tools.ts'

const plugin: Plugin = async ({ directory, $ }) => {
  const config = await loadConfig(directory)

  return {
    tool: {
      'git-amend': createAmendTool($, config),
      'git-commit': createCommitTool($, config),
      'git-diff': createDiffTool($),
      'git-log': createLogTool($),
      'git-status': createStatusTool($),
      'git-undo': createUndoTool($),
    },
  }
}

export default plugin
