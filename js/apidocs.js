/* ============================================================
   XOVA — apidocs.js
   API Documentation page — OpenAPI style with live testing
============================================================ */

class XOVAApiDocs {
  constructor() {
    this.apiNav = document.getElementById('apiNav');
    this.apiContent = document.getElementById('apiContent');
    this.activeSection = null;

    this.endpoints = this.getEndpoints();
    this.init();
  }

  getEndpoints() {
    return {
      core: {
        title: 'Core',
        endpoints: [
          {
            method: 'GET', path: '/api/health',
            summary: 'Health Check',
            desc: 'Returns the current status of the XOVA API, including version, uptime, and model availability.',
            params: [],
            requestBody: null,
            response: {
              status: 'ok',
              version: '1.0.0',
              uptime: 99.97,
              models: ['xova-super', 'xova-new', 'xova-pro'],
              timestamp: '2024-01-15T10:30:00Z'
            }
          },
          {
            method: 'GET', path: '/api/models',
            summary: 'List Models',
            desc: 'Returns all available XOVA AI models with their capabilities, context limits, and pricing.',
            params: [],
            requestBody: null,
            response: {
              models: [
                { id: 'xova-super', name: 'XOVA SUPER MODEL', context: 200000, rpm: 100, desc: 'Most powerful, best for complex full-stack apps' },
                { id: 'xova-new', name: 'NEW MODEL', context: 128000, rpm: 200, desc: 'Latest release with improved reasoning' },
                { id: 'xova-pro', name: 'XOVA PRO', context: 64000, rpm: 500, desc: 'Balanced speed and quality' }
              ]
            }
          }
        ]
      },
      generate: {
        title: 'Generation',
        endpoints: [
          {
            method: 'POST', path: '/api/generate/analyze',
            summary: 'Analyze Prompt',
            desc: 'Analyzes a prompt and returns a complete architecture plan including pages, APIs, DB schema, and tech stack.',
            params: [],
            requestBody: {
              prompt: 'Build a full Instagram-like social media platform',
              model: 'xova-super',
              options: { deepAnalysis: true, compareWithPlatforms: ['instagram', 'tiktok'] }
            },
            response: {
              projectName: 'InstagramLikeApp',
              platformType: 'social',
              techStack: { frontend: ['React 18', 'TypeScript'], backend: ['Node.js', 'Express'] },
              pages: ['Home Feed', 'Explore', 'Profile', 'Messages'],
              apis: [{ method: 'GET', path: '/api/feed' }, { method: 'POST', path: '/api/posts' }],
              fileCount: 68,
              estimatedTime: '45s'
            }
          },
          {
            method: 'POST', path: '/api/generate/stream',
            summary: 'Stream Code Generation',
            desc: 'Starts streaming code generation. Returns Server-Sent Events (SSE) with live code chunks for each file.',
            params: [],
            requestBody: {
              planId: 'plan_abc123',
              model: 'xova-super',
              startFromFile: 0
            },
            response: `data: {"type":"file_start","file":"server.js","path":"/backend/"}\n\ndata: {"type":"chunk","content":"const express = require('express');"}\n\ndata: {"type":"file_complete","file":"server.js","lines":145}\n\ndata: {"type":"build_complete","totalFiles":68,"totalLines":12847}`
          },
          {
            method: 'POST', path: '/api/generate/fix',
            summary: 'Auto-Fix Code',
            desc: 'Analyzes generated code for errors and automatically fixes them. Returns the corrected code.',
            params: [],
            requestBody: {
              file: 'server.js',
              code: '// code with error',
              error: 'Missing await keyword on line 47'
            },
            response: {
              fixed: true,
              originalError: 'Missing await keyword on line 47',
              fixedCode: '// corrected code',
              explanation: 'Added await to async database call on line 47'
            }
          }
        ]
      },
      projects: {
        title: 'Projects',
        endpoints: [
          {
            method: 'GET', path: '/api/projects',
            summary: 'List Projects',
            desc: 'Returns all projects for the authenticated user with metadata and file counts.',
            params: [
              { name: 'page', type: 'integer', desc: 'Page number (default: 1)' },
              { name: 'limit', type: 'integer', desc: 'Items per page (default: 20)' },
              { name: 'status', type: 'string', desc: 'Filter by status: complete, building' }
            ],
            requestBody: null,
            response: {
              projects: [
                { id: 'proj_abc', name: 'MyApp', fileCount: 68, status: 'complete', createdAt: '2024-01-15T10:00:00Z' }
              ],
              total: 12, page: 1
            }
          },
          {
            method: 'POST', path: '/api/projects',
            summary: 'Create Project',
            desc: 'Creates a new project record and initiates the build process.',
            params: [],
            requestBody: {
              prompt: 'Build a social media app',
              model: 'xova-super',
              name: 'MySocialApp'
            },
            response: {
              id: 'proj_xyz789',
              name: 'MySocialApp',
              status: 'building',
              streamUrl: '/api/generate/stream?planId=plan_xyz',
              createdAt: '2024-01-15T10:00:00Z'
            }
          },
          {
            method: 'GET', path: '/api/projects/:id',
            summary: 'Get Project',
            desc: 'Returns a single project with all generated files and metadata.',
            params: [
              { name: 'id', type: 'string', desc: 'Project ID (path parameter)' }
            ],
            requestBody: null,
            response: {
              id: 'proj_abc',
              name: 'MySocialApp',
              files: { 'server.js': '// code', 'App.tsx': '// code' },
              fileCount: 68,
              status: 'complete'
            }
          },
          {
            method: 'DELETE', path: '/api/projects/:id',
            summary: 'Delete Project',
            desc: 'Permanently deletes a project and all associated files.',
            params: [],
            requestBody: null,
            response: { deleted: true, id: 'proj_abc' }
          }
        ]
      },
      export: {
        title: 'Export',
        endpoints: [
          {
            method: 'GET', path: '/api/export/zip/:id',
            summary: 'Export as ZIP',
            desc: 'Downloads the entire project as a ZIP file with all generated source code.',
            params: [
              { name: 'id', type: 'string', desc: 'Project ID (path parameter)' }
            ],
            requestBody: null,
            response: '(Binary ZIP file download)'
          },
          {
            method: 'POST', path: '/api/export/github',
            summary: 'Push to GitHub',
            desc: 'Creates a new GitHub repository and pushes all project files.',
            params: [],
            requestBody: {
              projectId: 'proj_abc',
              repoName: 'my-social-app',
              githubToken: 'ghp_xxxxx',
              username: 'your-username',
              isPrivate: false,
              commitMessage: 'Initial commit — Built by XOVA'
            },
            response: {
              success: true,
              repoUrl: 'https://github.com/your-username/my-social-app',
              filesCommitted: 68
            }
          }
        ]
      }
    };
  }

