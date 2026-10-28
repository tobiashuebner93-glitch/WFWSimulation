import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const systemPrompt = 'Du bist ein präziser, technischer Code-Reviewer. Fasse dich klar, strukturiert und hilfreich.';
const userPromptPrefix = 'Analysiere den folgenden Code-Diff aus dem WFWSimulation-Repo und gib konkrete Verbesserungsvorschläge, potentielle Fehler, Sicherheitsrisiken und Optimierungen:\n\n';
const commentMarker = '<!-- chatgpt-review -->';

export function createRequest(diff) {
  return {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPromptPrefix + diff },
    ],
  };
}

export function extractReview(responseText) {
  const response = JSON.parse(responseText);
  const review = response?.choices?.[0]?.message?.content;
  if (typeof review !== 'string' || review.length === 0) {
    throw new Error('OpenAI response did not contain review text');
  }
  return review;
}

export function commentBody(review) {
  return `${commentMarker}\n🤖 **ChatGPT Review für WFWSimulation**\n\n${review}`;
}

export function findNextLink(linkHeader) {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}

async function apiRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed with HTTP ${response.status}`);
  }
  return response;
}

async function postOrUpdateComment(body) {
  const token = process.env.GH_TOKEN;
  const repository = process.env.GH_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;
  if (!token || !repository || !/^\d+$/.test(prNumber ?? '')) {
    throw new Error('Missing GitHub comment credentials or pull request number');
  }
  const [owner, repo] = repository.split('/');
  if (!owner || !repo || repository.split('/').length !== 2) {
    throw new Error('Invalid GitHub repository identifier');
  }
  const issueUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${prNumber}/comments?per_page=100`;
  let nextUrl = issueUrl;
  let existing = null;
  while (nextUrl) {
    const response = await apiRequest(nextUrl, token);
    const comments = await response.json();
    existing = comments.find((comment) => comment.body?.startsWith(commentMarker)) ?? existing;
    if (existing) break;
    nextUrl = findNextLink(response.headers.get('link'));
  }
  const url = existing
    ? `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/comments/${existing.id}`
    : issueUrl.replace(/\?per_page=100$/, '');
  await apiRequest(url, token, {
    method: existing ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
}

async function main() {
  const [command, inputPath, outputPath] = process.argv.slice(2);
  if (command === 'create-request' && inputPath && outputPath) {
    const diff = await readFile(inputPath, 'utf8');
    await writeFile(outputPath, JSON.stringify(createRequest(diff)), 'utf8');
    return;
  }
  if (command === 'extract-response' && inputPath && outputPath) {
    const responseText = await readFile(inputPath, 'utf8');
    await writeFile(outputPath, commentBody(extractReview(responseText)), 'utf8');
    return;
  }
  if (command === 'post-comment' && inputPath) {
    await postOrUpdateComment(await readFile(inputPath, 'utf8'));
    return;
  }
  throw new Error('Usage: chatgpt-review.mjs <create-request|extract-response|post-comment> <input> [output]');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}


