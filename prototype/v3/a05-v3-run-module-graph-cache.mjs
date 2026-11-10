import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const prototypeRoot = path.resolve(moduleDirectory, '..');
const htmlPath = path.join(moduleDirectory, 'run.html');
const runJsPath = path.join(moduleDirectory, 'run.js');
const runCssPath = path.join(moduleDirectory, 'run.css');
const importMapId = 'v3-run-module-graph';
const sampleBase = new URL('https://example.invalid/prototype/v3/run.html');

function pathWithinPrototype(filePath) {
  const relativePath = path.relative(prototypeRoot, filePath).split(path.sep).join('/');
  if (relativePath === '..' || relativePath.startsWith('../') || path.isAbsolute(relativePath)) {
    throw new Error(`Run module escapes prototype root: ${filePath}`);
  }
  return relativePath;
}

export function hasDynamicImportCall(source) {
  // Conservative source scan: any import( candidate blocks the build, even in
  // comments/strings. This avoids silently missing syntax hidden by comments.
  return /\bimport(?:(?:\s+)|(?:\/\*[\s\S]*?\*\/)|(?:\/\/[^\r\n]*(?:\r?\n|$)))*\(/.test(source);
}
function staticImportSpecifiers(source) {
  const starts = [...source.matchAll(/^\s*(?:import\s|import["']|export\s)/gm)];
  const result = [];
  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index].index;
    const end = starts[index + 1]?.index ?? source.length;
    let statement = source.slice(start, end);
    const semicolon = statement.indexOf(';');
    if (semicolon >= 0) statement = statement.slice(0, semicolon + 1);
    const fromSpecifier = statement.match(/\bfrom\s*(["'])([^"']+)\1/);
    const sideEffectSpecifier = statement.match(/^\s*import\s*(["'])([^"']+)\1/);
    const specifier = fromSpecifier?.[2] ?? sideEffectSpecifier?.[2];
    if (specifier) result.push(specifier);
  }
  return result;
}
function mapKeyFor(modulePath) {
  const relativePath = path.relative(moduleDirectory, modulePath).split(path.sep).join('/');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

export async function readV3RunModuleGraph({ sourceOverride } = {}) {
  const modules = new Map();
  const visit = async (modulePath) => {
    const absolutePath = path.resolve(modulePath);
    if (modules.has(absolutePath)) return;
    pathWithinPrototype(absolutePath);
    const bytes = await readFile(absolutePath);
    const originalSource = bytes.toString('utf8');
    const source = sourceOverride ? await sourceOverride(absolutePath, originalSource) : originalSource;
    if (hasDynamicImportCall(source)) {
      throw new Error(`Dynamic import() is not supported in the V3 run graph (${pathWithinPrototype(absolutePath)}); keep the run graph statically resolvable`);
    }
    const specifiers = staticImportSpecifiers(source);
    const dependencies = [];
    for (const specifier of specifiers) {
      if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
        throw new Error(`Non-local static import in run graph (${pathWithinPrototype(absolutePath)}): ${specifier}`);
      }
      const dependencyUrl = new URL(specifier, pathToFileURL(absolutePath));
      if (dependencyUrl.protocol !== 'file:' || dependencyUrl.search || dependencyUrl.hash) {
        throw new Error(`Run graph imports must be local module URLs without query/hash: ${specifier}`);
      }
      const dependencyPath = fileURLToPath(dependencyUrl);
      dependencies.push(dependencyPath);
    }
    modules.set(absolutePath, { path: absolutePath, bytes: Buffer.from(source), dependencies });
    for (const dependency of dependencies) await visit(dependency);
  };

  await visit(runJsPath);
  const sortedModules = [...modules.values()].sort((left, right) =>
    pathWithinPrototype(left.path).localeCompare(pathWithinPrototype(right.path), 'en'),
  );
  const hash = createHash('sha256');
  for (const module of sortedModules) {
    hash.update(pathWithinPrototype(module.path)).update('\0');
    hash.update(module.bytes).update('\0');
    const dependencyNames = module.dependencies
      .map((dependency) => pathWithinPrototype(dependency))
      .sort((left, right) => left.localeCompare(right, 'en'));
    hash.update(dependencyNames.join('\n')).update('\n');
  }
  const graphHash = hash.digest('hex');
  const graphToken = `sha256-${graphHash}`;
  const imports = Object.fromEntries(sortedModules
    .map((module) => mapKeyFor(module.path))
    .sort((left, right) => left.localeCompare(right, 'en'))
    .map((key) => [key, `${key}?graph=${graphToken}`]));
  return { modules: sortedModules, imports, graphHash, graphToken };
}

function updateUrl(rawUrl, base, entries) {
  const parsed = new URL(rawUrl, base);
  for (const [key, value] of Object.entries(entries)) parsed.searchParams.set(key, value);
  const relativePrefix = rawUrl.split(/[?#]/, 1)[0];
  const query = parsed.searchParams.toString();
  return `${relativePrefix}?${query}${parsed.hash}`;
}

export async function prepareV3RunHtml({ write = false } = {}) {
  const graph = await readV3RunModuleGraph();
  let html = await readFile(htmlPath, 'utf8');
  const runJs = await readFile(runJsPath);
  const runCss = await readFile(runCssPath);
  const runJsHash = createHash('sha256').update(runJs).digest('hex');
  const runCssHash = createHash('sha256').update(runCss).digest('hex');
  const importMap = `<script type="importmap" id="${importMapId}">\n${JSON.stringify({ imports: graph.imports }, null, 2)}\n</script>`;
  const importMapPattern = new RegExp(`<script\\b(?=[^>]*\\bid="${importMapId}")[^>]*>[\\s\\S]*?<\\/script>`);
  if (importMapPattern.test(html)) {
    html = html.replace(importMapPattern, importMap);
  } else {
    const moduleScriptStart = html.search(/<script\b[^>]*type="module"/);
    if (moduleScriptStart < 0) throw new Error('V3 run module entry is missing');
    html = `${html.slice(0, moduleScriptStart)}${importMap}\n  ${html.slice(moduleScriptStart)}`;
  }

  const entryPattern = /(<script\b[^>]*type="module"[^>]*src=")([^"]+)("[^>]*><\/script>)/;
  const entryMatch = html.match(entryPattern);
  if (!entryMatch) throw new Error('Expected exactly one V3 module entry');
  html = html.replace(entryPattern, (_match, before, url, after) =>
    `${before}${updateUrl(url, new URL('./', sampleBase), {
      v: `sha256-${runJsHash}`,
      graph: graph.graphToken,
    })}${after}`,
  );

  const stylesheetPattern = /(<link\b[^>]*rel="stylesheet"[^>]*href=")([^"]+)("[^>]*>)/;
  const stylesheetMatch = html.match(stylesheetPattern);
  if (!stylesheetMatch) throw new Error('Expected exactly one V3 run stylesheet');
  html = html.replace(stylesheetPattern, (_match, before, url, after) =>
    `${before}${updateUrl(url, new URL('./', sampleBase), { v: `sha256-${runCssHash}` })}${after}`,
  );

  const logoPattern = /(<a\b[^>]*class="brand"[^>]*href=")([^"]+)(")/;
  const logoMatch = html.match(logoPattern);
  if (!logoMatch) throw new Error('Expected V3 run overview logo');
  html = html.replace(logoPattern, (_match, before, url, after) =>
    `${before}${updateUrl(url, new URL('./', sampleBase), {
      v: `build-${runJsHash}-${runCssHash}-${graph.graphHash}`,
    })}${after}`,
  );

  if (write) await writeFile(htmlPath, html, 'utf8');
  return { ...graph, html, runJsHash, runCssHash };
}

if (process.argv.includes('--write')) {
  const result = await prepareV3RunHtml({ write: true });
  console.log(`Updated run.html graph token ${result.graphToken} across ${result.modules.length} static modules`);
}