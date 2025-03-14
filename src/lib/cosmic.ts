import { createBucketClient } from '@cosmicjs/sdk'

// Content type for blog posts in Cosmic CMS
// This might need to be adjusted based on your Cosmic CMS setup
const CONTENT_TYPE = 'posts';
const COSMIC_BUCKET_SLUG="my-project-production-671831c0-0083-11f0-8cb2-45ee86b76b4d"
const COSMIC_READ_KEY="o7WitYWb91SDZOMJV7q0Eov6Qu1i7w4GRRDlCQQUH39A3bPAzY"

// Create the Cosmic client
const cosmic = createBucketClient({
  bucketSlug: COSMIC_BUCKET_SLUG,
  readKey: COSMIC_READ_KEY
})

// Helper function to log errors
function logError(error: any, context: string) {
  console.error(`Cosmic CMS Error (${context}):`, error);
  if (error.response) {
    console.error('Response data:', error.response.data);
  }
}

// Get all posts from Cosmic CMS
export async function getAllPosts() {
  try {
    console.log(`Fetching all posts from Cosmic CMS with content type: ${CONTENT_TYPE}`);
    const data = await cosmic.objects
      .find({
        type: CONTENT_TYPE
      })
      .props('title,slug,metadata,created_at')
      .depth(1)
    
    console.log(`Found ${data.objects.length} posts`);
    return data.objects || [];
  } catch (error) {
    logError(error, 'getAllPosts');
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(slug: string) {
  try {
    console.log(`Fetching post with slug: ${slug}`);
    const data = await cosmic.objects
      .findOne({
        type: CONTENT_TYPE,
        slug: slug
      })
      .props('title,slug,metadata,content,created_at')
      .depth(1)
    
    return data.object;
  } catch (error) {
    logError(error, `getPostBySlug(${slug})`);
    return null;
  }
}

// Get posts by category
export async function getPostsByCategory(category: string, limit: number = 10, skip: number = 0) {
  try {
    console.log(`Fetching posts with category: ${category}`);
    const data = await cosmic.objects
      .find({
        type: CONTENT_TYPE,
        'metadata.categories': category
      })
      .props('title,slug,metadata,created_at')
      .depth(1)
      .limit(limit)
      .skip(skip)
    
    console.log(`Found ${data.objects.length} posts in category ${category}`);
    return data.objects || [];
  } catch (error) {
    logError(error, `getPostsByCategory(${category})`);
    return [];
  }
}

// Get paginated posts
export async function getPaginatedPosts(limit: number = 6, skip: number = 0) {
  try {
    console.log(`Fetching paginated posts: limit=${limit}, skip=${skip}`);
    const data = await cosmic.objects
      .find({
        type: CONTENT_TYPE
      })
      .props('title,slug,metadata,created_at')
      .depth(1)
      .limit(limit)
      .skip(skip)
      .sort('-created_at')
    
    // Get total count for pagination
    const allPosts = await cosmic.objects
      .find({
        type: CONTENT_TYPE
      })
      .props('id')
    
    const result = {
      posts: data.objects || [],
      total: allPosts.objects ? allPosts.objects.length : 0
    };
    
    console.log(`Found ${result.posts.length} posts (total: ${result.total})`);
    return result;
  } catch (error) {
    logError(error, 'getPaginatedPosts');
    return {
      posts: [],
      total: 0
    };
  }
}
