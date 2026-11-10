import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { hasDynamicImportCall, prepareV3RunHtml, readV3RunModuleGraph } from './a05-v3-run-module-graph-cache.mjs';

const htmlPath = fileURLToPath(new URL('./run.html', import.meta.url));
const htmlDirectory = path.dirname(htmlPath);
const html = await readFile(htmlPath, 'utf8');
const runJs = await readFile(new URL('./run.js', import.meta.url));
const runCss = await readFile(new URL('./run.css', import.meta.url));
const runJsSha256 = createHash('sha256').update(runJs).digest('hex');
const runCssSha256 = createHash('sha256').update(runCss).digest('hex');
const expectedJsToken = `sha256-${runJsSha256}`;
const expectedCssToken = `sha256-${runCssSha256}`;
const graph = await readV3RunModuleGraph();
const generatedPage = await prepareV3RunHtml();
assert.equal(generatedPage.html, html, 'run.html is the deterministic current graph-build output');
assert.equal(hasDynamicImportCall("import('./x.js')"), true, 'literal dynamic import is recognized');
assert.equal(hasDynamicImportCall('import(variable)'), true, 'computed dynamic import is recognized');
for (const expression of ["import('./late.js')", 'import(variable)']) {
  await assert.rejects(
    readV3RunModuleGraph({ sourceOverride: (file, source) => path.basename(file) === 'run.js' ? `${source}\n${expression}` : source }),
    /Dynamic import/,
    `${expression} is rejected instead of leaving an unversioned late module`,
  );
}

const modules = [...html.matchAll(/<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g)];
assert.equal(modules.length, 1, 'the V3 run page has one module entry');
const moduleUrl = new URL(modules[0][1], 'https://example.invalid/prototype/v3/run.html');
assert.equal(moduleUrl.pathname, '/prototype/v3/run.js', 'the entry points at the V3 shared-run module');
assert.equal(moduleUrl.searchParams.get('v'), expectedJsToken, 'the entry token is the SHA-256 of exact run.js bytes');
assert.equal(moduleUrl.searchParams.get('graph'), graph.graphToken, 'entry URL names the current full static-module graph');
assert.doesNotMatch(moduleUrl.search, /refresh=/, 'cache busting is tied to shipped code, not an ad-hoc browser refresh parameter');

const importMapTag = html.match(/<script type="importmap" id="v3-run-module-graph">\s*([\s\S]*?)\s*<\/script>/);
assert.ok(importMapTag, 'run.html provides a generated import map before the module entry');
const importMap = JSON.parse(importMapTag[1]);
assert.deepEqual(importMap.imports, graph.imports, 'all current graph URLs are generated from the source graph');
assert.equal(graph.modules.length, Object.keys(importMap.imports).length, 'direct and transitive modules all have a map entry');
assert.ok(graph.modules.length > 15, 'the binding covers a nontrivial transitive module graph');
for (const [key, value] of Object.entries(importMap.imports)) {
  const sourceUrl = new URL(key, 'https://example.invalid/prototype/v3/run.html');
  const versionedUrl = new URL(value, 'https://example.invalid/prototype/v3/run.html');
  assert.equal(versionedUrl.pathname, sourceUrl.pathname, `${key} keeps its source path`);
  assert.equal(versionedUrl.searchParams.get('graph'), graph.graphToken, `${key} is bound to the graph hash`);
}
for (const module of graph.modules) {
  const moduleUrl = new URL(`/prototype/${path.relative(path.resolve(htmlDirectory, '..'), module.path).split(path.sep).join('/')}`, 'https://example.invalid');
  for (const dependency of module.dependencies) {
    const dependencyRelativeToHtml = path.relative(htmlDirectory, dependency).split(path.sep).join('/');
    const key = dependencyRelativeToHtml.startsWith('.') ? dependencyRelativeToHtml : `./${dependencyRelativeToHtml}`;
    const mappedUrl = new URL(importMap.imports[key], 'https://example.invalid/prototype/v3/run.html');
    const unversionedDependency = new URL(`./${path.relative(path.dirname(module.path), dependency).split(path.sep).join('/')}`, moduleUrl);
    assert.equal(mappedUrl.pathname, unversionedDependency.pathname, 'the browser import-map target resolves to the requested dependency');
    assert.equal(mappedUrl.searchParams.get('graph'), graph.graphToken, 'the dependency gets a fresh graph-versioned module URL');
  }
}

const directDependencies = new Set(graph.modules[0].dependencies.map((file) => path.resolve(file)));
const transitiveModule = graph.modules.find((module) => module.path !== graph.modules[0].path && !directDependencies.has(module.path));
assert.ok(transitiveModule, 'the graph includes at least one transitively imported module');
const changedGraph = await readV3RunModuleGraph({
  sourceOverride: (file, source) => file === transitiveModule.path ? `${source}\n// synthetic transitive cache invalidation probe` : source,
});
assert.notEqual(changedGraph.graphToken, graph.graphToken, 'changing only a transitive module invalidates the whole graph token');

const stylesheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
assert.equal(stylesheets.length, 1, 'the V3 run page has one stylesheet entry');
const stylesheetUrl = new URL(stylesheets[0][1], 'https://example.invalid/prototype/v3/run.html');
assert.equal(stylesheetUrl.pathname, '/prototype/v3/run.css', 'the entry points at the V3 run stylesheet');
assert.equal(stylesheetUrl.searchParams.get('v'), expectedCssToken, 'the stylesheet token is the SHA-256 of exact run.css bytes');

const logo = html.match(/<a\b[^>]*class="brand"[^>]*href="([^"]+)"/);
assert.ok(logo, 'the run page has its expected self-navigation logo');
const logoUrl = new URL(logo[1], 'https://example.invalid/prototype/v3/run.html');
assert.equal(logoUrl.pathname, '/prototype/v3/run.html', 'the logo returns to the V3 run page');
assert.equal(logoUrl.searchParams.get('v'), `build-${runJsSha256}-${runCssSha256}-${graph.graphHash}`, 'logo navigation is bound to entry, style, and full graph bytes');

console.log(`A05 T-0063 full run-module graph cache regressions PASS (${graph.modules.length} modules; transitive byte mutation changes graph token)`);
