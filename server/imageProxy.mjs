const ALLOWED_IMAGE_HOSTS = new Set([
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'naverbooking-phinf.pstatic.net',
  'xn--2e0b040a4xj.com',
  '지구별.com',
]);

const UPSTREAM_TIMEOUT_MS = 10_000;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

class ImageProxyError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'ImageProxyError';
    this.statusCode = statusCode;
  }
}

function normalizeImageUrl(imageUrl) {
  if (Array.isArray(imageUrl)) {
    return imageUrl[0];
  }

  return imageUrl;
}

function parseAllowedImageUrl(imageUrl) {
  const normalizedUrl = normalizeImageUrl(imageUrl);

  if (!normalizedUrl) {
    throw new ImageProxyError(400, 'Missing url query parameter.');
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(normalizedUrl);
  } catch {
    throw new ImageProxyError(400, 'Invalid image url.');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol) || !ALLOWED_IMAGE_HOSTS.has(parsedUrl.hostname)) {
    throw new ImageProxyError(403, 'Image host is not allowed.');
  }

  return parsedUrl;
}

async function fetchAllowedImage(imageUrl) {
  const parsedUrl = parseAllowedImageUrl(imageUrl);
  const upstreamResponse = await fetch(parsedUrl, {
    headers: {
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!upstreamResponse.ok) {
    throw new ImageProxyError(upstreamResponse.status, 'Failed to fetch upstream image.');
  }

  const contentType = upstreamResponse.headers.get('content-type') || 'application/octet-stream';

  if (!contentType.startsWith('image/')) {
    throw new ImageProxyError(502, 'Upstream response is not an image.');
  }

  const declaredLength = Number(upstreamResponse.headers.get('content-length'));

  if (Number.isFinite(declaredLength) && declaredLength > MAX_IMAGE_BYTES) {
    throw new ImageProxyError(413, 'Image is too large to proxy.');
  }

  const buffer = Buffer.from(await upstreamResponse.arrayBuffer());

  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new ImageProxyError(413, 'Image is too large to proxy.');
  }

  return {
    buffer,
    cacheControl: upstreamResponse.headers.get('cache-control') || 'public, max-age=3600',
    contentType,
    etag: upstreamResponse.headers.get('etag'),
    lastModified: upstreamResponse.headers.get('last-modified'),
  };
}

export { ALLOWED_IMAGE_HOSTS, ImageProxyError, fetchAllowedImage, normalizeImageUrl };
