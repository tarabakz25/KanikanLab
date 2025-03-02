import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the content directory path
const contentDir = path.join(__dirname, '..', '..', 'content', 'blog');

export async function post({ request }) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Title and content are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Create a slug from the title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Format the date
    const pubDate = data.pubDate || new Date().toISOString().split('T')[0];
    
    // Create the frontmatter
    const frontmatter = `---
title: '${data.title.replace(/'/g, "\\'")}'
description: '${(data.description || '').replace(/'/g, "\\'")}'
pubDate: '${pubDate}'
${data.category ? `category: '${data.category.replace(/'/g, "\\'")}'\n` : ''}heroImage: '/src/assets/image-template.png'
---

${data.content}`;
    
    // Ensure the content directory exists
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    // Write the file
    const filePath = path.join(contentDir, `${slug}.md`);
    fs.writeFileSync(filePath, frontmatter);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Blog post created successfully',
      slug: slug
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
