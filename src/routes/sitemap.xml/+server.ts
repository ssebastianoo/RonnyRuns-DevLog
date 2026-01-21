import type { RequestHandler } from './$types';
import config from '../../config';
import type { MarkdownModule } from '$lib/types';

export const prerender = true;

const staticRoutes = ['/', '/social', '/about'];

type PostMeta = {
    slug: string;
    date: string;
    published: boolean;
};

export const GET: RequestHandler = async () => {
    const updated = new Date().toISOString();

    const modules = import.meta.glob<MarkdownModule>(
        '/src/posts/*.md',
        { eager: true }
    );

    const blogRoutes = Object.entries(modules)
        .map(([path, mod]) => {
            if (
                typeof mod !== 'object' ||
                !('metadata' in mod)
            ) return null;

            const slug = path.split('/').pop()?.replace('.md', '');
            if (!slug) return null;

            const meta = mod.metadata as Omit<PostMeta, 'slug'>;

            if (!meta.published) return null;

            return {
                loc: `/blog/${slug}`,
                lastmod: meta.date
            };
        })
        .filter(Boolean) as { loc: string; lastmod: string }[];

    const urls = [
        ...staticRoutes.map((path) => ({
            loc: path,
            lastmod: updated
        })),
        ...blogRoutes
    ];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
            .map(
                ({ loc, lastmod }) => `
	<url>
		<loc>${config.siteUrl}${loc}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>${loc === '/' ? '1.0' : '0.8'}</priority>
	</url>`
            )
            .join('')}
</urlset>`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
};
