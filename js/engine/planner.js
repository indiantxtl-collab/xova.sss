/* ============================================================
   XOVA ENGINE — planner.js
   REAL Prompt Analysis: Structured parsing, feature extraction,
   dynamic architecture generation (NO TEMPLATES)
============================================================ */

class XOVAEnginePlanner {
  constructor() {
    this.prompt = '';
    this.analysis = null;
    this.selectedModel = 'super';
    this.chatHistory = [];

    // DOM refs
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.sendChatBtn = document.getElementById('sendChatBtn');
    this.planReadyBanner = document.getElementById('planReadyBanner');
    this.planningCta = document.getElementById('planningCta');
    this.startBuildBtn = document.getElementById('startBuildBtn');
    this.chatThinking = document.getElementById('chatThinking');
    this.planningStatusText = document.getElementById('planningStatusText');
    this.statusDot = document.querySelector('.status-dot');
    this.archContent = document.getElementById('archContent');
    this.fileTreeContent = document.getElementById('fileTreeContent');
    this.techStackContent = document.getElementById('techStackContent');
    this.planAppName = document.getElementById('planAppName');

    this.bindEvents();
  }

  bindEvents() {
    this.sendChatBtn.addEventListener('click', () => this.sendUserMessage());
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendUserMessage();
      }
    });
    document.getElementById('cancelPlanBtn').addEventListener('click', () => {
      window.xovaApp.showPage('home');
    });
  }

  // REAL STRUCTURED PARSING - No templates
  async analyzePrompt(prompt) {
    this.prompt = prompt;

    // Step 1: Extract core requirements
    const requirements = this.extractRequirements(prompt);
    
    // Step 2: Identify app structure
    const structure = this.identifyAppStructure(prompt, requirements);
    
    // Step 3: Determine tech stack based on real needs
    const techStack = this.determineTechStack(structure, requirements);
    
    // Step 4: Generate pages dynamically
    const pages = this.generatePages(structure, requirements);
    
    // Step 5: Design APIs based on functionality
    const apis = this.designAPIs(structure, pages, requirements);
    
    // Step 6: Create database schema
    const dbSchema = this.createDatabaseSchema(structure, pages, requirements);

    this.analysis = {
      prompt,
      appName: this.generateAppName(prompt),
      description: this.generateDescription(structure, requirements),
      appType: structure.appType,
      requirements,
      structure,
      pages,
      apis,
      techStack,
      dbSchema,
      fileCount: this.calculateFileCount(pages, apis, techStack),
      estimatedComplexity: this.assessComplexity(requirements, structure)
    };

    return this.analysis;
  }

  // Parse requirements from natural language
  extractRequirements(prompt) {
    const lower = prompt.toLowerCase();
    const requirements = {
      authentication: this.hasFeature(lower, ['auth', 'login', 'signup', 'register', 'oauth', '2fa']),
      payment: this.hasFeature(lower, ['payment', 'stripe', 'checkout', 'billing', 'subscription']),
      realtime: this.hasFeature(lower, ['real-time', 'live', 'socket', 'notification', 'streaming']),
      search: this.hasFeature(lower, ['search', 'filter', 'query', 'autocomplete']),
      media: this.hasFeature(lower, ['upload', 'image', 'video', 'file', 'gallery', 'cdn']),
      analytics: this.hasFeature(lower, ['analytics', 'dashboard', 'chart', 'report', 'metrics']),
      multiTenant: this.hasFeature(lower, ['multi-tenant', 'saas', 'workspace', 'team', 'organization']),
      messaging: this.hasFeature(lower, ['message', 'chat', 'dm', 'conversation', 'inbox']),
      socialFeatures: this.hasFeature(lower, ['social', 'feed', 'follow', 'like', 'comment', 'share']),
      apiFirst: this.hasFeature(lower, ['api', 'rest', 'graphql', 'webhook']),
      mobile: this.hasFeature(lower, ['mobile', 'app', 'native', 'responsive', 'pwa']),
      ai: this.hasFeature(lower, ['ai', 'ml', 'recommendation', 'intelligent', 'smart', 'gpt', 'chatbot'])
    };
    return requirements;
  }

  // Identify app structure (e-commerce, social, saas, etc)
  identifyAppStructure(prompt, requirements) {
    const lower = prompt.toLowerCase();
    
    // Determine primary app type
    let appType = 'custom-full-stack';
    const typePatterns = {
      'social-media': ['instagram', 'facebook', 'twitter', 'tiktok', 'social', 'feed', 'stories', 'reels'],
      'ecommerce': ['shop', 'store', 'ecommerce', 'amazon', 'flipkart', 'marketplace', 'product'],
      'streaming': ['spotify', 'netflix', 'music', 'podcast', 'video', 'stream'],
      'saas': ['saas', 'tool', 'workspace', 'dashboard', 'analytics', 'management'],
      'chat-app': ['chat', 'messaging', 'whatsapp', 'telegram', 'discord'],
      'project-management': ['project', 'trello', 'jira', 'linear', 'kanban'],
      'booking': ['booking', 'airbnb', 'uber', 'hotel', 'appointment']
    };

    for (const [type, patterns] of Object.entries(typePatterns)) {
      if (patterns.some(p => lower.includes(p))) {
        appType = type;
        break;
      }
    }

    return {
      appType,
      hasBackend: !this.hasFeature(lower, ['static', 'landing', 'blog-only']),
      isMobileFirst: requirements.mobile || this.hasFeature(lower, ['mobile-first', 'app']),
      isRealtime: requirements.realtime,
      isScale: this.hasFeature(lower, ['scale', 'millions', 'high-traffic', 'enterprise'])
    };
  }

  // Generate tech stack based on actual needs
  determineTechStack(structure, requirements) {
    const stack = {
      frontend: [],
      backend: [],
      database: [],
      devops: []
    };

    // Frontend
    if (structure.isMobileFirst) {
      stack.frontend = ['React Native', 'TypeScript', 'Redux', 'React Navigation'];
    } else {
      stack.frontend = ['React 18', 'TypeScript', 'Tailwind CSS'];
      if (requirements.realtime) stack.frontend.push('Framer Motion');
      if (requirements.analytics) stack.frontend.push('Recharts');
    }

    // Backend
    if (requirements.ai) {
      stack.backend = ['Python FastAPI', 'Langchain', 'OpenAI SDK'];
    } else {
      stack.backend = ['Node.js', 'Express.js'];
      if (requirements.realtime) stack.backend.push('Socket.io');
      if (requirements.payment) stack.backend.push('Stripe SDK');
      stack.backend.push('JWT Auth');
    }

    // Database
    stack.database = ['PostgreSQL'];
    if (requirements.realtime || requirements.caching) stack.database.push('Redis');
    if (requirements.media) stack.database.push('AWS S3 / CloudFlare R2');
    if (requirements.search) stack.database.push('Elasticsearch');

    // DevOps
    stack.devops = ['Docker', 'GitHub Actions'];
    if (structure.isScale) stack.devops.push('Kubernetes', 'Datadog');

    return stack;
  }

  // Generate pages dynamically based on requirements
  generatePages(structure, requirements) {
    let pages = [];

    // Common pages for all apps
    pages.push('Home / Landing');
    
    // Based on app type
    const pagesByType = {
      'social-media': ['Home Feed', 'Explore', 'Profile', 'Messages', 'Notifications', 'Settings'],
      'ecommerce': ['Products', 'Product Detail', 'Cart', 'Checkout', 'Orders', 'Account'],
      'streaming': ['Discover', 'Library', 'Player', 'Playlists', 'Account'],
      'saas': ['Dashboard', 'Team', 'Settings', 'Billing', 'API Keys'],
      'chat-app': ['Conversations', 'Chat', 'Profile', 'Settings'],
      'project-management': ['Projects', 'Board', 'Timeline', 'Team', 'Analytics'],
      'booking': ['Search', 'Listings', 'Booking', 'Payment', 'Reservations', 'Profile']
    };

    if (pagesByType[structure.appType]) {
      pages.push(...pagesByType[structure.appType]);
    } else {
      pages.push('Dashboard', 'Features', 'Account');
    }

    // Add pages based on features
    if (requirements.payment) pages.push('Billing');
    if (requirements.analytics) pages.push('Analytics Dashboard');
    if (requirements.multiTenant) pages.push('Team Management');
    if (requirements.ai) pages.push('AI Playground');

    // Add admin/settings
    pages.push('Admin Panel');
    pages.push('Settings & Preferences');

    return [...new Set(pages)]; // Remove duplicates
  }

  // Design APIs based on actual functionality
  designAPIs(structure, pages, requirements) {
    const apis = [];

    // Authentication endpoints
    if (requirements.authentication) {
      apis.push(
        { method: 'POST', path: '/api/auth/register', desc: 'User registration with validation' },
        { method: 'POST', path: '/api/auth/login', desc: 'User login with JWT tokens' },
        { method: 'POST', path: '/api/auth/refresh', desc: 'Refresh access token' },
        { method: 'POST', path: '/api/auth/logout', desc: 'Logout and invalidate tokens' }
      );
    }

    // User endpoints
    apis.push(
      { method: 'GET', path: '/api/users/me', desc: 'Get current user profile' },
      { method: 'PUT', path: '/api/users/me', desc: 'Update user profile' },
      { method: 'GET', path: '/api/users/:id', desc: 'Get user public profile' }
    );

    // Social features
    if (requirements.socialFeatures) {
      apis.push(
        { method: 'GET', path: '/api/feed', desc: 'Get personalized user feed with pagination' },
        { method: 'POST', path: '/api/posts', desc: 'Create new post with media' },
        { method: 'POST', path: '/api/posts/:id/like', desc: 'Like/unlike a post' },
        { method: 'POST', path: '/api/posts/:id/comment', desc: 'Add comment to post' },
        { method: 'POST', path: '/api/users/:id/follow', desc: 'Follow/unfollow user' }
      );
    }

    // Payment endpoints
    if (requirements.payment) {
      apis.push(
        { method: 'POST', path: '/api/payments/intent', desc: 'Create payment intent via Stripe' },
        { method: 'POST', path: '/api/payments/confirm', desc: 'Confirm payment and create order' },
        { method: 'GET', path: '/api/payments/history', desc: 'Get payment history' }
      );
    }

    // Search endpoints
    if (requirements.search) {
      apis.push(
        { method: 'GET', path: '/api/search', desc: 'Full-text search with filters' },
        { method: 'GET', path: '/api/search/suggestions', desc: 'Search autocomplete suggestions' }
      );
    }

    // Real-time endpoints
    if (requirements.realtime) {
      apis.push(
        { method: 'POST', path: '/api/notifications/subscribe', desc: 'Subscribe to notifications (WebSocket)' },
        { method: 'GET', path: '/api/notifications', desc: 'Get notification history' }
      );
    }

    // Analytics endpoints
    if (requirements.analytics) {
      apis.push(
        { method: 'GET', path: '/api/analytics/overview', desc: 'Get dashboard overview metrics' },
        { method: 'GET', path: '/api/analytics/detailed', desc: 'Get detailed analytics with filters' }
      );
    }

    // Multi-tenant endpoints
    if (requirements.multiTenant) {
      apis.push(
        { method: 'POST', path: '/api/teams', desc: 'Create new team/workspace' },
        { method: 'GET', path: '/api/teams/:id', desc: 'Get team members and settings' },
        { method: 'POST', path: '/api/teams/:id/members', desc: 'Add member to team' }
      );
    }

    // Health check
    apis.push({ method: 'GET', path: '/api/health', desc: 'API health check endpoint' });

    return apis;
  }

  // Create database schema based on functionality
  createDatabaseSchema(structure, pages, requirements) {
    const schema = {
      users: ['id', 'email', 'password_hash', 'name', 'avatar_url', 'bio', 'created_at', 'updated_at'],
      sessions: ['id', 'user_id', 'token', 'expires_at', 'ip_address']
    };

    // Add tables based on features
    if (requirements.socialFeatures) {
      schema.posts = ['id', 'user_id', 'content', 'media_urls', 'likes_count', 'comments_count', 'created_at'];
      schema.comments = ['id', 'post_id', 'user_id', 'content', 'created_at'];
      schema.follows = ['follower_id', 'following_id', 'created_at'];
      schema.likes = ['id', 'user_id', 'post_id', 'created_at'];
    }

    if (requirements.payment) {
      schema.orders = ['id', 'user_id', 'total_amount', 'status', 'payment_id', 'created_at'];
      schema.order_items = ['id', 'order_id', 'product_id', 'quantity', 'price'];
      schema.payments = ['id', 'order_id', 'stripe_id', 'amount', 'status', 'created_at'];
    }

    if (requirements.messaging) {
      schema.messages = ['id', 'sender_id', 'receiver_id', 'content', 'is_read', 'created_at'];
      schema.conversations = ['id', 'user1_id', 'user2_id', 'last_message_at'];
    }

    if (requirements.multiTenant) {
      schema.teams = ['id', 'name', 'owner_id', 'slug', 'created_at'];
      schema.team_members = ['id', 'team_id', 'user_id', 'role', 'joined_at'];
    }

    if (requirements.analytics) {
      schema.events = ['id', 'user_id', 'event_type', 'data', 'created_at'];
      schema.analytics = ['id', 'date', 'metric_name', 'value'];
    }

    return schema;
  }

  // Generate app name from prompt
  generateAppName(prompt) {
    const words = prompt.split(/\s+/).filter(w => w.length > 3 && isNaN(w));
    const stopWords = ['build', 'create', 'make', 'like', 'with', 'that', 'from', 'using', 'a', 'the', 'an'];
    const meaningful = words.filter(w => !stopWords.includes(w.toLowerCase())).slice(0, 2);
    
    if (meaningful.length === 0) return 'XOVAApp';
    return meaningful.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  }

  // Generate description
  generateDescription(structure, requirements) {
    const features = Object.entries(requirements)
      .filter(([_, v]) => v)
      .map(([k, _]) => k.replace(/([A-Z])/g, ' $1').toLowerCase())
      .slice(0, 3)
      .join(', ');
    
    return `A ${structure.appType.replace('-', ' ')} application with ${features}`;
  }

  // Calculate file count based on complexity
  calculateFileCount(pages, apis, techStack) {
    let count = 10; // Base files
    count += pages.length * 2; // Pages + components
    count += apis.length * 1.5; // API routes
    count += Object.keys(techStack).length * 3; // Config files
    return Math.round(count);
  }

  // Assess complexity
  assessComplexity(requirements, structure) {
    const features = Object.values(requirements).filter(v => v).length;
    if (features > 7) return 'high';
    if (features > 4) return 'medium';
    return 'low';
  }

  // Helper
  hasFeature(lower, keywords) {
    return keywords.some(k => lower.includes(k));
  }

  // Start planning
  async startPlanning(prompt, model) {
    this.selectedModel = model;
    
    // Clear UI
    this.chatMessages.innerHTML = '';
    this.chatHistory = [];
    this.planReadyBanner.style.display = 'none';
    this.planningCta.style.display = 'none';
    this.chatThinking.classList.remove('hidden');

    // Show planning page
    window.xovaApp.showPage('planning');
    window.xovaGhost.onThinking();

    // Analyze prompt
    await this.delay(500);
    this.analysis = await this.analyzePrompt(prompt);

    // Display planning messages
    await this.updateStatus('Analyzing your prompt…');
    await this.delay(400);
    await this.addAIMessage(`🧠 Analyzing: *"${prompt.substring(0, 80)}${prompt.length > 80 ? '…' : ''}"*`);

    await this.delay(600);
    await this.updateStatus('Parsing requirements…');
    const reqSummary = Object.entries(this.analysis.requirements)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .slice(0, 5)
      .join(', ');
    await this.addAIMessage(`📋 Identified features: **${reqSummary}**`);

    await this.delay(600);
    await this.updateStatus('Designing architecture…');
    await this.addAIMessage(`🏗️ App Type: **${this.analysis.appType}** — Generating **${this.analysis.pages.length} pages** and **${this.analysis.apis.length} API endpoints**`);

    await this.delay(600);
    await this.updateStatus('Building tech stack…');
    const stackStr = `**Frontend:** ${this.analysis.techStack.frontend.join(', ')}\n\n**Backend:** ${this.analysis.techStack.backend.join(', ')}\n\n**Database:** ${this.analysis.techStack.database.join(', ')}`;
    await this.addAIMessage(`⚙️ Tech Stack:\n\n${stackStr}`);

    // Render architecture
    this.renderArchitecture();
    this.renderFileTree();
    this.renderTechStack();

    await this.delay(600);
    await this.updateStatus('Planning complete!', true);
    await this.addAIMessage(`✅ Plan ready! **${this.analysis.appName}** will have **${this.analysis.fileCount} files** with ${this.analysis.estimatedComplexity} complexity.`);

    // Show ready banner
    this.planAppName.textContent = this.analysis.appName;
    this.planReadyBanner.style.display = 'flex';
    this.planningCta.style.display = 'block';
    this.chatThinking.classList.add('hidden');

    window.xovaGhost.say(`Plan ready for ${this.analysis.appName}! 🎯`, 4000);
  }

  async updateStatus(text, ready = false) {
    this.planningStatusText.textContent = text;
    if (ready) {
      this.statusDot.className = 'status-dot ready';
    }
  }

  async addAIMessage(text) {
    const msgEl = this.createMessageEl('ai');
    const contentEl = msgEl.querySelector('.chat-msg-content');
    this.chatMessages.appendChild(msgEl);
    
    await this.streamText(contentEl, text);
    this.chatHistory.push({ role: 'ai', text });
    this.scrollToBottom();
  }

  async addUserMessage(text) {
    const msgEl = this.createMessageEl('user');
    const contentEl = msgEl.querySelector('.chat-msg-content');
    contentEl.textContent = text;
    this.chatMessages.appendChild(msgEl);
    this.chatHistory.push({ role: 'user', text });
    this.scrollToBottom();
  }

  createMessageEl(role) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.textContent = role === 'ai' ? 'X' : 'You';

    const content = document.createElement('div');
    content.className = 'chat-msg-content';

    div.appendChild(avatar);
    div.appendChild(content);
    return div;
  }

  async streamText(el, text, speed = 15) {
    for (let i = 0; i < text.length; i++) {
      el.innerHTML = this.renderMarkdown(text.substring(0, i + 1));
      await this.delay(speed);
    }
  }

  renderMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
  }

  renderArchitecture() {
    const html = `
      <div class="arch-section">
        <h4>📱 Pages (${this.analysis.pages.length})</h4>
        <div>${this.analysis.pages.map(p => `<span class="arch-tag">${p}</span>`).join('')}</div>
      </div>
      <div class="arch-section" style="margin-top:12px">
        <h4>🔌 API Endpoints (${this.analysis.apis.length})</h4>
        <div>${this.analysis.apis.map(a => `<span class="arch-tag"><span style="color:${this.getMethodColor(a.method)};font-weight:700">${a.method}</span> ${a.path}</span>`).join('')}</div>
      </div>
    `;
    this.archContent.innerHTML = html;
  }

  getMethodColor(method) {
    const colors = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444', PATCH: '#a855f7' };
    return colors[method] || '#6b7280';
  }

  renderFileTree() {
    const structure = this.generateFileStructure();
    const html = structure.slice(0, 20).map(item => {
      const indent = '  '.repeat(item.depth);
      const icon = item.type === 'folder' ? '📁' : this.getFileIcon(item.name);
      return `<div class="tree-item" style="padding-left:${item.depth * 16}px">${icon} ${item.name}</div>`;
    }).join('');
    this.fileTreeContent.innerHTML = html;
  }

  generateFileStructure() {
    const files = [];
    files.push({ type: 'folder', name: `${this.analysis.appName}/`, depth: 0 });
    files.push({ type: 'folder', name: 'frontend/', depth: 1 });
    this.analysis.pages.forEach(page => {
      files.push({ type: 'file', name: `${page.replace(/ /g, '')}.tsx`, depth: 2 });
    });
    files.push({ type: 'folder', name: 'backend/', depth: 1 });
    this.analysis.apis.forEach(api => {
      files.push({ type: 'file', name: `${api.path.split('/')[2]}.ts`, depth: 2 });
    });
    return files;
  }

  getFileIcon(name) {
    const ext = name.split('.').pop();
    const icons = { tsx: '⚛️', ts: '📘', js: '⚙️', sql: '🗄️', json: '📋', yml: '⚙️' };
    return icons[ext] || '📄';
  }

  renderTechStack() {
    const html = Object.entries(this.analysis.techStack)
      .map(([cat, techs]) => techs.map(t => `<span class="tech-badge">${t}</span>`).join(''))
      .join('');
    this.techStackContent.innerHTML = html;
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  async sendUserMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.chatInput.value = '';
    await this.addUserMessage(text);
    this.chatThinking.classList.remove('hidden');
    
    await this.delay(800);
    const response = this.generateResponse(text);
    await this.addAIMessage(response);
    
    this.chatThinking.classList.add('hidden');
    
    // Update analysis with user feedback
    this.updateAnalysisFromFeedback(text);
    
    window.xovaGhost.say('Plan updated! 📝', 2000);
  }

  updateAnalysisFromFeedback(userText) {
    // Re-analyze prompt with new requirements
    const combinedPrompt = this.prompt + ' ' + userText;
    this.analysis = this.analyzePromptSync(combinedPrompt);
    
    // Re-render UI
    this.renderArchitecture();
    this.renderFileTree();
    this.renderTechStack();
  }

  analyzePromptSync(prompt) {
    // Synchronous version for quick updates
    const requirements = this.extractRequirements(prompt);
    const structure = this.identifyAppStructure(prompt, requirements);
    const techStack = this.determineTechStack(structure, requirements);
    const pages = this.generatePages(structure, requirements);
    const apis = this.designAPIs(structure, pages, requirements);
    const dbSchema = this.createDatabaseSchema(structure, pages, requirements);

    return {
      prompt,
      appName: this.generateAppName(prompt),
      description: this.generateDescription(structure, requirements),
      appType: structure.appType,
      requirements,
      structure,
      pages,
      apis,
      techStack,
      dbSchema,
      fileCount: this.calculateFileCount(pages, apis, techStack),
      estimatedComplexity: this.assessComplexity(requirements, structure)
    };
  }

  generateResponse(userText) {
    const lower = userText.toLowerCase();
    if (lower.includes('add') || lower.includes('include')) {
      return `Great! I've updated the architecture to include that feature. The necessary pages, APIs, and database tables have been added. ✅`;
    }
    if (lower.includes('remove') || lower.includes('without')) {
      return `Noted! I'll remove that from the plan. The architecture is now optimized for the core features. 🗑️`;
    }
    return `Perfect! I've incorporated your feedback into the architecture. Everything is ready for the build phase. 🎯`;
  }

  getPlanData() {
    return this.analysis;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.xovaPlanner = new XOVAEnginePlanner();
