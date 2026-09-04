import { type CollectionEntry } from 'astro:content';
import { slugify } from './common-utils';

export function sortItemsByDateDesc(itemA: CollectionEntry<'blog' | 'projects'>, itemB: CollectionEntry<'blog' | 'projects'>) {
    return new Date(itemB.data.publishDate).getTime() - new Date(itemA.data.publishDate).getTime();
}

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: slugify(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: CollectionEntry<'blog'>[], tagId: string) {
    const filteredPosts: CollectionEntry<'blog'>[] = posts.filter((post) => (post.data.tags || []).map((tag) => slugify(tag)).includes(tagId));
    return filteredPosts;
}

export function getAllToolTags(projects: CollectionEntry<'projects'>[]) {
    const tools: string[] = [...new Set(projects.flatMap((project) => project.data.tools || []).filter(Boolean))];
    return tools
        .map((tool) => ({ name: tool, id: slugify(tool) }))
        .filter((obj, pos, arr) => arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos);
}

export function getProjectsByTool(projects: CollectionEntry<'projects'>[], tagId: string) {
    return projects.filter((project) => (project.data.tools || []).map((tool) => slugify(tool)).includes(tagId));
}
