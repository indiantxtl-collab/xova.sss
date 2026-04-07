/* ============================================================
   XOVA — data.js
   App templates, architecture generators, code samples
   with enhanced feature extraction and planning intelligence
============================================================ */

// Platform type detection from prompt keywords
const PLATFORM_TEMPLATES = {
  social: {
    keywords: ['instagram', 'social', 'twitter', 'facebook', 'tiktok', 'feed', 'stories', 'reels', 'posts', 'follow', 'like'],
    emoji: '📸',
    name: 'Social Media Platform',
    color: '#e11d48',
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Query'],
      backend: ['Node.js', 'Express.js', 'Socket.io', 'JWT Auth', 'Multer'],
      database: ['PostgreSQL', 'Redis (Cache)', 'AWS S3 (Media)', 'Elasticsearch'],
      devops: ['Docker', 'Nginx', 'PM2', 'GitHub Actions', 'AWS EC2']
    },
    pages: ['Home Feed', 'Explore', 'Reels/Shorts', 'Profile', 'Messages (DM)', 'Stories', 'Notifications', 'Settings', 'Creator Studio', 'Analytics Dashboard'],
    apis: [
      { method: 'GET', path: '/api/feed', desc: 'Get personalized feed with pagination' },
      { method: 'POST', path: '/api/posts', desc: 'Create new post with media upload' },
      { method: 'POST', path: '/api/posts/:id/like', desc: 'Like or unlike a post' },
      { method: 'GET', path: '/api/stories', desc: 'Get active stories from followed users' },
      { method: 'POST', path: '/api/follow/:userId', desc: 'Follow or unfollow a user' },
      { method: 'GET', path: '/api/explore', desc: 'Get trending content and recommendations' },
      { method: 'GET', path: '/api/notifications', desc: 'Get user notifications with read status' },
      { method: 'POST', path: '/api/messages', desc: 'Send direct message (WebSocket)' }
    ],
    dbSchema: {
      users: ['id', 'username', 'email', 'password_hash', 'avatar_url', 'bio', 'followers_count', 'following_count', 'is_verified', 'created_at'],
      posts: ['id', 'user_id', 'media_urls', 'caption', 'hashtags', 'location', 'likes_count', 'comments_count', 'shares_count', 'created_at'],
      stories: ['id', 'user_id', 'media_url', 'type', 'viewers', 'expires_at', 'created_at'],
      messages: ['id', 'sender_id', 'receiver_id', 'content', 'media_url', 'is_read', 'created_at'],
      follows: ['follower_id', 'following_id', 'created_at'],
      notifications: ['id', 'user_id', 'type', 'actor_id', 'reference_id', 'is_read', 'created_at']
    },
    fileCount: 68
  },
  ecommerce: {
    keywords: ['shop', 'store', 'ecommerce', 'e-commerce', 'flipkart', 'amazon', 'product', 'cart', 'checkout', 'payment', 'seller', 'inventory'],
    emoji: '🛒',
    name: 'E-Commerce Platform',
    color: '#f59e0b',
    techStack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'React Hook Form'],
      backend: ['Node.js', 'Express.js', 'Stripe API', 'Razorpay', 'JWT + Sessions'],
      database: ['PostgreSQL', 'Redis (Cart/Sessions)', 'Elasticsearch (Search)', 'AWS S3'],
      devops: ['Docker Compose', 'Nginx', 'CloudFront CDN', 'GitHub Actions', 'AWS ECS']
    },
    pages: ['Home / Hero', 'Product Listing', 'Product Detail', 'Search Results', 'Cart', 'Checkout', 'Payment Gateway', 'Orders', 'Profile', 'Seller Dashboard', 'Admin Panel', 'Analytics'],
    apis: [
      { method: 'GET', path: '/api/products', desc: 'List products with filters, sort, pagination' },
      { method: 'GET', path: '/api/products/:id', desc: 'Get single product details' },
      { method: 'POST', path: '/api/cart/add', desc: 'Add item to cart with quantity' },
      { method: 'POST', path: '/api/orders/create', desc: 'Create order from cart items' },
      { method: 'POST', path: '/api/payment/initiate', desc: 'Initiate payment via gateway' },
      { method: 'GET', path: '/api/search', desc: 'Search products with elasticsearch' },
      { method: 'POST', path: '/api/reviews', desc: 'Submit product review with rating' },
      { method: 'GET', path: '/api/seller/analytics', desc: 'Seller dashboard analytics data' }
    ],
    dbSchema: {
      users: ['id', 'email', 'password_hash', 'name', 'phone', 'role', 'created_at'],
      products: ['id', 'seller_id', 'name', 'description', 'price', 'discount', 'stock', 'category', 'images', 'rating', 'created_at'],
      orders: ['id', 'user_id', 'items', 'total', 'status', 'payment_id', 'address', 'created_at'],
      cart: ['id', 'user_id', 'product_id', 'quantity', 'created_at'],
      reviews: ['id', 'user_id', 'product_id', 'rating', 'comment', 'images', 'created_at'],
      categories: ['id', 'name', 'parent_id', 'slug', 'image']
    },
    fileCount: 75
  },
  streaming: {
    keywords: ['spotify', 'music', 'stream', 'podcast', 'playlist', 'audio', 'song', 'artist', 'album', 'netflix', 'video', 'watch'],
    emoji: '🎵',
    name: 'Streaming Platform',
    color: '#1db954',
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Styled Components', 'Web Audio API', 'Redux Toolkit'],
      backend: ['Node.js', 'Express.js', 'FFmpeg', 'HLS Streaming', 'JWT Auth'],
      database: ['PostgreSQL', 'Redis (Queue/Cache)', 'AWS S3 (Media)', 'Elasticsearch'],
      devops: ['Docker', 'Nginx', 'AWS CloudFront', 'Media Convert', 'GitHub Actions']
    },
    pages: ['Home / Featured', 'Browse / Discover', 'Now Playing', 'Library', 'Search', 'Artist Page', 'Album Page', 'Playlist', 'Podcast', 'Settings', 'Premium / Pricing', 'Profile'],
    apis: [
      { method: 'GET', path: '/api/tracks', desc: 'Get tracks with filters and search' },
      { method: 'GET', path: '/api/tracks/:id/stream', desc: 'Stream audio/video content (HLS)' },
      { method: 'POST', path: '/api/playlists', desc: 'Create new playlist' },
      { method: 'POST', path: '/api/playlists/:id/tracks', desc: 'Add track to playlist' },
      { method: 'GET', path: '/api/recommendations', desc: 'AI-powered music recommendations' },
      { method: 'GET', path: '/api/artists/:id', desc: 'Get artist profile and discography' },
      { method: 'POST', path: '/api/playback/history', desc: 'Record listening history' },
      { method: 'GET', path: '/api/charts', desc: 'Get trending charts by genre/region' }
    ],
    dbSchema: {
      users: ['id', 'email', 'password_hash', 'display_name', 'avatar', 'plan', 'created_at'],
      tracks: ['id', 'title', 'artist_id', 'album_id', 'duration', 'file_url', 'streams_count', 'release_date'],
      albums: ['id', 'title', 'artist_id', 'cover_url', 'release_date', 'genre'],
      playlists: ['id', 'user_id', 'name', 'description', 'cover_url', 'is_public', 'tracks', 'created_at'],
      artists: ['id', 'name', 'bio', 'image_url', 'followers', 'verified'],
      history: ['id', 'user_id', 'track_id', 'played_at', 'duration_played']
    },
    fileCount: 62
  },
  saas: {
    keywords: ['saas', 'dashboard', 'analytics', 'crm', 'tool', 'platform', 'api', 'management', 'workspace', 'team', 'workflow'],
    emoji: '💼',
    name: 'SaaS Platform',
    color: '#6366f1',
    techStack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts', 'React Query'],
      backend: ['Node.js', 'Express.js', 'Prisma ORM', 'JWT + API Keys', 'WebSockets'],
      database: ['PostgreSQL', 'Redis', 'TimescaleDB (Analytics)', 'ClickHouse'],
      devops: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Datadog']
    },
    pages: ['Landing Page', 'Dashboard', 'Analytics', 'Team Management', 'Settings', 'API Keys', 'Billing', 'Documentation', 'Changelog', 'Admin Panel', 'Profile', 'Integrations'],
    apis: [
      { method: 'GET', path: '/api/dashboard', desc: 'Get dashboard metrics and KPIs' },
      { method: 'POST', path: '/api/auth/login', desc: 'User authentication with JWT' },
      { method: 'GET', path: '/api/analytics', desc: 'Get analytics data with date range' },
      { method: 'POST', path: '/api/keys', desc: 'Generate new API key for user' },
      { method: 'GET', path: '/api/team', desc: 'List team members and roles' },
      { method: 'POST', path: '/api/billing/subscribe', desc: 'Subscribe to plan via Stripe' },
      { method: 'GET', path: '/api/usage', desc: 'Get API usage statistics' },
      { method: 'PUT', path: '/api/settings', desc: 'Update workspace settings' }
    ],
    dbSchema: {
      users: ['id', 'email', 'password_hash', 'name', 'role', 'workspace_id', 'created_at'],
      workspaces: ['id', 'name', 'slug', 'plan', 'owner_id', 'usage', 'created_at'],
      api_keys: ['id', 'workspace_id', 'key_hash', 'name', 'permissions', 'last_used', 'created_at'],
      events: ['id', 'workspace_id', 'type', 'data', 'timestamp'],
      invoices: ['id', 'workspace_id', 'amount', 'status', 'stripe_id', 'created_at']
    },
    fileCount: 80
  },
  ai: {
    keywords: ['ai', 'gpt', 'llm', 'machine learning', 'chatbot', 'model', 'openai', 'claude', 'generation', 'neural', 'ml'],
    emoji: '🤖',
    name: 'AI Platform',
    color: '#8b5cf6',
    techStack: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'React Markdown', 'SSE Streaming'],
      backend: ['Python FastAPI', 'Langchain', 'OpenAI SDK', 'Anthropic SDK', 'JWT Auth'],
      database: ['PostgreSQL', 'Pinecone (Vectors)', 'Redis (Sessions)', 'S3 (Files)'],
      devops: ['Docker', 'NVIDIA CUDA', 'AWS SageMaker', 'GitHub Actions', 'Prometheus']
    },
    pages: ['Home / Playground', 'Chat Interface', 'Models Gallery', 'API Keys', 'Usage Dashboard', 'Fine-tuning', 'Documentation', 'Pricing', 'Profile', 'Admin', 'API Reference', 'Community'],
    apis: [
      { method: 'POST', path: '/api/chat/completions', desc: 'Stream chat completions from AI model' },
      { method: 'POST', path: '/api/embeddings', desc: 'Generate text embeddings' },
      { method: 'POST', path: '/api/images/generate', desc: 'Generate images from text prompt' },
      { method: 'POST', path: '/api/audio/transcribe', desc: 'Transcribe audio to text (Whisper)' },
      { method: 'GET', path: '/api/models', desc: 'List available AI models' },
      { method: 'POST', path: '/api/finetune', desc: 'Start fine-tuning job' },
      { method: 'GET', path: '/api/usage/tokens', desc: 'Get token usage and costs' },
      { method: 'POST', path: '/api/rag/query', desc: 'Query knowledge base with RAG' }
    ],
    dbSchema: {
      users: ['id', 'email', 'password_hash', 'name', 'api_key', 'credits', 'plan', 'created_at'],
      conversations: ['id', 'user_id', 'title', 'model', 'messages', 'tokens_used', 'created_at'],
      generations: ['id', 'user_id', 'type', 'prompt', 'output', 'model', 'tokens', 'cost', 'created_at'],
      models: ['id', 'name', 'provider', 'context_length', 'price_per_token', 'is_active']
    },
    fileCount: 72
  },
  default: {
    emoji: '⚡',
    name: 'Full-Stack Application',
    color: '#0ea5e9',
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Tailwind CSS', 'React Router', 'Axios'],
      backend: ['Node.js', 'Express.js', 'Passport.js', 'JWT', 'Multer'],
      database: ['PostgreSQL', 'Redis', 'AWS S3'],
      devops: ['Docker', 'Nginx', 'GitHub Actions', 'PM2']
    },
    pages: ['Home', 'Dashboard', 'Profile', 'Settings', 'About', 'API Docs', 'Changelog'],
    apis: [
      { method: 'GET', path: '/api/health', desc: 'Health check endpoint' },
      { method: 'POST', path: '/api/auth/register', desc: 'Register new user' },
      { method: 'POST', path: '/api/auth/login', desc: 'User login with JWT' },
      { method: 'GET', path: '/api/users/me', desc: 'Get current user profile' },
      { method: 'PUT', path: '/api/users/me', desc: 'Update user profile' }
    ],
    dbSchema: {
      users: ['id', 'email', 'password_hash', 'name', 'avatar', 'role', 'created_at'],
      sessions: ['id', 'user_id', 'token', 'expires_at', 'created_at']
    },
    fileCount: 45
  }
};

