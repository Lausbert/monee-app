import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/translations');

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

    const computedSlug = data.slug ? String(data.slug).toLowerCase() : (data.title ? titleToSlug(data.title) : null);
    if (computedSlug) {
      if (computedSlug === slug) {
        return {
          slug: computedSlug,
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
      
      if (!data.title && !data.slug) {
        return null; // Skip posts without titles
      }
      
      const titleSlug = data.slug ? String(data.slug).toLowerCase() : titleToSlug(data.title);
      
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

// Function to get related posts based on keywords and tags
export function getRelatedPosts(currentPost, locale, maxPosts = 2) {
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
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
