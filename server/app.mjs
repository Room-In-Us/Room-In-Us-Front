import http from 'node:http';
import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchAllowedImage, ImageProxyError } from './imageProxy.mjs';

const serverRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const distDir = resolve(serverRoot, 'dist');
const indexPath = join(distDir, 'index.html');
const port = Number(process.env.PORT || 80);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

function setResponseHeaders(response, headers = {}) {
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.setHeader(key, value);
    }
  });
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.statusCode = statusCode;
  setResponseHeaders(response, {
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(body);
}

function sendMethodNotAllowed(response, allowedMethods) {
  response.statusCode = 405;
  response.setHeader('Allow', allowedMethods);
  response.end();
}

function resolveDistPath(pathname) {
  const normalizedPath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, '');
  const resolvedPath = resolve(distDir, `.${normalizedPath.startsWith(sep) ? normalizedPath : `${sep}${normalizedPath}`}`);

  if (!resolvedPath.startsWith(`${distDir}${sep}`) && resolvedPath !== distDir) {
    return null;
  }

  return resolvedPath;
}

async function serveFile(request, response, filePath) {
  const fileStat = await stat(filePath);
  const extension = extname(filePath).toLowerCase();
  const isAssetFile = filePath.includes(`${sep}assets${sep}`);

  response.statusCode = 200;
  setResponseHeaders(response, {
    'Cache-Control': isAssetFile ? 'public, max-age=31536000, immutable' : 'no-cache',
    'Content-Length': fileStat.size,
    'Content-Type': contentTypes.get(extension) || 'application/octet-stream',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

async function handleImageProxy(request, response) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    sendMethodNotAllowed(response, 'GET, HEAD');
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  try {
    const proxiedImage = await fetchAllowedImage(requestUrl.searchParams.get('url'));

    response.statusCode = 200;
    setResponseHeaders(response, {
      'Cache-Control': proxiedImage.cacheControl,
      'Content-Length': proxiedImage.buffer.byteLength,
      'Content-Type': proxiedImage.contentType,
      ETag: proxiedImage.etag,
      'Last-Modified': proxiedImage.lastModified,
    });

    if (request.method === 'HEAD') {
      response.end();
      return;
    }

    response.end(proxiedImage.buffer);
  } catch (error) {
    if (error instanceof ImageProxyError) {
      sendJson(response, error.statusCode, { message: error.message });
      return;
    }

    console.error('[image-proxy] upstream fetch failed:', error);
    sendJson(response, 502, { message: 'Upstream image request failed.' });
  }
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname === '/api/image-proxy') {
    await handleImageProxy(request, response);
    return;
  }

  if (!['GET', 'HEAD'].includes(request.method)) {
    sendMethodNotAllowed(response, 'GET, HEAD');
    return;
  }

  const requestedPath = requestUrl.pathname === '/' ? indexPath : resolveDistPath(requestUrl.pathname);

  try {
    if (requestedPath) {
      await access(requestedPath);
      const requestedStat = await stat(requestedPath);

      if (requestedStat.isFile()) {
        await serveFile(request, response, requestedPath);
        return;
      }
    }
  } catch {
    // Fall through to SPA index.html.
  }

  await serveFile(request, response, indexPath);
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('[server] request handling failed:', error);
    sendJson(response, 500, { message: 'Internal Server Error' });
  });
});

server.listen(port, () => {
  console.log(`[server] listening on port ${port}`);
});
