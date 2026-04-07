/* ============================================================
   XOVA — planner.js
   Planning stage: architecture analysis, chat interface
============================================================ */

class XOVAPlanner {
  constructor() {
    this.prompt = '';
    this.platformType = 'default';
    this.platformConfig = null;
    this.projectName = '';
    this.selectedModel = 'super';
    this.planComplete = false;
    this.chatHistory = [];
    this.detectedFeatures = [];

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

  // Enhanced platform detection with feature analysis
  analyzePlatform(prompt) {
    const lower = prompt.toLowerCase();
    const detectedPlatform = window.XOVA_DATA.detectPlatformType(prompt);
    
    // Extract feature keywords
    this.detectedFeatures = window.XOVA_DATA.extractFeatures(prompt);
    
    return {
      type: detectedPlatform.type,
      config: detectedPlatform.config,
      confidence: this.calculateDetectionConfidence(lower, detectedPlatform.type)
    };
  }

  calculateDetectionConfidence(prompt, type) {
    const config = window.XOVA_DATA.PLATFORM_TEMPLATES[type];
    if (!config.keywords) return 0.5;
    
    const matches = config.keywords.filter(k => prompt.includes(k)).length;
    return Math.min(1, matches / config.keywords.length);
  }

  // Start planning sequence
  async startPlanning(prompt, model) {
    this.prompt = prompt;
    this.selectedModel = model;
    this.planComplete = false;

    // Enhanced platform detection
    const detection = this.analyzePlatform(prompt);
    this.platformType = detection.type;
    this.platformConfig = detection.config;
    this.projectName = window.XOVA_DATA.generateProjectName(prompt);

    // Clear previous state
    this.clearChat();
    this.resetArchitecture();

    // Show planning page
    window.xovaApp.showPage('planning');

    // Start ghost thinking
    window.xovaGhost.onThinking();

    // Begin planning sequence
    await this.runPlanningSequence();
  }

  clearChat() {
    this.chatMessages.innerHTML = '';
    this.chatHistory = [];
    this.planReadyBanner.style.display = 'none';
    this.planningCta.style.display = 'none';
    this.chatThinking.classList.remove('hidden');
  }

  resetArchitecture() {
    this.archContent.innerHTML = `<div class="arch-skeleton"><div class="skel-line w80"></div><div class="skel-line w60"></div><div class="skel-line w90"></div><div class="skel-line w50"></div></div>`;
    this.fileTreeContent.innerHTML = `<div class="arch-skeleton"><div class="skel-line w70"></div><div class="skel-line w50"></div><div class="skel-line w80"></div></div>`;
    this.techStackContent.innerHTML = '';
  }

  // Full planning sequence with structured architecture
  async runPlanningSequence() {
    const config = this.platformConfig;
    const pages = config.pages || [];
    const apis = config.apis || [];
    const stack = config.techStack || {};
    const fileCount = config.fileCount || 45;

    const statusMessages = [
      'Analyzing your prompt…',
      `Comparing with real-world ${config.name} platforms…`,
      'Designing page structure…',
      'Planning API endpoints…',
      'Selecting optimal tech stack…',
      'Generating file structure…',
      'Finalizing architecture…'
    ];

    // Message generators with enhanced context
    const messages = window.XOVA_DATA.PLANNING_MESSAGES;

    // Step 1: Initial analysis with feature detection
    await this.updateStatus(statusMessages[0]);
    await this.delay(600);
    const analysisMsg = messages[0](this.prompt, this.detectedFeatures, this.platformType);
    await this.addAIMessage(analysisMsg);

    // Step 2: Platform comparison
    await this.updateStatus(statusMessages[1]);
    await this.delay(800);
    await this.addAIMessage(messages[1](this.prompt, config.name));

    // Step 3: Pages with full details
    await this.updateStatus(statusMessages[2]);
    await this.delay(700);
    await this.addAIMessage(messages[2](this.prompt, config.name, pages));
    this.renderArchitecture(pages, apis, stack);

    // Step 4: APIs with descriptions
    await this.updateStatus(statusMessages[3]);
    await this.delay(600);
    await this.addAIMessage(messages[3](this.prompt, config.name, pages, apis));

    // Step 5: Tech Stack with reasoning
    await this.updateStatus(statusMessages[4]);
    await this.delay(700);
    await this.addAIMessage(messages[4](this.prompt, config.name, pages, apis, stack));
    this.renderTechStack(stack);

    // Step 6: File structure
    await this.updateStatus(statusMessages[5]);
    await this.delay(600);
    await this.addAIMessage(messages[5](this.prompt, config.name, pages, apis, stack, fileCount));
    this.renderFileTree();

    // Step 7: Complete with structured summary
    await this.updateStatus(statusMessages[6]);
    await this.delay(500);
    await this.addAIMessage(messages[6](config.name, fileCount));

    // Planning complete
    this.planComplete = true;
    this.chatThinking.classList.add('hidden');
    this.updateStatus('Architecture ready!', true);
    this.planAppName.textContent = this.projectName;
    this.planReadyBanner.style.display = 'flex';
    this.planningCta.style.display = 'block';

    window.xovaGhost.onPlanning();
    window.xovaGhost.say(`Plan ready for ${this.projectName}! 🎯`, 4000);
  }

  async updateStatus(text, ready = false) {
    this.planningStatusText.textContent = text;
    if (ready) {
      this.statusDot.className = 'status-dot ready';
    }
  }

  // Add AI message with streaming effect
  async addAIMessage(text) {
    const msgEl = this.createMessageEl('ai');
    const contentEl = msgEl.querySelector('.chat-msg-content');
    const cursor = document.createElement('span');
    cursor.className = 'stream-cursor';
    contentEl.appendChild(cursor);

    this.chatMessages.appendChild(msgEl);
    this.scrollToBottom();

    // Stream text character by character
    await this.streamText(contentEl, text, cursor);

    // Remove cursor
    cursor.remove();
    this.chatHistory.push({ role: 'ai', text });
  }

  async addUserMessage(text) {
    const msgEl = this.createMessageEl('user');
    const contentEl = msgEl.querySelector('.chat-msg-content');
    contentEl.textContent = text;
    this.chatMessages.appendChild(msgEl);
    this.scrollToBottom();
    this.chatHistory.push({ role: 'user', text });
  }

  createMessageEl(role) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';

    if (role === 'ai') {
      avatar.innerHTML = `<svg viewBox="0 0 40 40" width="32" height="32"><circle cx="20" cy="20" r="18" fill="#1a1a2e" stroke="#6ee7f7" stroke-width="1.5"/><ellipse cx="14" cy="19" rx="3.5" ry="4.5" fill="#6ee7f7"/><ellipse cx="26" cy="19" rx="3.5" ry="4.5" fill="#6ee7f7"/><path d="M16 28 Q20 26 24 28" stroke="#6ee7f7" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
    } else {
      avatar.textContent = 'You';
    }

    const content = document.createElement('div');
    content.className = 'chat-msg-content';

    div.appendChild(avatar);
    div.appendChild(content);
    return div;
  }

  async streamText(el, text, cursor) {
    let currentText = '';
    const tempDiv = document.createElement('div');

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      tempDiv.innerHTML = this.renderMarkdownLite(currentText);
      el.innerHTML = tempDiv.innerHTML;
      el.appendChild(cursor);

      const delay = text.length > 200 ? 8 : 18;
      if (i % 3 === 0) await this.delay(delay);
    }
    el.innerHTML = this.renderMarkdownLite(currentText);
  }

  renderMarkdownLite(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(14,165,233,0.1);padding:2px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.85em">$1</code>')
      .replace(/\n/g, '<br/>');
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    });
  }

  // User sends message to planner
  async sendUserMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.chatInput.value = '';
    await this.addUserMessage(text);

    this.chatThinking.classList.remove('hidden');
    await this.delay(800 + Math.random() * 600);

    const response = this.generatePlannerResponse(text);
    await this.addAIMessage(response);

    this.chatThinking.classList.add('hidden');
    window.xovaGhost.say('Got it! Plan updated 📝', 2000);
  }

  generatePlannerResponse(userText) {
    const lower = userText.toLowerCase();

    if (lower.includes('add') || lower.includes('include')) {
      return `Great idea! I'll include that in the build. The additional feature will be integrated into the relevant pages and APIs. The architecture has been updated to accommodate this. ✅`;
    }
    if (lower.includes('remove') || lower.includes('without')) {
      return `Understood — I'll exclude that from the plan. The simplified version will still be fully production-ready with all core functionality intact. 🗑️`;
    }
    if (lower.includes('how') || lower.includes('explain') || lower.includes('why')) {
      return `Great question! For **${this.platformConfig.name}**, the architecture follows industry best practices:\n\n• **Separation of concerns** — frontend and backend are independently deployable\n• **Scalability** — components designed for horizontal scaling\n• **Security** — JWT auth with refresh tokens, input validation, CORS protection\n• **Performance** — caching layers, query optimization, CDN ready\n• **Maintainability** — TypeScript, comprehensive error handling, logging 🏗️`;
    }
    if (lower.includes('auth') || lower.includes('login') || lower.includes('signup')) {
      return `The authentication system will include:\n\n• **JWT access tokens** (15 min expiry)\n• **Refresh tokens** (7 day expiry, HTTP-only cookie)\n• **OAuth2** (Google, GitHub, social login)\n• **Email verification** with token links\n• **Password reset** flow with secure tokens\n• **Session management** with device tracking 🔐`;
    }
    if (lower.includes('database') || lower.includes('db') || lower.includes('schema')) {
      const schema = this.platformConfig.dbSchema || {};
      const tables = Object.keys(schema);
      return `Database schema overview:\n\n${tables.map(t => `**${t}** table: \`${schema[t].slice(0,3).join('`, `')}\` + ${schema[t].length > 3 ? `${schema[t].length - 3} more` : 'complete'}`).join('\n\n')}\n\nAll tables include indexes for performance, foreign key constraints, and audit timestamps 📊`;
    }
    if (lower.includes('mobile') || lower.includes('responsive')) {
      return `The frontend will be **fully responsive** and mobile-first:\n\n• Tailwind CSS breakpoints for all screen sizes\n• Touch-friendly UI with proper tap targets (48px minimum)\n• Progressive Web App support (installable)\n• Offline-first with service workers\n• Performance optimized for 3G+ networks 📱`;
    }
    if (lower.includes('payment') || lower.includes('stripe') || lower.includes('billing')) {
      return `Payment integration will use **Stripe** (primary) and **Razorpay** (India/Asia):\n\n• One-time payments with payment intents\n• Subscription billing with webhooks\n• Invoice generation and PDF export\n• Refund handling with reconciliation\n• PCI compliance through tokenization 💳`;
    }

    const responses = [
      `Excellent suggestion! I've noted this and will incorporate it into the architecture. The build will reflect these requirements across all relevant files and components. ✨`,
      `Understood! This is a common pattern for ${this.platformConfig.name} applications. I'll make sure the implementation follows best practices with proper error handling and edge case coverage. 🛠️`,
      `Perfect — I'll factor that into the build. The generated code will handle this requirement with production-grade quality, including proper validation, error states, and loading indicators. 🚀`,
      `Great point! This feature requires updates to both the frontend components and the backend API. I'll handle all of that during the build phase — fully automated. 🎯`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Render architecture card with enhanced details
  renderArchitecture(pages, apis, stack) {
    const html = `
      <div class="arch-section">
        <h4>📱 Pages (${pages.length})</h4>
        <div>${pages.map(p => `<span class="arch-tag">${p}</span>`).join('')}</div>
      </div>
      <div class="arch-section" style="margin-top:12px">
        <h4>🔌 API Endpoints (${apis.length})</h4>
        <div>${apis.map(a => `<span class="arch-tag"><span style="font-weight:800;color:${this.getMethodColor(a.method)}">${a.method}</span> ${a.path}</span>`).join('')}</div>
      </div>
    `;
    this.archContent.innerHTML = html;
  }

