import type { MetadataRoute } from 'next';
import { isPreviewMode } from '@/lib/site-mode';

export default function robots(): MetadataRoute.Robots {
  if (isPreviewMode()) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: undefined,
  };
}
