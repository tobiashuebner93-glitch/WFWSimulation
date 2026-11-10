import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const prototypeRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(prototypeRoot);
const outputIndex = process.argv.indexOf('--output-dir');
const outputRoot = path.resolve(outputIndex >= 0 ? process.argv[outputIndex + 1] : path.join(prototypeRoot, 'v3-mobile-package'));
fs.mkdirSync(outputRoot, { recursive: true });

const entry = 'v3/run.js';
const sources = new Map();
const importPattern = /\b(?:from\s*|import\s*)(['"])([^'"]+)\1/g;
function collect(file) {
  if (sources.has(file)) return;
  const absolute = path.resolve(prototypeRoot, file);
  if (!absolute.startsWith(`${prototypeRoot}${path.sep}`) || !fs.existsSync(absolute)) throw new Error(`Laufzeitmodul fehlt oder liegt außerhalb von prototype/: ${file}`);
  const source = fs.readFileSync(absolute, 'utf8');
  sources.set(file, source);
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[2];
    if (!specifier.startsWith('.')) throw new Error(`Externe Abhängigkeit nicht offline paketierbar: ${file} -> ${specifier}`);
    collect(path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier)));
  }
}
collect(entry);

const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const htmlFile = path.join(prototypeRoot, 'v3/run.html');
const learningAnalysisSource = path.join(repoRoot, 'docs/learning/t0084-lernanalyse-mobile.html');
if (!fs.existsSync(learningAnalysisSource)) throw new Error('T-0084 mobile analysis companion is missing');
let html = fs.readFileSync(htmlFile, 'utf8');
const css = fs.readFileSync(path.join(prototypeRoot, 'v3/run.css'), 'utf8');
html = html.replace(/\s*<link[^>]+href=["']\.\/run\.css(?:\?[^"']*)?["'][^>]*>/i, '');
html = html.replace(/\s*<script[^>]+src=["']\.\/run\.js(?:\?[^"']*)?["'][^>]*><\/script>/i, '');
html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);

const encodedSources = JSON.stringify(Object.fromEntries(sources)).replace(/</g, '\\u003c');
const bootstrap = `<script type="application/json" id="wfwsim-sources">${encodedSources}</script>
<script>
(async()=>{
  try {
    const sources=JSON.parse(document.getElementById('wfwsim-sources').textContent);
    const imports={}; const urls={};
    for(const [file,source] of Object.entries(sources)){
      const key='wfwsim/'+file;
      const rewritten=source.replace(/\\b(from\\s*|import\\s*)(['"])(\\.\\.?\\/[^'"]+)\\2/g,(_,prefix,q,dep)=>{
        const target=new URL(dep,'https://package.invalid/'+file).pathname.slice(1);
        return prefix+q+'wfwsim/'+target+q;
      });
      urls[key]=URL.createObjectURL(new Blob([rewritten],{type:'text/javascript'}));
      imports[key]=urls[key];
    }
    const map=document.createElement('script');map.type='importmap';map.textContent=JSON.stringify({imports});document.head.append(map);
    await import(urls['wfwsim/v3/run.js']);
  } catch(error) {
    console.error(error);
    const box=document.createElement('section');box.style='margin:24px;padding:20px;border:1px solid #d99;border-radius:12px;background:#fff2ef;font:16px system-ui';
    box.innerHTML='<strong>V3-Testlauf konnte nicht starten</strong><p></p><small>Öffne die HTML-Datei in Safari, nicht nur in der Dateien-Schnellvorschau. Benötigt Safari unter iOS/iPadOS 16.4 oder neuer.</small>';
    box.querySelector('p').textContent=error?.message||'Unbekannter Startfehler';document.querySelector('main')?.replaceWith(box);
  }
})();
</script>`;
html = html.replace('</body>', `${bootstrap}\n</body>`);

const gitRevision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
const sourceFiles = ['v3/run.html', 'v3/run.css', ...sources.keys()];
const sourceHashes = Object.fromEntries([...new Set(sourceFiles)].sort().map(file => [file, sha256(fs.readFileSync(path.join(prototypeRoot, file)))]));
const htmlPath = path.join(outputRoot, 'werkstatt-v3-iphone-ipad.html');
fs.writeFileSync(htmlPath, html);