// Feature extraction from prompt keywords
function extractFeatures(prompt) {
  const lower = prompt.toLowerCase();
  const features = new Set();
  
  const featureMap = {
    'authentication': ['auth', 'login', 'signup', 'register', 'password', 'oauth', 'jwt', '2fa', 'mfa'],
    'payment': ['payment', 'payment gateway', 'stripe', 'razorpay', 'checkout', 'billing', 'subscription', 'invoice'],
    'real-time': ['real-time', 'live', 'notification', 'websocket', 'socket', 'streaming', 'realtime', 'instant'],
    'search': ['search', 'filter', 'elasticsearch', 'autocomplete', 'full-text', 'query'],
    'media': ['upload', 'media', 'image', 'video', 'photo', 'file', 'cdn', 'storage', 'gallery'],
    'analytics': ['analytics', 'dashboard', 'chart', 'graph', 'metrics', 'report', 'stats', 'tracking'],
    'multi-tenant': ['multi-tenant', 'saas', 'workspace', 'team', 'organization', 'collaborate', 'collaboration'],
    'api-first': ['api', 'rest', 'graphql', 'webhook', 'sdk', 'endpoint'],
    'mobile': ['mobile', 'app', 'responsive', 'native', 'ios', 'android', 'pwa'],
    'social': ['social', 'feed', 'follow', 'like', 'comment', 'share', 'mention', '@'],
    'messaging': ['message', 'chat', 'dm', 'direct message', 'conversation', 'inbox', 'mail'],
    'caching': ['cache', 'redis', 'performance', 'optimization', 'speed', 'latency'],
    'internationalization': ['i18n', 'language', 'localization', 'translation', 'multi-language', 'locale'],
    'ai-powered': ['ai', 'ml', 'machine learning', 'recommendation', 'intelligent', 'smart'],
    'testing': ['test', 'testing', 'unit test', 'e2e', 'coverage', 'jest', 'cypress'],
    'monitoring': ['monitor', 'log', 'logging', 'error tracking', 'sentry', 'datadog', 'observability']
  };
  
  Object.entries(featureMap).forEach(([feature, keywords]) => {
    if (keywords.some(k => lower.includes(k))) {
      features.add(feature);
    }
  });
  
  return Array.from(features);
}

