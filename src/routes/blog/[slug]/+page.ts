import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Post, MarkdownModule } from '$lib/types';

const posts = import.meta.glob<MarkdownModule>(
    '/src/posts/*.md'
);

export const load = (async ({ params }) => {
    const path = `/src/posts/${params.slug}.md`;
    const loader = posts[path];

    if (!loader)
        throw error(404, `Could not find ${params.slug}`);

    const post = await loader();

    return {
        content: post.default,
        meta: post.metadata,
        slug: params.slug
    };
}) satisfies PageLoad;
