import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'src/translations');
const postsMetaDirectory = path.join(process.cwd(), 'src/blog-meta');

// Helper function to convert title to URL-friendly slug
function titleToSlug(title) {
  const cyrillicMap = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
  };
  return title
    .toLowerCase()
    // Transliterate Cyrillic to Latin
    .replace(/[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]/g, (c) => cyrillicMap[c] || '')
    // Replace accented characters with their non-accented equivalents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace common special characters
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ß]/g, 'ss')
    .replace(/[æ]/g, 'ae')
    .replace(/[œ]/g, 'oe')
    // Remove remaining special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper: get English slug for a given postId (e.g., "post16")
function getEnglishSlugForPostId(postId) {
  try {
    const englishPath = path.join(postsDirectory, 'en', '_posts', `${postId}.md`);
    if (!fs.existsSync(englishPath)) return null;
    const englishContents = fs.readFileSync(englishPath, 'utf8');
    const { data } = matter(englishContents);
    const primary = data.slug ? String(data.slug).toLowerCase() : (data.title ? titleToSlug(data.title) : null);
    return primary && primary.length > 0 ? primary : postId;
  } catch (_) {
    return null;
  }
}

export function getBlogPostBySlug(slug, locale) {
  const fullPath = path.join(postsDirectory, locale, '_posts');
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.md'));
  
  // Find the post with matching slug (frontmatter slug preferred)
  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const postId = path.parse(file).name; // e.g., 'post1'
    const primarySlug = data.slug ? String(data.slug).toLowerCase() : (data.title ? titleToSlug(data.title) : null);
    let computedSlug = primarySlug && primarySlug.length > 0 ? primarySlug : postId;
    // For Hindi posts >= 11, use the English slug to keep slugs consistent and readable
    if (locale === 'hi') {
      const match = postId.match(/^post(\d+)$/i);
      const index = match ? parseInt(match[1], 10) : NaN;
      if (!Number.isNaN(index) && index >= 11) {
        const enSlug = getEnglishSlugForPostId(postId);
        if (enSlug) computedSlug = enSlug;
      }
    }
    if (computedSlug) {
      if (computedSlug === slug) {
        // Merge with shared metadata (by postId derived from filename)
        let sharedMeta = {};
        try {
          const metaPath = path.join(postsMetaDirectory, `${postId}.json`);
          if (fs.existsSync(metaPath)) {
            const raw = fs.readFileSync(metaPath, 'utf8');
            sharedMeta = JSON.parse(raw);
          }
        } catch (e) {
          // noop: fall back to frontmatter only
        }

        // Prefer shared meta for redundant fields; fall back to frontmatter
        const mergedMeta = {
          ...data,
          ...(sharedMeta || {}),
        };
        return {
          slug: computedSlug,
          meta: mergedMeta,
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
      // Merge with shared metadata (by postId derived from filename)
      const postId = path.parse(file).name; // e.g., 'post1'
      let sharedMeta = {};
      try {
        const metaPath = path.join(postsMetaDirectory, `${postId}.json`);
        if (fs.existsSync(metaPath)) {
          const raw = fs.readFileSync(metaPath, 'utf8');
          sharedMeta = JSON.parse(raw);
        }
      } catch (e) {
        // noop: fall back to frontmatter only
      }
      
      if (!data.title && !data.slug) {
        return null; // Skip posts without titles
      }
      
      // Compute slug from frontmatter or title; if empty after slugification (e.g., non-Latin titles),
      // fall back to the file name to ensure a stable, non-empty slug.
      const primarySlug = data.slug ? String(data.slug).toLowerCase() : titleToSlug(data.title);
      let titleSlug = primarySlug && primarySlug.length > 0 ? primarySlug : postId;
      // For Hindi posts >= 11, use the English slug to keep slugs consistent and readable
      if (locale === 'hi') {
        const match = postId.match(/^post(\d+)$/i);
        const index = match ? parseInt(match[1], 10) : NaN;
        if (!Number.isNaN(index) && index >= 11) {
          const enSlug = getEnglishSlugForPostId(postId);
          if (enSlug) titleSlug = enSlug;
        }
      }
      
      return {
        slug: titleSlug,
        meta: {
          ...data,
          ...(sharedMeta || {}),
        },
        content,
      };
    })
    .filter(Boolean)
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));

  return posts;
}

// Function to get related posts based on keywords and tags
export function getRelatedPosts(currentPost, locale, maxPosts = 4) {
  const allPosts = getAllBlogPosts(locale);
  
  // Filter out the current post
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  if (otherPosts.length === 0) {
    return [];
  }
  
  // Score posts based on keyword similarity
  const scoredPosts = otherPosts.map(post => {
    let score = 0;
    
    // Get keywords from both posts
    const currentKeywords = currentPost.meta.keywords ? 
      currentPost.meta.keywords.toLowerCase().split(',').map(k => k.trim()) : [];
    const postKeywords = post.meta.keywords ? 
      post.meta.keywords.toLowerCase().split(',').map(k => k.trim()) : [];
    
    // Score based on keyword overlap
    currentKeywords.forEach(keyword => {
      postKeywords.forEach(postKeyword => {
        if (keyword.includes(postKeyword) || postKeyword.includes(keyword)) {
          score += 2;
        }
      });
    });
    
    // Score based on title similarity (basic word matching)
    const currentTitleWords = currentPost.meta.title.toLowerCase().split(' ');
    const postTitleWords = post.meta.title.toLowerCase().split(' ');
    currentTitleWords.forEach(word => {
      if (word.length > 3 && postTitleWords.includes(word)) {
        score += 1;
      }
    });
    
    return {
      ...post,
      similarityScore: score
    };
  });
  
  // Sort by score (descending) and return top posts
  return scoredPosts
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, maxPosts);
}

export async function markdownToHtml(markdown) {
  const result = await remark().use(remarkGfm).use(html).process(markdown);
  return result.toString();
}
