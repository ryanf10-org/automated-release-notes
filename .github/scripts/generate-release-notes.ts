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
const tagRef = execSync("git describe --tags --exact-match").toString().trim();
const triggeringActor = process.argv[2];
const approver = process.argv[3];

const previousTag = getPreviousTag();
const rawCommits = getCommitsSince(previousTag);

const commitsArray = rawCommits.map((line) => {
  const [message, author, email] = line.split("|");
  return { message, author, email };
});

const LARK_WEB_HOOK_AUTH_TOKEN = process.env.LARK_WEB_HOOK_AUTH_TOKEN;
const handleWebhook = async () => {
  if (!LARK_WEB_HOOK_AUTH_TOKEN) {
    console.error("No Lark Web Hook Auth Token provided.");
    process.exit(2);
  }
  return await fetch(
    `https://open-sg.larksuite.com/anycross/trigger/callback/MDNkZmY4MDJmMTM5ZjAxZmZjMzkwZTZhNGFjNmUyZDZl`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${LARK_WEB_HOOK_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        commits: commitsArray,
        tagRef,
        triggeringActor,
        approver,
      }),
    }
  );
};

handleWebhook();
