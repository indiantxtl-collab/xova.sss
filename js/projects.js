/* ============================================================
   XOVA — projects.js
   Project save, load, version history, local storage management
============================================================ */

class XOVAProjects {
  constructor() {
    this.STORAGE_KEY = 'xova_projects';
    this.VERSION_KEY = 'xova_versions';
    this.projects = this.loadProjects();
    this.versions = this.loadVersions();

    this.projectsGrid = document.getElementById('projectsGrid');
    this.versionList = document.getElementById('versionList');

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('newProjectFromListBtn').addEventListener('click', () => {
      window.xovaApp.showPage('home');
    });
  }

  // Load projects from localStorage
  loadProjects() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch { return []; }
  }

  loadVersions() {
    try {
      return JSON.parse(localStorage.getItem(this.VERSION_KEY) || '{}');
    } catch { return {}; }
  }

  // Save a project
  saveProject(data) {
    const project = {
      id: this.generateId(),
      name: data.name,
      platformType: data.platformType,
      fileCount: data.fileCount,
      totalLines: data.totalLines,
      status: data.status || 'complete',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      prompt: data.prompt || '',
      files: data.files || {}
    };

    // Add to projects list
    this.projects.unshift(project);
    if (this.projects.length > 50) this.projects.pop(); // keep max 50

    // Save version
    if (!this.versions[project.id]) this.versions[project.id] = [];
    this.versions[project.id].push({
      version: 1,
      label: 'Initial build',
      savedAt: Date.now(),
      fileCount: data.fileCount
    });

    this.persistProjects();
    this.persistVersions();

    window.xovaApp.showToast(`Project "${data.name}" saved!`, 'success');
    return project.id;
  }

  // Update existing project
  updateProject(id, updates) {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return;

    this.projects[idx] = { ...this.projects[idx], ...updates, updatedAt: Date.now() };

    // New version
    if (!this.versions[id]) this.versions[id] = [];
    const versionNum = (this.versions[id].length || 0) + 1;
    this.versions[id].push({
      version: versionNum,
      label: updates.versionLabel || `Version ${versionNum}`,
      savedAt: Date.now(),
      fileCount: updates.fileCount || this.projects[idx].fileCount
    });

    this.persistProjects();
    this.persistVersions();
  }

  persistProjects() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
    } catch (e) {
      console.warn('Storage full, clearing old projects');
      this.projects = this.projects.slice(0, 10);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.projects));
    }
  }

  persistVersions() {
    try {
      localStorage.setItem(this.VERSION_KEY, JSON.stringify(this.versions));
    } catch (e) {
      console.warn('Version storage issue');
    }
  }

  // Render projects grid
  renderProjectsGrid() {
    if (this.projects.length === 0) {
      this.projectsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-rocket"></i>
          <p>No projects yet. Start by building your first app!</p>
          <button class="btn-primary" onclick="window.xovaApp.showPage('home')">
            <i class="fas fa-plus"></i> Start Building
          </button>
        </div>
      `;
      return;
    }

    this.projectsGrid.innerHTML = this.projects.map(p => {
      const emoji = this.getPlatformEmoji(p.platformType);
      const timeAgo = this.timeAgo(p.createdAt);
      return `
        <div class="project-card glass-panel" data-id="${p.id}">
          <div class="project-card-header">
            <div class="project-emoji">${emoji}</div>
            <div class="project-status-badge ${p.status}">${p.status === 'complete' ? '✓ Complete' : '⚡ Building'}</div>
          </div>
          <div class="project-name">${p.name}</div>
          <div class="project-desc">${this.getPlatformDesc(p.platformType)}</div>
          <div class="project-meta">
            <span class="project-tag">${p.fileCount} files</span>
            <span class="project-tag">${(p.totalLines || 0).toLocaleString()} lines</span>
            <span>${timeAgo}</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:14px">
            <button class="btn-glass btn-sm" style="flex:1" onclick="window.xovaProjects.openProject('${p.id}')">
              <i class="fas fa-folder-open"></i> Open
            </button>
            <button class="btn-glass btn-xs" onclick="window.xovaProjects.showVersionHistory('${p.id}')" title="Version History">
              <i class="fas fa-history"></i>
            </button>
            <button class="btn-glass btn-xs" onclick="window.xovaProjects.deleteProject('${p.id}')" title="Delete" style="color:#ef4444">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open a project
  openProject(id) {
    const project = this.projects.find(p => p.id === id);
    if (!project) return;

    // Go to build page and show the project
    window.xovaApp.showPage('build');
    window.xovaStreamer.projectName = project.name;
    window.xovaStreamer.platformType = project.platformType;
    window.xovaStreamer.generatedFiles = project.files || {};
    window.xovaStreamer.totalFiles = project.fileCount;

    // Display first file
    const files = Object.keys(project.files || {});
    if (files.length > 0) {
      window.xovaStreamer.displayCode(files[0], project.files[files[0]]);
    }

    // Update build UI
    document.getElementById('buildProjectName').textContent = project.name;
    document.getElementById('buildProgressFill').style.width = '100%';
    document.getElementById('buildProgressText').textContent = '100%';
    document.getElementById('buildStatusText').textContent = '✅ Build Complete';

    // Render file list
    window.xovaStreamer.files = files.map(name => ({ name, type: name.split('.').pop() }));
    window.xovaStreamer.fileCountBadge.textContent = files.length;
    window.xovaStreamer.renderFileList();
    files.forEach((_, i) => {
      const el = document.getElementById(`file-item-${i}`);
      if (el) el.classList.add('complete');
    });

    // Show preview
    window.xovaPreview.renderFinalPreview(project.files, project.name, project.platformType);

    window.xovaGhost.say(`Reopened "${project.name}" 📂`, 2500);
  }

  // Delete project
  deleteProject(id) {
    this.projects = this.projects.filter(p => p.id !== id);
    delete this.versions[id];
    this.persistProjects();
    this.persistVersions();
    this.renderProjectsGrid();
    window.xovaApp.showToast('Project deleted', 'info');
  }

  // Show version history for a project
  showVersionHistory(projectId) {
    const versions = (this.versions[projectId] || []).slice().reverse();
    const project = this.projects.find(p => p.id === projectId);

    if (versions.length === 0) {
      this.versionList.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;text-align:center;padding:20px">No versions saved yet</p>';
    } else {
      this.versionList.innerHTML = versions.map(v => `
        <div class="version-item">
          <div class="version-info">
            <div class="version-name">v${v.version} — ${v.label}</div>
            <div class="version-time">${this.timeAgo(v.savedAt)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="version-files">${v.fileCount} files</span>
            <button class="btn-glass btn-xs">Restore</button>
          </div>
        </div>
      `).join('');
    }

    // Show all versions (not project-specific)
    this.renderVersionHistoryAll();
    document.getElementById('versionHistoryModal').classList.add('open');
  }

  renderVersionHistoryAll() {
    const allVersions = [];
    this.projects.forEach(p => {
      const versions = this.versions[p.id] || [];
      versions.forEach(v => {
        allVersions.push({ ...v, projectName: p.name, projectId: p.id });
      });
    });

    allVersions.sort((a, b) => b.savedAt - a.savedAt);

    if (allVersions.length === 0) {
      this.versionList.innerHTML = `
        <div style="text-align:center;padding:40px;color:var(--text-muted)">
          <i class="fas fa-history" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:12px"></i>
          <p style="font-size:0.85rem">No build history yet. Start a build to see versions here.</p>
        </div>
      `;
      return;
    }

    this.versionList.innerHTML = allVersions.slice(0, 20).map(v => `
      <div class="version-item">
        <div class="version-info">
          <div class="version-name">${v.projectName} — v${v.version}</div>
          <div class="version-time">${v.label} · ${this.timeAgo(v.savedAt)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="version-files">${v.fileCount} files</span>
          <button class="btn-glass btn-xs" onclick="window.xovaProjects.openProject('${v.projectId}');document.getElementById('versionHistoryModal').classList.remove('open')">
            <i class="fas fa-external-link-alt"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Render roadmap page
  renderRoadmap() {
    const items = [
      { quarter: 'Q1 2024', title: 'XOVA Core Engine', desc: 'Initial release with planning, streaming, and preview system', tag: 'live', state: 'done' },
      { quarter: 'Q1 2024', title: 'Ghost AI Assistant', desc: 'Physics-based ghost companion with personality and reactions', tag: 'live', state: 'done' },
      { quarter: 'Q2 2024', title: 'Live Code Streaming', desc: 'Real-time character-by-character code generation with syntax highlighting', tag: 'live', state: 'done' },
      { quarter: 'Q2 2024', title: 'Multi-Platform Templates', desc: 'Social, E-commerce, Streaming, SaaS, AI templates with deep architecture', tag: 'live', state: 'done' },
      { quarter: 'Q3 2024', title: 'Real Code Execution', desc: 'Actual runtime environment for backend code execution in browser sandbox', tag: 'soon', state: 'soon' },
      { quarter: 'Q3 2024', title: 'AI Model Fine-tuning', desc: 'Custom model training on specific tech stacks and coding styles', tag: 'soon', state: 'soon' },
      { quarter: 'Q4 2024', title: 'Team Collaboration', desc: 'Real-time multi-user builds with conflict resolution and chat', tag: 'planned', state: 'future' },
      { quarter: 'Q4 2024', title: 'One-Click Deployment', desc: 'Deploy to Vercel, Netlify, AWS, GCP directly from XOVA', tag: 'planned', state: 'future' },
      { quarter: 'Q1 2025', title: 'XOVA Marketplace', desc: 'Community templates, plugins, and custom model integrations', tag: 'planned', state: 'future' },
      { quarter: 'Q1 2025', title: 'Mobile App Builder', desc: 'Generate React Native and Flutter apps from prompts', tag: 'planned', state: 'future' },
    ];

    const timeline = document.getElementById('roadmapTimeline');
    if (timeline) {
      timeline.innerHTML = items.map(item => `
        <div class="roadmap-item ${item.state} glass-panel">
          <div class="roadmap-quarter">${item.quarter}</div>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <span class="roadmap-tag ${item.tag}">${item.tag === 'live' ? '✓ Live' : item.tag === 'soon' ? '⏳ Coming Soon' : '📋 Planned'}</span>
        </div>
      `).join('');
    }
  }

  // Render community page
  renderCommunity() {
    const builds = [
      { name: 'SkyShop Pro', desc: 'Full e-commerce with AI recommendations, live inventory, and multi-vendor support', author: 'Sarah K.', avatar: 'S', tags: ['E-Commerce', 'AI', 'React'], color: '#f59e0b' },
      { name: 'NexFeed', desc: 'Social platform inspired by Twitter+Instagram with real-time feeds and spaces', author: 'Alex M.', avatar: 'A', tags: ['Social', 'WebSocket', 'Node.js'], color: '#ec4899' },
      { name: 'AirTune', desc: 'Music streaming with ML-powered recommendations and collaborative playlists', author: 'Dev P.', avatar: 'D', tags: ['Streaming', 'ML', 'Python'], color: '#1db954' },
      { name: 'ZenDesk AI', desc: 'SaaS helpdesk with AI auto-responses, ticket routing, and analytics', author: 'Maria L.', avatar: 'M', tags: ['SaaS', 'AI', 'TypeScript'], color: '#6366f1' },
      { name: 'CodeLab', desc: 'Real-time collaborative code editor with 30+ languages and AI completions', author: 'Tom R.', avatar: 'T', tags: ['Editor', 'Collab', 'Monaco'], color: '#0ea5e9' },
      { name: 'PayFlow', desc: 'Fintech platform with multi-currency, crypto support, and fraud detection', author: 'Chen W.', avatar: 'C', tags: ['Fintech', 'Crypto', 'Go'], color: '#22c55e' },
    ];

    const grid = document.getElementById('communityGrid');
    if (grid) {
      grid.innerHTML = builds.map(b => `
        <div class="community-card glass-panel">
          <div class="community-card-top">
            <div class="community-avatar" style="background:${b.color}">${b.avatar}</div>
            <div>
              <h4>${b.name}</h4>
              <div class="author">by ${b.author}</div>
            </div>
          </div>
          <p>${b.desc}</p>
          <div class="community-tags">
            ${b.tags.map(t => `<span class="community-tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }
  }

  // Utilities
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  getPlatformEmoji(type) {
    return { social: '📸', ecommerce: '🛒', streaming: '🎵', saas: '💼', ai: '🤖', default: '⚡' }[type] || '⚡';
  }

  getPlatformDesc(type) {
    return {
      social: 'Social media platform with feeds, stories, and real-time messaging',
      ecommerce: 'Full e-commerce with product catalog, cart, payments, and seller portal',
      streaming: 'Music/video streaming with playlists, artist pages, and subscriptions',
      saas: 'SaaS platform with dashboards, API keys, billing, and team management',
      ai: 'AI platform with chat, model selection, API, and usage analytics',
      default: 'Full-stack production application with auth, APIs, and deployment'
    }[type] || 'Production-ready full-stack application';
  }

  timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}

window.xovaProjects = new XOVAProjects();
