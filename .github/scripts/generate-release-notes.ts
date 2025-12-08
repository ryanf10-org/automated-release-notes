#!/usr/bin/env node

/**
 * Generate an array of changelog entries from the last git tag to HEAD, including author email.
 * Usage: node generate-changelog-array.js
 * Output: Array of commit objects [{ message, author, email }]
 */

const { execSync } = require("child_process");

// Get the previous tag
function getPreviousTag() {
  try {
    return execSync("git describe --tags --abbrev=0 HEAD^").toString().trim();
  } catch (err) {
    return null;
  }
}

// Get commits as raw lines with author name and email
function getCommitsSince(tag?: string | null): string[] {
  let cmd;
  if (tag) {
    cmd = `git log ${tag}..HEAD --pretty=format:"%s|%an|%ae"`;
  } else {
    cmd = `git log HEAD --pretty=format:"%s|%an|%ae"`;
  }
  return execSync(cmd).toString().trim().split("\n").filter(Boolean);
}

// Main
const previousTag = getPreviousTag();
const rawCommits = getCommitsSince(previousTag);

const commitsArray = rawCommits.map((line) => {
  const [message, author, email] = line.split("|");
  return { message, author, email };
});

console.log(commitsArray);