  getMethodColor(method) {
    return { GET: '#16a34a', POST: '#1d4ed8', PUT: '#854d0e', DELETE: '#991b1b', PATCH: '#5b21b6' }[method] || '#0f172a';
  }

  // Render file tree
  renderFileTree() {
    const structure = window.XOVA_DATA.generateFolderStructure(this.platformType, this.projectName);
    const html = structure.slice(0, 18).map(item => {
      const indent = '  '.repeat(item.depth);
      const icon = item.type === 'folder'
        ? '<i class="fas fa-folder" style="color:#f59e0b"></i>'
        : this.getFileIcon(item.name);
      return `<div class="tree-item ${item.type}" style="padding-left:${item.depth * 14}px">
        ${icon}<span>${item.name}</span>
      </div>`;
    }).join('');
    this.fileTreeContent.innerHTML = html;
  }

  getFileIcon(name) {
    const ext = name.split('.').pop();
    const icons = {
      tsx: '<i class="fab fa-react" style="color:#61dafb"></i>',
      ts: '<i class="fas fa-code" style="color:#3178c6"></i>',
      js: '<i class="fab fa-js-square" style="color:#f7df1e"></i>',
      json: '<i class="fas fa-brackets-curly" style="color:#f59e0b"></i>',
      yml: '<i class="fas fa-cog" style="color:#94a3b8"></i>',
      sql: '<i class="fas fa-database" style="color:#0ea5e9"></i>',
      md: '<i class="fas fa-file-alt" style="color:#64748b"></i>',
      prisma: '<i class="fas fa-database" style="color:#5a67d8"></i>',
      conf: '<i class="fas fa-cog" style="color:#ef4444"></i>',
    };
    return icons[ext] || '<i class="fas fa-file" style="color:#94a3b8"></i>';
  }

  // Render tech stack with details
  renderTechStack(stack) {
    const html = Object.entries(stack).map(([category, techs]) =>
      techs.map(tech => `<span class="tech-badge ${category}">${tech}</span>`).join('')
    ).join('');
    this.techStackContent.innerHTML = html;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get current plan data for build phase
  getPlanData() {
    return {
      prompt: this.prompt,
      projectName: this.projectName,
      platformType: this.platformType,
      platformConfig: this.platformConfig,
      selectedModel: this.selectedModel,
      detectedFeatures: this.detectedFeatures
    };
  }
}

window.xovaPlanner = new XOVAPlanner();