  init() {
    this.renderNav();
    this.renderContent();
  }

  renderNav() {
    if (!this.apiNav) return;

    let html = `
      <div class="api-nav-section">Overview</div>
      <div class="api-nav-item active" data-section="overview">
        <i class="fas fa-home" style="font-size:0.75rem"></i> Introduction
      </div>
    `;

    Object.entries(this.endpoints).forEach(([key, section]) => {
      html += `<div class="api-nav-section">${section.title}</div>`;
      section.endpoints.forEach(ep => {
        html += `
          <div class="api-nav-item" data-section="${key}-${ep.path}">
            <span class="method-badge ${ep.method.toLowerCase()}">${ep.method}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:0.75rem">${ep.path.replace('/:id', '/{id}')}</span>
          </div>
        `;
      });
    });

    this.apiNav.innerHTML = html;

    // Bind nav items
    this.apiNav.querySelectorAll('.api-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        this.apiNav.querySelectorAll('.api-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  renderContent() {
    if (!this.apiContent) return;

    let html = `
      <!-- Introduction -->
      <div class="api-intro" style="margin-bottom:40px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;background:linear-gradient(135deg,#0ea5e9,#a78bfa);border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:1.2rem">⚡</div>
          <div>
            <h1 style="font-size:1.6rem;font-weight:900;color:var(--text-primary)">XOVA API Reference</h1>
            <p style="font-size:0.85rem;color:var(--text-muted)">Version 1.0.0 · REST API · OpenAPI 3.0</p>
          </div>
        </div>
        <div class="glass-panel" style="padding:20px;margin-bottom:20px">
          <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.7">
            The XOVA API enables you to programmatically analyze prompts, generate complete full-stack applications, stream code in real-time, and export projects. All requests use JSON and require an API key in the Authorization header.
          </p>
        </div>
        <div class="glass-panel" style="padding:16px 20px">
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:8px">Base URL</div>
          <div class="api-code-block" style="font-size:0.82rem">https://api.xova.ai/v1</div>
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:12px 0 8px">Authentication</div>
          <div class="api-code-block">Authorization: Bearer xova_sk_xxxxxxxxxxxx</div>
        </div>
      </div>
    `;

    // Render each section
    Object.entries(this.endpoints).forEach(([key, section]) => {
      html += `
        <h2 style="font-size:1.1rem;font-weight:800;color:var(--text-primary);margin-bottom:16px;display:flex;align-items:center;gap:8px">
          <div style="width:4px;height:20px;background:linear-gradient(180deg,#0ea5e9,#a78bfa);border-radius:2px"></div>
          ${section.title}
        </h2>
      `;

      section.endpoints.forEach((ep, i) => {
        html += this.renderEndpoint(ep, `${key}-${i}`);
      });
    });

    this.apiContent.innerHTML = html;

    // Bind try buttons
    this.apiContent.querySelectorAll('.api-try-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.tryEndpoint(id, e.currentTarget);
      });
    });
  }

  renderEndpoint(ep, id) {
    const methodColors = { GET: '#16a34a', POST: '#1d4ed8', PUT: '#854d0e', DELETE: '#991b1b', PATCH: '#5b21b6' };
    const methodBg = { GET: 'rgba(34,197,94,0.1)', POST: 'rgba(29,78,216,0.1)', PUT: 'rgba(133,77,14,0.1)', DELETE: 'rgba(153,27,27,0.1)', PATCH: 'rgba(91,33,182,0.1)' };

    const responseStr = typeof ep.response === 'string'
      ? ep.response
      : JSON.stringify(ep.response, null, 2);

    const requestBodyStr = ep.requestBody ? JSON.stringify(ep.requestBody, null, 2) : null;

    return `
      <div class="api-endpoint-card glass-panel" style="margin-bottom:24px">
        <div class="api-endpoint-header" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
          <span class="method-badge ${ep.method.toLowerCase()}" style="font-size:0.72rem;padding:3px 8px;font-weight:800">${ep.method}</span>
          <span class="api-endpoint-path">${ep.path}</span>
          <span class="api-endpoint-desc">${ep.summary}</span>
          <i class="fas fa-chevron-down" style="color:var(--text-muted);margin-left:auto;font-size:0.75rem"></i>
        </div>
        <div class="api-endpoint-body">
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.6;margin-bottom:12px">${ep.desc}</p>
          
          ${ep.params && ep.params.length > 0 ? `
            <div class="api-section-label">Parameters</div>
            <div class="glass-panel" style="padding:0;overflow:hidden;margin-bottom:12px">
              ${ep.params.map(p => `
                <div style="display:flex;gap:12px;padding:10px 14px;border-bottom:1px solid rgba(14,165,233,0.08);font-size:0.8rem">
                  <code style="color:var(--sky-deep);font-family:'JetBrains Mono',monospace;min-width:100px">${p.name}</code>
                  <span style="color:var(--text-muted);font-size:0.72rem;align-self:center;background:rgba(14,165,233,0.08);padding:2px 8px;border-radius:4px">${p.type}</span>
                  <span style="color:var(--text-secondary)">${p.desc}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${requestBodyStr ? `
            <div class="api-section-label">Request Body</div>
            <div class="api-code-block">${this.escapeHtml(requestBodyStr)}</div>
          ` : ''}
          
          <div class="api-section-label">Response</div>
          <div class="api-code-block" id="response-${id}">${this.escapeHtml(responseStr)}</div>
          
          <button class="api-try-btn" data-id="${id}" data-ep='${JSON.stringify({method:ep.method,path:ep.path})}'>
            <i class="fas fa-play"></i> Try it out
          </button>
          
          <div class="api-response-area" id="try-response-${id}">
            <div class="api-section-label" style="margin-top:16px">Live Response</div>
            <div class="api-code-block" id="live-response-${id}" style="color:#22c55e"></div>
          </div>
        </div>
      </div>
    `;
  }

  tryEndpoint(id, btn) {
    const ep = JSON.parse(btn.dataset.ep);
    const responseArea = document.getElementById(`try-response-${id}`);
    const liveResponse = document.getElementById(`live-response-${id}`);

    responseArea.classList.add('visible');
    liveResponse.textContent = '⏳ Sending request…';
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    // Simulate API call
    setTimeout(() => {
      const mockResponses = {
        '/api/health': { status: 'ok', version: '1.0.0', uptime: 99.97, timestamp: new Date().toISOString() },
        '/api/models': { models: ['xova-super', 'xova-new', 'xova-pro'], count: 3 },
        '/api/generate/analyze': { status: 'success', projectName: 'MyApp', fileCount: 68, estimatedTime: '42s' },
        '/api/projects': { projects: [], total: 0, page: 1 },
      };

      const response = mockResponses[ep.path] || { status: 'success', message: 'Request processed successfully', timestamp: new Date().toISOString() };
      const statusCode = ep.method === 'DELETE' ? 204 : ep.method === 'POST' ? 201 : 200;

      liveResponse.innerHTML = `<span style="color:#22c55e">HTTP ${statusCode} OK</span>\n\n${JSON.stringify(response, null, 2)}`;
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check"></i> Success!';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-play"></i> Try it out';
        btn.style.background = '';
      }, 3000);
    }, 800 + Math.random() * 600);
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

window.xovaApiDocs = new XOVAApiDocs();
