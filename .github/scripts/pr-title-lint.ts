#!/usr/bin/env node

/**
 * Checks if a PR title starts with one of the allowed prefixes.
 * Acceptable prefixes: [FEATURE], [FIX], [CHORE], [REFACTOR], [DOCS]
 *
 * USAGE:
 *   node pr-title-lint.js "PR title goes here"
 *
 * In a GitHub Actions workflow, you can get the PR title with github.event.pull_request.title
 */
const allowedPrefixes = [
  "[FEATURE]",
  "[FIX]",
  "[CHORE]",
  "[REFACTOR]",
  "[DOCS]",
  "[CI]",
];

const title = process.argv[2];

if (!title) {
  console.error(
    'No PR title provided. Usage:\n  node pr-title-lint.js "PR title"'
  );
  process.exit(2);
}

const isValid = allowedPrefixes.some((prefix) => title.startsWith(prefix));

if (!isValid) {
  console.error(
    `❌ PR title "${title}" does not start with one of the required prefixes: ${allowedPrefixes.join(
      ", "
    )}`
  );
  process.exit(1);
} else {
  console.log(`✅ PR title "${title}" is valid.`);
}
