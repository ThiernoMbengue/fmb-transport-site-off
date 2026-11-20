#!/usr/bin/env node
// Petit serveur local pour prévisualiser dist/ : npm run dev → http://localhost:4173
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const port = Number(process.env.PORT) || 4173;

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  if (path.endsWith('/')) path += 'index.html';
  try {
    let body = await readFile(join(DIST, path));
    const headers = { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream', 'Cache-Control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache' };
    if (/\.(html|css|js|xml|txt|webmanifest)$/.test(path)) { body = gzipSync(body); headers['Content-Encoding'] = 'gzip'; }   // comme l'hébergeur
    res.writeHead(200, headers).end(body);
  } catch {
    const body = await readFile(join(DIST, '404.html'));
    res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(body);
  }
}).listen(port, () => console.log(`Aperçu : http://localhost:${port}`));