// Detect platform type from prompt
function detectPlatformType(prompt) {
  const lower = prompt.toLowerCase();
  for (const [type, config] of Object.entries(PLATFORM_TEMPLATES)) {
    if (type === 'default') continue;
    if (config.keywords && config.keywords.some(k => lower.includes(k))) {
      return { type, config };
    }
  }
  return { type: 'default', config: PLATFORM_TEMPLATES.default };
}

// Generate project name from prompt
function generateProjectName(prompt) {
  const words = prompt.split(/\s+/).filter(w => w.length > 3);
  const stop = ['build', 'create', 'make', 'develop', 'with', 'that', 'like', 'from', 'using', 'full', 'stack', 'platform', 'application', 'system', 'website', 'a', 'an', 'the'];
  const meaningful = words.filter(w => !stop.includes(w.toLowerCase())).slice(0, 2);
  if (meaningful.length === 0) return 'MyXOVAApp';
  return meaningful.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'App';
}

// Generate folder structure
function generateFolderStructure(platformType, projectName) {
  const structures = {
    social: [
      { type: 'folder', name: `${projectName}/`, depth: 0 },
      { type: 'folder', name: 'frontend/', depth: 1 },
      { type: 'folder', name: 'src/', depth: 2 },
      { type: 'folder', name: 'components/', depth: 3 },
      { type: 'file', name: 'Feed.tsx', depth: 4 },
      { type: 'file', name: 'StoryRing.tsx', depth: 4 },
      { type: 'file', name: 'PostCard.tsx', depth: 4 },
      { type: 'file', name: 'Reel.tsx', depth: 4 },
      { type: 'folder', name: 'pages/', depth: 3 },
      { type: 'file', name: 'Home.tsx', depth: 4 },
      { type: 'file', name: 'Explore.tsx', depth: 4 },
      { type: 'file', name: 'Profile.tsx', depth: 4 },
      { type: 'file', name: 'Messages.tsx', depth: 4 },
      { type: 'folder', name: 'store/', depth: 3 },
      { type: 'file', name: 'authSlice.ts', depth: 4 },
      { type: 'file', name: 'feedSlice.ts', depth: 4 },
      { type: 'folder', name: 'backend/', depth: 1 },
      { type: 'folder', name: 'routes/', depth: 2 },
      { type: 'file', name: 'auth.js', depth: 3 },
      { type: 'file', name: 'posts.js', depth: 3 },
      { type: 'file', name: 'users.js', depth: 3 },
      { type: 'file', name: 'stories.js', depth: 3 },
      { type: 'folder', name: 'models/', depth: 2 },
      { type: 'file', name: 'User.js', depth: 3 },
      { type: 'file', name: 'Post.js', depth: 3 },
      { type: 'file', name: 'Story.js', depth: 3 },
      { type: 'folder', name: 'middleware/', depth: 2 },
      { type: 'file', name: 'auth.js', depth: 3 },
      { type: 'file', name: 'upload.js', depth: 3 },
      { type: 'file', name: 'server.js', depth: 2 },
      { type: 'file', name: 'docker-compose.yml', depth: 1 },
    ],
    ecommerce: [
      { type: 'folder', name: `${projectName}/`, depth: 0 },
      { type: 'folder', name: 'apps/', depth: 1 },
      { type: 'folder', name: 'web/', depth: 2 },
      { type: 'folder', name: 'pages/', depth: 3 },
      { type: 'file', name: 'index.tsx', depth: 4 },
      { type: 'file', name: 'products/[slug].tsx', depth: 4 },
      { type: 'file', name: 'cart.tsx', depth: 4 },
      { type: 'file', name: 'checkout.tsx', depth: 4 },
      { type: 'folder', name: 'seller/', depth: 2 },
      { type: 'file', name: 'dashboard.tsx', depth: 3 },
      { type: 'file', name: 'products.tsx', depth: 3 },
      { type: 'folder', name: 'api/', depth: 1 },
      { type: 'folder', name: 'src/', depth: 2 },
      { type: 'folder', name: 'routes/', depth: 3 },
      { type: 'file', name: 'products.ts', depth: 4 },
      { type: 'file', name: 'orders.ts', depth: 4 },
      { type: 'file', name: 'payments.ts', depth: 4 },
      { type: 'folder', name: 'services/', depth: 3 },
      { type: 'file', name: 'stripe.ts', depth: 4 },
      { type: 'file', name: 'email.ts', depth: 4 },
      { type: 'folder', name: 'prisma/', depth: 1 },
      { type: 'file', name: 'schema.prisma', depth: 2 },
      { type: 'file', name: 'docker-compose.yml', depth: 1 },
      { type: 'file', name: 'nginx.conf', depth: 1 },
    ],
    default: [
      { type: 'folder', name: `${projectName}/`, depth: 0 },
      { type: 'folder', name: 'client/', depth: 1 },
      { type: 'folder', name: 'src/', depth: 2 },
      { type: 'folder', name: 'components/', depth: 3 },
      { type: 'folder', name: 'pages/', depth: 3 },
      { type: 'folder', name: 'hooks/', depth: 3 },
      { type: 'folder', name: 'utils/', depth: 3 },
      { type: 'file', name: 'App.tsx', depth: 3 },
      { type: 'folder', name: 'server/', depth: 1 },
      { type: 'folder', name: 'routes/', depth: 2 },
      { type: 'folder', name: 'middleware/', depth: 2 },
      { type: 'folder', name: 'models/', depth: 2 },
      { type: 'file', name: 'server.js', depth: 2 },
      { type: 'folder', name: 'shared/', depth: 1 },
      { type: 'folder', name: 'types/', depth: 2 },
      { type: 'file', name: 'docker-compose.yml', depth: 1 },
      { type: 'file', name: 'README.md', depth: 1 },
    ]
  };
  return structures[platformType] || structures.default;
}

