# Auto-Log Rules for Splitify

## When to Log

After completing any of the following actions, create or update a changelog entry in `CHANGELOG.md` at the project root:

1. **New Feature Added** — Log the feature name, affected screens/components, and a brief description.
2. **Bug Fix** — Log the bug description, root cause, and the fix applied.
3. **Refactor** — Log what was refactored, why, and the scope of changes.
4. **Database Schema Change** — Log any changes to expo-sqlite schemas, including migrations.
5. **Navigation Changes** — Log any additions or modifications to screen routes or navigation structure.
6. **Dependency Added/Removed** — Log the package name, version, and reason for inclusion/removal.

## Log Format

Use the following format for each entry:

```markdown
## [YYYY-MM-DD] - Category

### Category Name
- **What**: Brief description of the change
- **Where**: Files/screens/components affected
- **Why**: Reason for the change (if non-obvious)
```

## Rules

- Always append to the top of `CHANGELOG.md` (newest first).
- Group related changes under the same date heading.
- Keep descriptions concise — one to two sentences max.
- Use present tense ("Add expense screen" not "Added expense screen").
- Never delete previous log entries.
