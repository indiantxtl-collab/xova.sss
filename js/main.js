/* ============================================================
   XOVA — main.js
   Main application controller: routing, events, UI orchestration
   UPDATED to use new engine architecture
============================================================ */

class XOVAApp {
  constructor() {
    this.currentPage = 'home';
    this.pages = ['home', 'planning', 'build', 'projects', 'api-docs', 'roadmap', 'community'];
    this.selectedModel = 'super';
    this.inputEl = document.getElementById('mainInput');

    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindHomeActions();
    this.bindBuildActions();
    this.bindModalActions();
    this.setupAutoResize();
    this.animateStats();
    this.initSuggestionChips();
    this.checkExistingProjects();

    // Welcome ghost message
    setTimeout(() => {
      window.xovaGhost.say('Welcome to XOVA! 👋 Build anything…', 3500);
    }, 1500);

    // Point to input after idle
    setTimeout(() => {
      if (this.currentPage === 'home' && !this.inputEl.value) {
        window.xovaGhost.pointToInput();
      }
    }, 8000);
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  bindNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        this.showPage(page);
      });
    });
  }

  showPage(pageId) {
    // Map IDs
    const pageMap = {
      'home': 'homePage',
      'planning': 'planningPage',
      'build': 'buildPage',
      'projects': 'projectsPage',
      'api-docs': 'apiDocsPage',
      'roadmap': 'roadmapPage',
      'community': 'communityPage'
    };

    const pageElId = pageMap[pageId];
    if (!pageElId) return;

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target
    const targetPage = document.getElementById(pageElId);
    if (targetPage) {
      targetPage.classList.add('active');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.page === pageId);
    });

    this.currentPage = pageId;

    // Page-specific actions
    if (pageId === 'projects') {
      window.xovaProjects.renderProjectsGrid();
      window.xovaGhost.say('Your saved projects 📁', 2000);
    } else if (pageId === 'api-docs') {
      window.xovaGhost.say('Full API documentation 📖', 2000);
    } else if (pageId === 'roadmap') {
      window.xovaProjects.renderRoadmap();
      window.xovaGhost.say("Here's what's coming! 🚀", 2000);
    } else if (pageId === 'community') {
      window.xovaProjects.renderCommunity();
      window.xovaGhost.say('Amazing community builds! 🌟', 2000);
    } else if (pageId === 'home') {
      window.xovaGhost.onIdle();
    }
  }

  // ============================================================
  // HOME PAGE ACTIONS
  // ============================================================
  bindHomeActions() {
    // Build button
    document.getElementById('buildBtn').addEventListener('click', () => this.startBuildFlow());

    // Enter key on input
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.startBuildFlow();
      }
    });

    // Input changes
    this.inputEl.addEventListener('input', () => {
      const len = this.inputEl.value.length;
      document.getElementById('charCount').textContent = `${len} / ∞`;
      if (len > 5) {
        window.xovaGhost.onTyping();
      } else if (len === 0) {
        window.xovaGhost.onIdle();
      }
    });

    // Model selector
    document.querySelectorAll('.model-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedModel = btn.dataset.model;
        const modelNames = { super: 'XOVA SUPER', new: 'NEW MODEL', pro: 'XOVA PRO' };
        window.xovaGhost.say(`Switched to ${modelNames[this.selectedModel]} ✨`, 2000);
      });
    });

    // File attachment
    document.getElementById('attachBtn').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.handleFileAttachment(e.target.files);
    });

    // New Project button
    document.getElementById('newProjectBtn').addEventListener('click', () => {
      this.showPage('home');
      this.inputEl.value = '';
      this.inputEl.focus();
    });

    // Version history button
    document.getElementById('versionHistoryBtn').addEventListener('click', () => {
      window.xovaProjects.renderVersionHistoryAll();
      document.getElementById('versionHistoryModal').classList.add('open');
    });
  }

  async startBuildFlow() {
    const prompt = this.inputEl.value.trim();
    if (!prompt) {
      this.showToast('Please enter a prompt to build your app!', 'error');
      this.inputEl.focus();
      window.xovaGhost.say('Type your app idea first! ✍️', 2500);
      // Shake input
      const container = document.getElementById('inputContainer');
      container.style.animation = 'none';
      container.style.border = '2px solid rgba(239,68,68,0.5)';
      setTimeout(() => { container.style.border = ''; }, 1500);
      return;
    }

    // Ghost reacts
    window.xovaGhost.onThinking();

    // Start planning with new engine
    await window.xovaPlanner.startPlanning(prompt, this.selectedModel);
  }

  // Suggestion chips
  initSuggestionChips() {
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.inputEl.value = chip.dataset.prompt;
        // Trigger resize
        this.inputEl.dispatchEvent(new Event('input'));
        this.inputEl.focus();
        window.xovaGhost.onTyping();
        window.xovaGhost.say('Great choice! Hit Analyze & Plan 🚀', 2500);
      });
    });
  }

  // File attachment
  handleFileAttachment(files) {
    const container = document.getElementById('attachedFiles');
    Array.from(files).forEach(file => {
      const chip = document.createElement('div');
      chip.className = 'attached-file-chip';
      chip.innerHTML = `
        <i class="fas fa-${file.type.startsWith('image/') ? 'image' : 'file'}"></i>
        <span>${file.name}</span>
        <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
      `;
      container.appendChild(chip);
    });
    this.showToast(`${files.length} file(s) attached`, 'success');
  }

  // ============================================================
  // BUILD PAGE ACTIONS
  // ============================================================
  bindBuildActions() {
    // Start build from planning
    document.getElementById('startBuildBtn').addEventListener('click', () => {
      this.showPage('build');
      const planData = window.xovaPlanner.getPlanData();
      window.xovaStreamer.startBuild(planData);
    });

    // Back to plan
    document.getElementById('backToPlanBtn').addEventListener('click', () => {
      if (window.xovaStreamer.isStreaming) {
        if (!confirm('Stop the current build and go back to planning?')) return;
        window.xovaStreamer.stop();
      }
      this.showPage('planning');
    });

    // Code/Preview tab switching
    const codeTabBtn = document.getElementById('codeTabBtn');
    const previewTabBtn = document.getElementById('previewTabBtn');
    const codePanel = document.getElementById('codePanel');
    const previewPanel = document.getElementById('previewPanel');

    if (codeTabBtn && previewTabBtn) {
      codeTabBtn.addEventListener('click', () => {
        codeTabBtn.classList.add('active');
        previewTabBtn.classList.remove('active');
        if (codePanel) codePanel.classList.remove('hidden');
        if (previewPanel) previewPanel.classList.add('hidden');
      });

      previewTabBtn.addEventListener('click', () => {
        previewTabBtn.classList.add('active');
        codeTabBtn.classList.remove('active');
        if (previewPanel) previewPanel.classList.remove('hidden');
        if (codePanel) codePanel.classList.add('hidden');
      });
    }

    // Toggle preview (legacy button)
    document.getElementById('togglePreviewBtn').addEventListener('click', () => {
      const preview = document.getElementById('previewPanel');
      preview.classList.toggle('visible');
      const isVisible = preview.style.display !== 'none' && !preview.style.display;
      if (window.innerWidth <= 1024) {
        preview.style.display = preview.style.display === 'none' ? 'flex' : 'none';
        const btn = document.getElementById('togglePreviewBtn');
        btn.style.background = preview.style.display === 'none' ? '' : 'rgba(14,165,233,0.2)';
      }
    });

    // Export ZIP
    document.getElementById('exportZipBtn').addEventListener('click', () => {
      window.xovaStreamer.exportAsZip();
    });
    document.getElementById('exportFinalZipBtn')?.addEventListener('click', () => {
      window.xovaStreamer.exportAsZip();
    });

    // GitHub push
    document.getElementById('githubPushBtn').addEventListener('click', () => {
      document.getElementById('githubModal').classList.add('open');
    });
    document.getElementById('pushGithubFinalBtn')?.addEventListener('click', () => {
      document.getElementById('buildCompleteBanner').style.display = 'none';
      document.getElementById('githubModal').classList.add('open');
    });

    // Save project
    document.getElementById('saveProjectBtn').addEventListener('click', () => {
      const streamer = window.xovaStreamer;
      if (Object.keys(streamer.generatedCode).length === 0) {
        this.showToast('No files to save yet', 'info');
        return;
      }
      window.xovaProjects.saveProject({
        name: streamer.projectName,
        files: streamer.generatedCode,
        fileCount: Object.keys(streamer.generatedCode).length,
        totalLines: Object.values(streamer.generatedCode).reduce((s, c) => s + c.split('\n').length, 0)
      });
    });

    // Publish button
    document.getElementById('publishBtn').addEventListener('click', () => {
      this.handlePublish();
    });

    // View full app (from complete banner)
    document.getElementById('viewFullAppBtn')?.addEventListener('click', () => {
      document.getElementById('buildCompleteBanner').style.display = 'none';
      document.getElementById('previewPanel').style.display = 'flex';
      // Switch to preview tab
      if (previewTabBtn) previewTabBtn.click();
    });

    // New build from complete
    document.getElementById('newBuildFromCompleteBtn')?.addEventListener('click', () => {
      document.getElementById('buildCompleteBanner').style.display = 'none';
      window.xovaStreamer.stop();
      this.showPage('home');
      this.inputEl.value = '';
    });

    // GitHub confirm push
    document.getElementById('confirmGithubPush').addEventListener('click', () => this.handleGithubPush());

    // Cancel plan
    document.getElementById('cancelPlanBtn').addEventListener('click', () => {
      this.showPage('home');
    });
  }

  // ============================================================
  // MODAL ACTIONS
  // ============================================================
  bindModalActions() {
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        document.getElementById(modalId).classList.remove('open');
      });
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      }
    });
  }

  // ============================================================
  // GITHUB PUSH
  // ============================================================
  async handleGithubPush() {
    const repoName = document.getElementById('repoName').value.trim();
    const token = document.getElementById('githubToken').value.trim();
    const username = document.getElementById('githubUsername').value.trim();
    const commitMsg = document.getElementById('commitMsg').value.trim() || 'Initial commit — Built by XOVA';
    const resultEl = document.getElementById('githubResult');

    if (!repoName || !token || !username) {
      resultEl.className = 'github-result error';
      resultEl.style.display = 'block';
      resultEl.textContent = '⚠️ Please fill in all required fields';
      return;
    }

    const btn = document.getElementById('confirmGithubPush');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pushing…';
    resultEl.style.display = 'none';

    try {
      // Step 1: Create repo
      const createRes = await fetch(`https://api.github.com/user/repos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          name: repoName,
          description: `Built with XOVA AI Engine — ${window.xovaStreamer.projectName}`,
          private: false,
          auto_init: false
        })
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.message || 'Failed to create repository');
      }

      const repo = await createRes.json();

      // Step 2: Push files
      const files = window.xovaStreamer.generatedCode;
      const fileKeys = Object.keys(files);
      let pushed = 0;

      for (const fileName of fileKeys.slice(0, 10)) { // Push first 10 files
        const content = btoa(unescape(encodeURIComponent(files[fileName])));
        await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${fileName}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: pushed === 0 ? commitMsg : `Add ${fileName}`,
            content
          })
        });
        pushed++;
      }

      resultEl.className = 'github-result success';
      resultEl.style.display = 'block';
      resultEl.innerHTML = `✅ Successfully pushed ${pushed} files!<br/><a href="${repo.html_url}" target="_blank" style="color:#15803d">View on GitHub →</a>`;

      window.xovaGhost.say('Pushed to GitHub! 🎉', 3000);
      this.showToast('Successfully pushed to GitHub!', 'success');

    } catch (err) {
      resultEl.className = 'github-result error';
      resultEl.style.display = 'block';
      resultEl.textContent = `❌ ${err.message}`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fab fa-github"></i> Push Repository';
    }
  }

  // ============================================================
  // PUBLISH APP
  // ============================================================
  async handlePublish() {
    const streamer = window.xovaStreamer;
    const publishBtn = document.getElementById('publishBtn');
    
    if (!streamer.projectName || Object.keys(streamer.generatedCode).length === 0) {
      this.showToast('No project to publish yet', 'info');
      return;
    }

    // Disable button during publish
    publishBtn.disabled = true;
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing…';

    try {
      // Generate unique project ID
      const projectId = streamer.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
      const publishUrl = `https://${projectId}.xova.pro`;

      // Simulate deployment (in real implementation, this would call a deploy API)
      await this.delay(2000);

      // Store published URL in project
      window.xovaProjects.updateProject(streamer.projectId || Date.now().toString(), {
        publishedUrl: publishUrl,
        publishedAt: Date.now()
      });

      // Show success with link
      this.showToast(`Published at ${publishUrl}!`, 'success');
      
      // Update button to show link
      publishBtn.innerHTML = `<i class="fas fa-check"></i> Published`;
      publishBtn.disabled = false;

      // Add publish link container below topbar
      const existingLink = document.querySelector('.publish-link-container');
      if (!existingLink) {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'publish-link-container';
        linkContainer.innerHTML = `
          <i class="fas fa-check-circle" style="color:#22c55e;font-size:1.2rem"></i>
          <span style="color:#22c55e;font-weight:600">Your app is live!</span>
          <a href="${publishUrl}" target="_blank" class="publish-link">
            ${publishUrl} <i class="fas fa-external-link-alt"></i>
          </a>
        `;
        document.querySelector('.build-topbar').after(linkContainer);
      }

      window.xovaGhost.say(`Your app is live at ${projectId}.xova.pro! 🚀`, 4000);

    } catch (err) {
      this.showToast(`Publish failed: ${err.message}`, 'error');
      publishBtn.disabled = false;
      publishBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Publish';
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================
  // AUTO-RESIZE TEXTAREA
  // ============================================================
  setupAutoResize() {
    const autoResize = (el) => {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 280) + 'px';
    };

    if (this.inputEl) {
      this.inputEl.addEventListener('input', () => autoResize(this.inputEl));
    }

    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.addEventListener('input', () => autoResize(chatInput));
    }
  }

  // ============================================================
  // ANIMATED STATS COUNTER
  // ============================================================
  animateStats() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          this.countUp(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-val').forEach(el => observer.observe(el));
  }

  countUp(el, target) {
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + (target === 99 ? '%' : target >= 1000 ? '+' : '');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ============================================================
  // CHECK FOR EXISTING PROJECTS
  // ============================================================
  checkExistingProjects() {
    const projects = window.xovaProjects?.projects || [];
    if (projects.length > 0) {
      setTimeout(() => {
        window.xovaGhost.say(`Welcome back! ${projects.length} saved project${projects.length > 1 ? 's' : ''} 📁`, 3000);
      }, 2500);
    }
  }

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// ============================================================
// INITIALIZE APP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  window.xovaApp = new XOVAApp();

  // Keyboard shortcut: Ctrl+Enter anywhere to start build
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      if (window.xovaApp.currentPage === 'home') {
        window.xovaApp.startBuildFlow();
      }
    }
  });

  // Handle planning chat input Enter
  document.getElementById('chatInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      window.xovaPlanner.sendUserMessage();
    }
  });

  // Smooth page transitions
  document.querySelectorAll('.page').forEach(page => {
    page.style.animation = 'none';
  });
});

// ============================================================
// PERFORMANCE: Ensure JetBrains Mono is loaded
// ============================================================
(function ensureFonts() {
  if (!document.querySelector('link[href*="JetBrains"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }
})();
