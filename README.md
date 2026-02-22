# opencode-commits

An [OpenCode](https://opencode.ai) plugin that enforces [Conventional Commits](https://www.conventionalcommits.org/) by validating commit messages before they reach git. Provides tools for committing, amending, diffing, and viewing git log -- all with built-in message parsing and validation.

## Quick Start

Add `opencode-commits` to your `opencode.json` plugin list:

```json
{
  "plugin": [
    "opencode-commits"
  ]
}
```

## Tools

### git-commit

Validate and commit staged changes with a conventional commit message.

| Parameter | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| message   | string | Yes      | Conventional commit message       |

Returns the git commit output on success. Rejects with validation errors and suggestions if the message is malformed.

### git-amend

Amend the last commit with a new validated conventional commit message.

| Parameter | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| message   | string | Yes      | Conventional commit message       |

### git-diff

Show the currently staged diff.

No parameters. Returns the output of `git diff --staged`, or a notice if nothing is staged.

### git-status

Show the working tree status including staged, unstaged, and untracked files.

No parameters. Returns the output of `git status`.

### git-log

List recent commits.

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| count     | number | No       | Number of commits to show (default: 10) |

Returns the output of `git log --oneline -n <count>`.

## Conventional Commits

All commit and amend operations validate messages against the [Conventional Commits](https://www.conventionalcommits.org/) specification before executing.

### Format

```
<type>[(<scope>)]: <description>
```

### Supported Types

`feat` `fix` `build` `chore` `ci` `docs` `style` `refactor` `perf` `test` `revert`

### Scopes

Scopes are optional and configurable. When provided, they must:

- Start with a lowercase letter
- Contain only letters, numbers, and hyphens
- Be enclosed in parentheses after the type

### Validation Rules

- **Type** must be one of the supported types (lowercase only)
- **Scope** (if present) must follow the naming rules above
- **Description** must start with a lowercase letter
- **Description** must not end with punctuation (`.` `!` `,` `;` `:`)
- **Total message length** must not exceed 72 characters

Invalid messages are rejected with specific error details and suggestions for how to fix them.

## Recommended Setup

To ensure all git commit operations go through the plugin's validation, disable direct `git commit` access in your `opencode.json` permissions. This forces the agent to use the plugin's tools instead of calling git directly, so every commit is validated against your conventions.

```json
{
  "plugin": [
    "opencode-commits"
  ],
  "permission": {
    "bash": {
      "git commit *": "deny",
      "git commit": "deny"
    }
  }
}
```

This blocks the agent from running `git commit` directly through the shell, forcing it to use the plugin's validated tools instead. Other git commands like `git status` and `git add` remain unaffected.

## Configuration

Create an `opencode-commits.json` file in your project root to customize behavior:

```json
{
  "$schema": "https://raw.githubusercontent.com/whaaaley/opencode-commits/main/opencode-commits.schema.json",
  "types": ["feat", "fix", "build", "chore", "ci", "docs", "style", "refactor", "perf", "test", "revert"],
  "scopes": {
    "app": ["portal", "dashboard", "settings"],
    "layer": ["client", "server", "api", "database"],
    "infra": ["ci", "build", "deploy", "docker"]
  },
  "maxLength": 72
}
```

| Field     | Type              | Description                                      |
| --------- | ----------------- | ------------------------------------------------ |
| types     | string[]          | Allowed commit types (overrides defaults)        |
| scopes    | Record<string, string[]> | Named groups of valid scopes              |
| maxLength | number            | Max commit message length (default: 72)          |

When scopes are configured, only the listed scopes are accepted. When omitted, any well-formed scope is allowed.

## License

MIT
