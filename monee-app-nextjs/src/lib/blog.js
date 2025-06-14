import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/translations');

// Helper function to convert title to URL-friendly slug
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export function getBlogPostSlugs(locale) {
  const fullPath = path.join(postsDirectory, locale, '_posts');
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.md'));
  const slugs = [];
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    if (data.title) {
      const titleSlug = titleToSlug(data.title);
      slugs.push(titleSlug);
    }
  });
  
  return slugs;
}

export function getBlogPostBySlug(slug, locale) {
  const fullPath = path.join(postsDirectory, locale, '_posts');
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.md'));
  
  // Find the post with matching title-based slug
  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    if (data.title) {
      const titleSlug = titleToSlug(data.title);
      if (titleSlug === slug) {
        return {
          slug: titleSlug,
          meta: data,
          content,
        };
      }
    }
  }
  
  return null;
}

export function getAllBlogPosts(locale) {
  const fullPath = path.join(postsDirectory, locale, '_posts');
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.md'));
  
  const posts = files
    .map((file) => {
      const filePath = path.join(fullPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      if (!data.title) {
        return null; // Skip posts without titles
      }
      
      const titleSlug = titleToSlug(data.title);
      
      return {
        slug: titleSlug,
        meta: data,
        content,
      };
    })
    .filter(Boolean)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return posts;
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