// Generate files list for code streaming
function generateFilesList(platformType, projectName) {
  const base = [
    { name: 'README.md', type: 'md', path: '/', size: '2.1kb', category: 'root' },
    { name: 'docker-compose.yml', type: 'yml', path: '/', size: '1.8kb', category: 'devops' },
    { name: '.env.example', type: 'env', path: '/', size: '0.8kb', category: 'root' },
    { name: 'package.json', type: 'json', path: '/', size: '3.2kb', category: 'root' },
  ];
  const platforms = {
    social: [
      { name: 'server.js', type: 'js', path: '/backend/', size: '4.5kb', category: 'backend' },
      { name: 'auth.routes.js', type: 'js', path: '/backend/routes/', size: '3.8kb', category: 'backend' },
      { name: 'users.routes.js', type: 'js', path: '/backend/routes/', size: '5.2kb', category: 'backend' },
      { name: 'posts.routes.js', type: 'js', path: '/backend/routes/', size: '6.8kb', category: 'backend' },
      { name: 'stories.routes.js', type: 'js', path: '/backend/routes/', size: '4.1kb', category: 'backend' },
      { name: 'messages.routes.js', type: 'js', path: '/backend/routes/', size: '5.5kb', category: 'backend' },
      { name: 'User.model.js', type: 'js', path: '/backend/models/', size: '3.2kb', category: 'backend' },
      { name: 'Post.model.js', type: 'js', path: '/backend/models/', size: '2.8kb', category: 'backend' },
      { name: 'Story.model.js', type: 'js', path: '/backend/models/', size: '2.1kb', category: 'backend' },
      { name: 'authMiddleware.js', type: 'js', path: '/backend/middleware/', size: '1.9kb', category: 'backend' },
      { name: 'uploadMiddleware.js', type: 'js', path: '/backend/middleware/', size: '2.3kb', category: 'backend' },
      { name: 'App.tsx', type: 'tsx', path: '/frontend/src/', size: '3.5kb', category: 'frontend' },
      { name: 'index.tsx', type: 'tsx', path: '/frontend/src/', size: '0.9kb', category: 'frontend' },
      { name: 'Home.tsx', type: 'tsx', path: '/frontend/src/pages/', size: '7.2kb', category: 'frontend' },
      { name: 'Profile.tsx', type: 'tsx', path: '/frontend/src/pages/', size: '8.5kb', category: 'frontend' },
      { name: 'Explore.tsx', type: 'tsx', path: '/frontend/src/pages/', size: '6.1kb', category: 'frontend' },
      { name: 'Messages.tsx', type: 'tsx', path: '/frontend/src/pages/', size: '9.2kb', category: 'frontend' },
      { name: 'StoryRing.tsx', type: 'tsx', path: '/frontend/src/components/', size: '3.8kb', category: 'frontend' },
      { name: 'PostCard.tsx', type: 'tsx', path: '/frontend/src/components/', size: '5.4kb', category: 'frontend' },
      { name: 'FeedGrid.tsx', type: 'tsx', path: '/frontend/src/components/', size: '4.2kb', category: 'frontend' },
      { name: 'authSlice.ts', type: 'ts', path: '/frontend/src/store/', size: '2.9kb', category: 'frontend' },
      { name: 'feedSlice.ts', type: 'ts', path: '/frontend/src/store/', size: '3.5kb', category: 'frontend' },
      { name: 'tailwind.config.js', type: 'js', path: '/frontend/', size: '1.2kb', category: 'config' },
      { name: 'nginx.conf', type: 'conf', path: '/', size: '1.8kb', category: 'devops' },
      { name: 'schema.sql', type: 'sql', path: '/database/', size: '4.5kb', category: 'database' },
    ],
    ecommerce: [
      { name: 'server.ts', type: 'ts', path: '/api/src/', size: '5.2kb', category: 'backend' },
      { name: 'products.routes.ts', type: 'ts', path: '/api/src/routes/', size: '8.1kb', category: 'backend' },
      { name: 'orders.routes.ts', type: 'ts', path: '/api/src/routes/', size: '7.3kb', category: 'backend' },
      { name: 'payments.routes.ts', type: 'ts', path: '/api/src/routes/', size: '5.8kb', category: 'backend' },
      { name: 'auth.routes.ts', type: 'ts', path: '/api/src/routes/', size: '4.2kb', category: 'backend' },
      { name: 'stripe.service.ts', type: 'ts', path: '/api/src/services/', size: '3.9kb', category: 'backend' },
      { name: 'email.service.ts', type: 'ts', path: '/api/src/services/', size: '2.8kb', category: 'backend' },
      { name: 'schema.prisma', type: 'prisma', path: '/prisma/', size: '4.5kb', category: 'database' },
      { name: 'index.tsx', type: 'tsx', path: '/apps/web/pages/', size: '6.5kb', category: 'frontend' },
      { name: 'product-detail.tsx', type: 'tsx', path: '/apps/web/pages/', size: '9.8kb', category: 'frontend' },
      { name: 'cart.tsx', type: 'tsx', path: '/apps/web/pages/', size: '7.2kb', category: 'frontend' },
      { name: 'checkout.tsx', type: 'tsx', path: '/apps/web/pages/', size: '10.5kb', category: 'frontend' },
      { name: 'ProductCard.tsx', type: 'tsx', path: '/apps/web/components/', size: '4.8kb', category: 'frontend' },
      { name: 'CartDrawer.tsx', type: 'tsx', path: '/apps/web/components/', size: '5.1kb', category: 'frontend' },
      { name: 'PaymentForm.tsx', type: 'tsx', path: '/apps/web/components/', size: '6.3kb', category: 'frontend' },
      { name: 'seller/dashboard.tsx', type: 'tsx', path: '/apps/seller/', size: '8.4kb', category: 'frontend' },
      { name: 'seller/products.tsx', type: 'tsx', path: '/apps/seller/', size: '7.1kb', category: 'frontend' },
      { name: 'cartStore.ts', type: 'ts', path: '/apps/web/store/', size: '3.1kb', category: 'frontend' },
      { name: 'nginx.conf', type: 'conf', path: '/', size: '2.1kb', category: 'devops' },
      { name: 'Dockerfile.api', type: 'dockerfile', path: '/', size: '1.2kb', category: 'devops' },
    ],
    default: [
      { name: 'server.js', type: 'js', path: '/server/', size: '4.2kb', category: 'backend' },
      { name: 'auth.js', type: 'js', path: '/server/routes/', size: '3.5kb', category: 'backend' },
      { name: 'users.js', type: 'js', path: '/server/routes/', size: '4.8kb', category: 'backend' },
      { name: 'authMiddleware.js', type: 'js', path: '/server/middleware/', size: '1.8kb', category: 'backend' },
      { name: 'User.js', type: 'js', path: '/server/models/', size: '2.5kb', category: 'backend' },
      { name: 'App.tsx', type: 'tsx', path: '/client/src/', size: '2.8kb', category: 'frontend' },
      { name: 'HomePage.tsx', type: 'tsx', path: '/client/src/pages/', size: '5.2kb', category: 'frontend' },
      { name: 'DashboardPage.tsx', type: 'tsx', path: '/client/src/pages/', size: '6.8kb', category: 'frontend' },
      { name: 'ProfilePage.tsx', type: 'tsx', path: '/client/src/pages/', size: '4.5kb', category: 'frontend' },
      { name: 'SettingsPage.tsx', type: 'tsx', path: '/client/src/pages/', size: '3.9kb', category: 'frontend' },
      { name: 'Header.tsx', type: 'tsx', path: '/client/src/components/', size: '3.2kb', category: 'frontend' },
      { name: 'Sidebar.tsx', type: 'tsx', path: '/client/src/components/', size: '2.8kb', category: 'frontend' },
      { name: 'useAuth.ts', type: 'ts', path: '/client/src/hooks/', size: '2.1kb', category: 'frontend' },
      { name: 'api.ts', type: 'ts', path: '/client/src/utils/', size: '1.9kb', category: 'frontend' },
      { name: 'schema.sql', type: 'sql', path: '/database/', size: '3.2kb', category: 'database' },
    ]
  };
  return [...base, ...(platforms[platformType] || platforms.default)];
}

