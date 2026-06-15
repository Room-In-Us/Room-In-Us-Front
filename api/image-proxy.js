import { fetchAllowedImage, ImageProxyError, normalizeImageUrl } from '../server/imageProxy.mjs';

export default async function handler(request, response) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    response.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const proxiedImage = await fetchAllowedImage(normalizeImageUrl(request.query?.url));

    response.setHeader('Cache-Control', proxiedImage.cacheControl);
    response.setHeader('Content-Type', proxiedImage.contentType);
    response.setHeader('Content-Length', proxiedImage.buffer.byteLength);

    if (proxiedImage.etag) {
      response.setHeader('ETag', proxiedImage.etag);
    }

    if (proxiedImage.lastModified) {
      response.setHeader('Last-Modified', proxiedImage.lastModified);
    }

    if (request.method === 'HEAD') {
      response.status(200).end();
      return;
    }

    response.status(200).send(proxiedImage.buffer);
  } catch (error) {
    if (error instanceof ImageProxyError) {
      response.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error('[image-proxy] upstream fetch failed:', error);
    response.status(502).json({ message: 'Upstream image request failed.' });
  }
}