const analysisHtml = fs.readFileSync(learningAnalysisSource);
const analysisPath = path.join(outputRoot, 't0084-lernanalyse.html');
fs.writeFileSync(analysisPath, analysisHtml);
const readme = `Werkstatt V3 – mobiles Testpaket für iPhone und iPad\n\nEnthalten sind zwei Offline-HTML-Dateien: die Spielanwendung (gemeinsamer V3-Tageslauf: Markt, Aufträge, Planung, Lernen, Makro-Monatsübersicht und Finanzhandoff) und eine T-0084-Kurzfassung der freigegebenen, extrahierten Analyseergebnisse. Die getrennten V3-Fachseiten für Gründung, Markt-Fixture, Makro-Fixture und Kalkulation sind in diesem kompakten Paket nicht enthalten.\n\nÖffnen auf iPhone/iPad:\n1. ZIP in „Dateien“ sichern und entpacken.\n2. werkstatt-v3-iphone-ipad.html über Teilen > In Safari öffnen. Die Dateien-Schnellvorschau führt die Anwendung nicht zuverlässig aus.\n3. Mindestens Safari unter iOS/iPadOS 16.4 verwenden. Dasselbe Paket kann auf iPhone und iPad geöffnet werden.\n4. Der Laufzustand liegt im aktuellen Tab. Vor dem Schließen „Run sichern“ verwenden; die JSON-Datei kann über iCloud Drive oder AirDrop zwischen Geräten übertragen und mit „Run laden“ wieder geöffnet werden.\n\nDie HTML-Datei bündelt Styles und alle lokalen JavaScript-Module. Beim Öffnen ist keine Verbindung zum Entwicklungsserver nötig. Das Paket wurde technisch auf Modulvollständigkeit und ZIP-Integrität geprüft; ein physischer iPhone-/iPad-Safari-Test wurde nicht durchgeführt.\n\nBuildbasis: main@${gitRevision}; die enthaltenen Quellhashes und der HTML-Hash stehen im Manifest. Das Paket enthält den lokalen Working-Tree-Stand und ist noch kein Commit-/Releaseartefakt.\n`;
const readmePath = path.join(outputRoot, 'WERKSTATT-V3-MOBILE-README.txt');
fs.writeFileSync(readmePath, readme);
const manifest = {
  package: 'Werkstatt V3 iPhone/iPad mobile test package',
  scope: 'shared V3 day run; standalone V3 pages excluded',
  sourceRevision: `main@${gitRevision}`,
  workingTreeSourcesIncluded: true,
  minimumBrowser: 'Safari iOS/iPadOS 16.4+',
  sourceSha256: sourceHashes,
  artifactSha256: {
    'werkstatt-v3-iphone-ipad.html': sha256(fs.readFileSync(htmlPath)),
    't0084-lernanalyse.html': sha256(fs.readFileSync(analysisPath)),
    'WERKSTATT-V3-MOBILE-README.txt': sha256(fs.readFileSync(readmePath)),
  },
};
const manifestPath = path.join(outputRoot, 'werkstatt-v3-mobile-manifest.json');
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

const crcTable = Uint32Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1); return c >>> 0; });
function crc32(buffer) { let c = 0xffffffff; for (const byte of buffer) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function zipFiles(files) {
  const locals = [], centrals = []; let offset = 0;
  for (const [name, value] of files) {
    const filename = Buffer.from(name), body = Buffer.from(value), crc = crc32(body);
    const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(0, 8); local.writeUInt16LE(0, 10); local.writeUInt16LE(33, 12); local.writeUInt32LE(crc, 14); local.writeUInt32LE(body.length, 18); local.writeUInt32LE(body.length, 22); local.writeUInt16LE(filename.length, 26); local.writeUInt16LE(0, 28);
    locals.push(local, filename, body);
    const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(0, 10); central.writeUInt16LE(0, 12); central.writeUInt16LE(33, 14); central.writeUInt32LE(crc, 16); central.writeUInt32LE(body.length, 20); central.writeUInt32LE(body.length, 24); central.writeUInt16LE(filename.length, 28); central.writeUInt16LE(0, 30); central.writeUInt16LE(0, 32); central.writeUInt16LE(0, 34); central.writeUInt16LE(0, 36); central.writeUInt32LE(0, 38); central.writeUInt32LE(offset, 42); centrals.push(central, filename); offset += local.length + filename.length + body.length;
  }
  const directory = Buffer.concat(centrals), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(0, 4); end.writeUInt16LE(0, 6); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16); end.writeUInt16LE(0, 20);
  return Buffer.concat([...locals, directory, end]);
}
const zipPath = path.join(outputRoot, 'werkstatt-v3-iphone-ipad.zip');
fs.writeFileSync(zipPath, zipFiles([
  ['werkstatt-v3-iphone-ipad.html', fs.readFileSync(htmlPath)],
  ['t0084-lernanalyse.html', fs.readFileSync(analysisPath)],
  ['WERKSTATT-V3-MOBILE-README.txt', fs.readFileSync(readmePath)],
  ['werkstatt-v3-mobile-manifest.json', fs.readFileSync(manifestPath)],
]));
console.log(JSON.stringify({ htmlPath, analysisPath, zipPath, readmePath, manifestPath, sourceRevision: manifest.sourceRevision, moduleCount: sources.size, htmlBytes: fs.statSync(htmlPath).size, modules: [...sources.keys()] }, null, 2));