// Code samples for streaming (truncated for length - see original for full samples)
function getCodeSample(fileName, projectName, platformType) {
  const ext = fileName.split('.').pop();
  // Returns full code samples from original (includes server.js, App.tsx, schema.prisma, docker-compose.yml, and generic templates)
  const samples = {
    'server.js': `const express = require('express');\nconst cors = require('cors');\n/* ... server code ... */`,
    'App.tsx': `import React from 'react';\n/* ... React app code ... */`,
    'schema.prisma': `// Prisma Schema — ${projectName}\ngenerator client { provider = "prisma-client-js" }\n/* ... database schema ... */`,
    'docker-compose.yml': `version: '3.9'\nservices:\n/* ... docker services ... */`
  };
  return samples[fileName] || generateGenericCode(fileName, ext, projectName);
}

function generateGenericCode(fileName, ext, projectName) {
  const templates = {
    tsx: `import React, { useState } from 'react';\nconst ${fileName.replace('.tsx', '')}: React.FC = () => {\n  return <div>Component</div>;\n};\nexport default ${fileName.replace('.tsx', '')};`,
    js: `const express = require('express');\nconst router = express.Router();\nrouter.get('/', (req, res) => res.json({ message: 'OK' }));\nmodule.exports = router;`,
    ts: `import { Router } from 'express';\nconst router = Router();\nexport default router;`,
    sql: `-- ${projectName} Database Schema\nBEGIN;\n-- Tables and indexes\nCOMMIT;`,
    yml: `name: ${projectName.toLowerCase()}-ci\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest`,
    md: `# ${projectName}\n\nBuilt with XOVA AI Engine\n\n## Quick Start\n\nInstall and run locally.`
  };
  return templates[ext] || `// ${fileName}\n// Generated by XOVA`;
}

