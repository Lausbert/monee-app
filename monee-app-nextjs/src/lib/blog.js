import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/translations');

export function getBlogPostSlugs(locale) {
  const fullPath = path.join(postsDirectory, locale, '_posts');
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  return fs.readdirSync(fullPath).filter(file => file.endsWith('.md'));
}

export function getBlogPostBySlug(slug, locale) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, locale, '_posts', `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: data,
    content,
  };
}

export function getAllBlogPosts(locale) {
  const slugs = getBlogPostSlugs(locale);
  
  const posts = slugs
    .map((slug) => getBlogPostBySlug(slug, locale))
    .filter(Boolean)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return posts;
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
