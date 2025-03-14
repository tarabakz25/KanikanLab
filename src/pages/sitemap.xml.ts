import { getCollection } from 'astro:content';
import { getAllPosts } from '../lib/cosmic';

const SITE = 'https://kanikan.site';

export async function GET() {
  const posts = await getAllPosts();
  
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${SITE}</loc>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${SITE}/blog</loc>
        <priority>0.8</priority>
      </url>
      ${posts.map((post: any) => `
        <url>
          <loc>${SITE}/blog/${post.slug}</loc>
          <lastmod>${new Date(post.modified_at || post.created_at).toISOString()}</lastmod>
          <priority>0.7</priority>
        </url>
      `).join('')}
    </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
} 