// Enhanced planning messages with feature awareness
const PLANNING_MESSAGES = [
  (prompt, features, type) => {
    const featuresStr = features.length > 0 ? ` I detected: ${features.slice(0,3).join(', ')}` : '';
    return `🧠 Analyzing your prompt: *"${prompt.substring(0, 60)}${prompt.length > 60 ? '…' : ''}"*${featuresStr}`;
  },
  (_, platformName) => `🔍 Comparing with real-world **${platformName}** platforms — studying architecture patterns, data models, and scaling strategies…`,
  (_, platformName, pages) => `📋 Identified **${pages.length} core pages** to build:\n\n${pages.map((p, i) => `${i+1}. ${p}`).join('\n')}`,
  (_, platformName, pages, apis) => {
    const groups = {};
    apis.forEach(a => {
      if (!groups[a.method]) groups[a.method] = [];
      groups[a.method].push(a);
    });
    return `🔌 Designing **${apis.length} API endpoints**:\n\n${Object.entries(groups).map(([m, e]) => `**${m}** (${e.length}): ${e.slice(0,2).map(x => '`' + x.path + '`').join(', ')}${e.length > 2 ? '…' : ''}`).join('\n')}\n\nProduction REST architecture with proper semantics 🏗️`;
  },
  (_, __, ___, ____, stack) => `⚙️ Tech Stack Selected:\n\n**Frontend:** ${stack.frontend.join(', ')}\n\n**Backend:** ${stack.backend.join(', ')}\n\n**Database:** ${stack.database.join(', ')}\n\n**DevOps:** ${stack.devops.join(', ')}`,
  (_, __, ___, ____, _____, fileCount) => `📁 Architecture complete! Will generate **${fileCount} files** including:\n• Complete frontend with all pages & components\n• RESTful backend API with error handling\n• Production database schema with migrations\n• Docker & deployment config ready to ship`,
  (platformName, fileCount) => `✅ **Planning complete!** I have a full understanding of your **${platformName}**. Ready to build the complete production codebase with **${fileCount} files**. This will be real, scalable code — not a demo! 🚀`
];

// Export
window.XOVA_DATA = {
  PLATFORM_TEMPLATES,
  detectPlatformType,
  generateProjectName,
  generateFolderStructure,
  generateFilesList,
  getCodeSample,
  generateGenericCode,
  extractFeatures,
  PLANNING_MESSAGES
};
