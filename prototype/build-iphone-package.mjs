import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const outputArgument = process.argv.indexOf('--output-dir');
const outputRoot = outputArgument >= 0 ? path.resolve(process.argv[outputArgument + 1] || '') : root;
fs.mkdirSync(outputRoot, { recursive: true });
const entry = 'app.js';
const sources = new Map();
const importPattern = /\bimport\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g;
function collect(file) {
  if (sources.has(file)) return;
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) throw new Error(`Runtime-Modul fehlt: ${file}`);
  const source = fs.readFileSync(absolute, 'utf8');
  sources.set(file, source);
  for (const match of source.matchAll(importPattern)) {
    const spec = match[1];
    if (!spec.startsWith('./')) throw new Error(`Externe Abhängigkeit nicht paketierbar: ${file} -> ${spec}`);
    collect(path.posix.normalize(path.posix.join(path.posix.dirname(file), spec.slice(2))));
  }
}
collect(entry);
const htmlPath = path.join(root, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
html = html.replace(/\s*<link[^>]+href=["']\.\/styles\.css(?:\?[^"']*)?["'][^>]*>/i, '');
html = html.replace(/\s*<script[^>]+src=["']\.\/app\.js["'][^>]*><\/script>/i, '');
html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
const encodedSources = JSON.stringify(Object.fromEntries(sources)).replace(/</g, '\\u003c');
const bootstrap = `<script type="application/json" id="wfwsim-sources">${encodedSources}</script>
<script>
(async()=>{
  const message='Diese Safari-Version kann das Offline-Spiel nicht starten. Bitte Safari unter iOS 16.4 oder neuer verwenden.';
  try {
    const sources=JSON.parse(document.getElementById('wfwsim-sources').textContent);
    const imports={}; const urls={};
    for(const [file,source] of Object.entries(sources)){
      const key='wfwsim/'+file;
      const rewritten=source.replace(/\\bfrom\\s+(['"])\\.\\/([^'"]+)\\1/g,(_,q,dep)=>'from '+q+'wfwsim/'+dep+q);
      urls[key]=URL.createObjectURL(new Blob([rewritten],{type:'text/javascript'}));
      imports[key]=urls[key];
    }
    const map=document.createElement('script');map.type='importmap';map.textContent=JSON.stringify({imports});document.head.append(map);
    await import(urls['wfwsim/app.js']);
  } catch(error) {
    console.error(error);
    const box=document.createElement('section');box.style='margin:24px;padding:20px;border:1px solid #d99;border-radius:12px;background:#fff2ef;font:16px system-ui';
    box.innerHTML='<strong>Spiel konnte nicht gestartet werden</strong><p></p><small>Öffne die HTML-Datei direkt in Safari. Die Dateien-App-Vorschau führt interaktive Webseiten nicht immer aus.</small>';
    box.querySelector('p').textContent=error?.message||message;document.querySelector('.app-shell').replaceWith(box);
  }
})();
</script>`;
html = html.replace('</body>', `${bootstrap}\n</body>`);
const output = path.join(outputRoot, 'werkstatt-v2-iphone.html');
fs.writeFileSync(output, html);
const readme = `Werkstatt V2 – Offline-Paket für iPhone und iPad\n\nDatei: werkstatt-v2-iphone.html\nMindestversion: Safari unter iOS/iPadOS 16.4 oder neuer.\n\nÖffnen auf iPhone oder iPad:\n1. ZIP-Datei in „Dateien“ sichern und entpacken.\n2. HTML-Datei über das Teilen-Menü in Safari öffnen. Die Dateien-App-Schnellvorschau führt interaktive Webseiten nicht zuverlässig aus.\n3. Dasselbe Paket kann auf beiden Geräten verwendet werden. Für den Wechsel zwischen Geräten die HTML-/ZIP-Datei und Spielstände über iCloud Drive oder AirDrop übertragen.\n4. Im Spiel „Speichern“ wählen und den JSON-Spielstand in „Dateien“ sichern. „Laden“ importiert ihn wieder. Safari-Daten können beim Löschen der Browserdaten verloren gehen.\n\nDas Spiel enthält Oberfläche, Styles und alle lokalen Module in einer HTML-Datei. Kein Server und keine Netzverbindung zum Spielen erforderlich. Die tatsächliche Ausführung kann je nach iOS-/iPadOS-Version und Öffnungsweg variieren; reale Geräteprüfung wird im Testbericht separat ausgewiesen.\n\nDas Manifest nennt Quellrevision sowie SHA-256-Prüfsummen der Eingabedateien und Ausgabe-HTML. Erstellt mit build-iphone-package.mjs.\n`;
const readmePath = path.join(outputRoot, 'WERKSTATT-V2-IPHONE-README.txt');
fs.writeFileSync(readmePath, readme);
const manifestPath = path.join(outputRoot, 'werkstatt-v2-package-manifest.json');
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const sourceFiles = ['index.html', 'styles.css', ...sources.keys()];
const gitRevision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
let workingTreeSourcesIncluded = false;
try {
  execFileSync('git', ['diff', '--quiet', 'HEAD', '--', ...sourceFiles], { cwd: root, stdio: 'ignore' });
} catch {
  workingTreeSourcesIncluded = true;
}
const manifest = {
  package: 'Werkstatt V2 iPhone/iPad offline test package',
  sourceRevision: `main@${gitRevision}`,
  workingTreeSourcesIncluded,
  minimumBrowser: 'Safari iOS/iPadOS 16.4+',
  sourceSha256: Object.fromEntries([...new Set(sourceFiles)].sort().map(file => [file, sha256(fs.readFileSync(path.join(root, file)))])),
  artifactSha256: { 'werkstatt-v2-iphone.html': sha256(fs.readFileSync(output)), 'WERKSTATT-V2-IPHONE-README.txt': sha256(fs.readFileSync(readmePath)) },
};
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
fs.writeFileSync(manifestPath, manifestText);
const zip = path.join(outputRoot, 'werkstatt-v2-iphone.zip');
const crcTable=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);return c>>>0;});
function crc32(buf){let c=0xffffffff;for(const byte of buf)c=crcTable[(c^byte)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function zipFiles(files){const locals=[],centrals=[];let offset=0;for(const [name,data] of files){const filename=Buffer.from(name),body=Buffer.from(data),crc=crc32(body);const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);local.writeUInt16LE(0x0800,6);local.writeUInt16LE(0,8);local.writeUInt16LE(0,10);local.writeUInt16LE(33,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(body.length,18);local.writeUInt32LE(body.length,22);local.writeUInt16LE(filename.length,26);local.writeUInt16LE(0,28);locals.push(local,filename,body);const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50,0);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(0x0800,8);central.writeUInt16LE(0,10);central.writeUInt16LE(0,12);central.writeUInt16LE(33,14);central.writeUInt32LE(crc,16);central.writeUInt32LE(body.length,20);central.writeUInt32LE(body.length,24);central.writeUInt16LE(filename.length,28);central.writeUInt16LE(0,30);central.writeUInt16LE(0,32);central.writeUInt16LE(0,34);central.writeUInt16LE(0,36);central.writeUInt32LE(0,38);central.writeUInt32LE(offset,42);centrals.push(central,filename);offset+=local.length+filename.length+body.length;}const directory=Buffer.concat(centrals),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(0,4);end.writeUInt16LE(0,6);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);end.writeUInt16LE(0,20);return Buffer.concat([...locals,directory,end]);}
fs.writeFileSync(zip,zipFiles([['werkstatt-v2-iphone.html',fs.readFileSync(output)],['WERKSTATT-V2-IPHONE-README.txt',fs.readFileSync(readmePath)],['werkstatt-v2-package-manifest.json',fs.readFileSync(manifestPath)]]));
console.log(JSON.stringify({output,zip,readme:readmePath,manifest:manifestPath,sourceRevision:manifest.sourceRevision,moduleCount:sources.size,htmlBytes:Buffer.byteLength(html),modules:[...sources.keys()]},null,2));
