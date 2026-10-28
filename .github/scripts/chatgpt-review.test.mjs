import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { commentBody, createRequest, extractReview, findNextLink } from './chatgpt-review.mjs';

const hostile = [
  'EOF',
  'quote: " double and \' single',
  'line one\nline two',
  '${{ secrets.OPENAI_API_KEY }}',
  '; echo injected && `whoami` $(touch /tmp/nope)',
  'spaces | redirects > < & !',
].join('\n');

test('PR diff is retained exactly as JSON data, including shell and expression payloads', () => {
  const request = createRequest(hostile);
  const roundTrip = JSON.parse(JSON.stringify(request));
  assert.equal(roundTrip.messages[1].content, createRequest(hostile).messages[1].content);
  assert.ok(roundTrip.messages[1].content.endsWith(hostile));
});

test('OpenAI review is parsed as JSON data and remains safe comment content', () => {
  const raw = JSON.stringify({ choices: [{ message: { content: hostile } }] });
  assert.equal(extractReview(raw), hostile);
  assert.ok(commentBody(extractReview(raw)).endsWith(hostile));
});

test('malformed or empty API responses are rejected', () => {
  assert.throws(() => extractReview('{'), SyntaxError);
  assert.throws(() => extractReview('{"choices":[]}'), /did not contain review text/);
});

test('GitHub pagination parses the next page without output delimiters', () => {
  assert.equal(findNextLink('<https://api.github.com/page2>; rel="next", <https://api.github.com/page1>; rel="prev"'), 'https://api.github.com/page2');
  assert.equal(findNextLink(null), null);
});

test('workflow uses least-privilege permissions and has no diff/response expression interpolation', async () => {
  const workflow = await readFile(new URL('../workflows/chatgpt-review.yml', import.meta.url), 'utf8');
  assert.match(workflow, /permissions:\s+contents: read\s+issues: write/);
  assert.doesNotMatch(workflow, /\$\{\{\s*steps\.[^}]*outputs\./);
  assert.doesNotMatch(workflow, /\$GITHUB_OUTPUT|<<EOF/);
  assert.match(workflow, /ref: \$\{\{ github\.event\.pull_request\.base\.sha \}\}/);
  assert.match(workflow, /fetch-depth: 0/);
  assert.match(workflow, /refs\/pull\/\$PR_NUMBER\/head/);
  assert.match(workflow, /git diff "\$BASE_SHA\.\.\.\$PR_REF"/);
  assert.match(workflow, /--data-binary "@\$RUNNER_TEMP\/request\.json"/);
  assert.match(workflow, /post-comment/);
});


