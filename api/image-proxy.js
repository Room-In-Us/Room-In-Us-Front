const ALLOWED_IMAGE_HOSTS = new Set([
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  'naverbooking-phinf.pstatic.net',
  'xn--2e0b040a4xj.com',
  '지구별.com',
]);

function getImageUrl(query) {
  if (Array.isArray(query?.url)) {
    return query.url[0];
  }

  return query?.url;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const imageUrl = getImageUrl(request.query);

  if (!imageUrl) {
    response.status(400).json({ message: 'Missing url query parameter.' });
    return;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    response.status(400).json({ message: 'Invalid image url.' });
    return;
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol) || !ALLOWED_IMAGE_HOSTS.has(parsedUrl.hostname)) {
    response.status(403).json({ message: 'Image host is not allowed.' });
    return;
  }

  try {
    const upstreamResponse = await fetch(parsedUrl, {
      headers: {
        // Some upstream hosts vary image responses by Accept header.
        accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!upstreamResponse.ok) {
      response.status(upstreamResponse.status).json({ message: 'Failed to fetch upstream image.' });
      return;
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();
    const cacheControl = upstreamResponse.headers.get('cache-control');
    const contentType = upstreamResponse.headers.get('content-type') || 'application/octet-stream';

    if (cacheControl) {
      response.setHeader('Cache-Control', cacheControl);
    } else {
      response.setHeader('Cache-Control', 'public, max-age=3600');
    }

    response.setHeader('Content-Type', contentType);
    response.setHeader('Content-Length', Buffer.byteLength(Buffer.from(arrayBuffer)));
    response.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('[image-proxy] upstream fetch failed:', error);
    response.status(502).json({ message: 'Upstream image request failed.' });
  }
}
