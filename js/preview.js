/* ============================================================
   XOVA — preview.js
   Live preview engine: renders app in iframe as code streams
============================================================ */

class XOVAPreview {
  constructor() {
    this.frame = document.getElementById('livePreviewFrame');
    this.previewUrl = document.getElementById('previewUrl');
    this.deviceBtns = document.querySelectorAll('.dev-btn');
    this.updateQueue = [];
    this.lastUpdateTime = 0;
    this.updateThrottle = 600; // ms between preview updates
    this.projectName = '';
    this.platformType = '';
    this.currentDevice = 'desktop';

    this.bindDeviceButtons();
  }

  bindDeviceButtons() {
    this.deviceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.deviceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDevice = btn.dataset.device;
        this.setDevice(btn.dataset.device);
      });
    });
  }

  // Set device viewport for responsive preview
  setDevice(device) {
    const frameWrap = document.getElementById('previewFrameWrap');
    
    const devices = {
      mobile: { width: '375px', height: '812px', borders: true },
      tablet: { width: '768px', height: '1024px', borders: true },
      desktop: { width: '100%', height: '600px', borders: false }
    };

    const config = devices[device] || devices.desktop;

    this.frame.style.width = config.width;
    this.frame.style.height = config.height;
    this.frame.style.margin = config.borders ? '0 auto' : '0';
    this.frame.style.display = 'block';
    this.frame.style.borderLeft = config.borders ? '1px solid rgba(14,165,233,0.2)' : '';
    this.frame.style.borderRight = config.borders ? '1px solid rgba(14,165,233,0.2)' : '';
    this.frame.style.transition = 'all 0.3s ease';
  }

  // Update preview as code streams (throttled)
  updatePreview(generatedFiles, projectName, platformType) {
    this.projectName = projectName;
    this.platformType = platformType;

    const now = Date.now();
    if (now - this.lastUpdateTime < this.updateThrottle) return;
    this.lastUpdateTime = now;

    // Generate preview HTML based on available files
    const html = this.generatePreviewHTML(generatedFiles, projectName, platformType);
    this.writeToFrame(html);
    this.previewUrl.textContent = `${projectName.toLowerCase()}.xova.app`;
  }

  // Final full preview render
  renderFinalPreview(generatedFiles, projectName, platformType) {
    const html = this.generateFullPreviewHTML(projectName, platformType);
    this.writeToFrame(html);
    this.previewUrl.textContent = `${projectName.toLowerCase()}.xova.app`;
  }

  // Write HTML to iframe with error handling
  writeToFrame(html) {
    try {
      const doc = this.frame.contentDocument || this.frame.contentWindow.document;
      if (!doc) throw new Error('Cannot access iframe document');
      
      doc.open();
      doc.write(html);
      doc.close();
    } catch (e) {
      console.warn('Iframe write error, using srcdoc:', e);
      // Fallback to srcdoc attribute
      this.frame.srcdoc = html;
    }
  }

  // Generate streaming preview (partial as files arrive)
  generatePreviewHTML(files, projectName, platformType) {
    const fileCount = Object.keys(files).length;
    const hasFiles = fileCount > 0;
    
    if (!hasFiles) {
      return this.getLoadingTemplate(projectName);
    }

    return this.getPreviewTemplate(platformType, projectName, fileCount);
  }

  // Loading state while files generate
  getLoadingTemplate(projectName) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${projectName} - Loading</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:linear-gradient(135deg,#0f0f0f,#1a1a2e);color:white;display:flex;align-items:center;justify-content:center;height:100vh;overflow:hidden}
.loading{text-align:center}
.spinner{width:50px;height:50px;border:3px solid rgba(110,231,247,0.2);border-top-color:#6ee7f7;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 20px}
@keyframes spin{to{transform:rotate(360deg)}}
h1{font-size:1.5rem;margin-bottom:10px;background:linear-gradient(135deg,#0ea5e9,#6ee7f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
p{color:#94a3b8;font-size:0.9rem}
</style></head>
<body>
<div class="loading">
  <div class="spinner"></div>
  <h1>${projectName}</h1>
  <p>Building your app... 🚀</p>
</div>
</body></html>`;
  }

  // Get preview template based on platform type
  getPreviewTemplate(platformType, projectName, fileCount) {
    const templates = {
      social: () => this.generateSocialPreview(projectName, fileCount),
      ecommerce: () => this.generateEcommercePreview(projectName, fileCount),
      streaming: () => this.generateStreamingPreview(projectName, fileCount),
      saas: () => this.generateSaasPreview(projectName, fileCount),
      ai: () => this.generateAIPreview(projectName, fileCount),
      default: () => this.generateDefaultPreview(projectName, fileCount)
    };

    return (templates[platformType] || templates.default)();
  }

  // Social Media Platform Preview
  generateSocialPreview(name, fileCount) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#fafafa;color:#0f172a}
.navbar{background:white;border-bottom:1px solid #e5e7eb;padding:12px 20px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:10}
.logo{font-size:1.4rem;font-weight:900;background:linear-gradient(135deg,#f97316,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-icons{margin-left:auto;display:flex;gap:16px;font-size:1.2rem}
.nav-icon{cursor:pointer;opacity:0.7;transition:opacity 0.2s}.nav-icon:hover{opacity:1}
.layout{display:flex;max-width:935px;margin:24px auto;gap:24px;padding:0 20px}
.feed{flex:1}
.stories-bar{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:20px;display:flex;gap:16px;overflow-x:auto}
.story{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;min-width:60px}
.story-ring{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ec4899,#a855f7);padding:2px}
.story-avatar{width:100%;height:100%;border-radius:50%;background:#e5e7eb;border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.post{background:white;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:16px;overflow:hidden}
.post-header{padding:12px 16px;display:flex;align-items:center;gap:10px}
.post-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#a78bfa);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.8rem}
.post-user{font-weight:600;font-size:0.85rem}.post-time{font-size:0.72rem;color:#9ca3af;margin-top:1px}
.post-img{width:100%;height:280px;background:linear-gradient(135deg,#e0f2fe,#ddd6fe);display:flex;align-items:center;justify-content:center;font-size:3rem}
.post-actions{padding:12px 16px;display:flex;gap:16px;font-size:1.1rem}
.action-btn{background:none;border:none;cursor:pointer;font-size:1.1rem;transition:transform 0.2s}.action-btn:hover{transform:scale(1.2)}
.sidebar{width:300px}
.sidebar-card{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:16px}
.build-badge{position:fixed;bottom:16px;right:16px;background:linear-gradient(135deg,#0ea5e9,#a78bfa);color:white;padding:8px 14px;border-radius:20px;font-size:0.72rem;font-weight:700;display:flex;align-items:center;gap:6px}
.pulse{width:6px;height:6px;border-radius:50%;background:white;animation:pulse 1s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
</style></head>
<body>
<div class="navbar">
  <div class="logo">${name}</div>
  <div class="nav-icons">
    <span class="nav-icon" title="Home">🏠</span>
    <span class="nav-icon" title="Search">🔍</span>
    <span class="nav-icon" title="Create">➕</span>
    <span class="nav-icon" title="Messages">💬</span>
    <span class="nav-icon" title="Profile">👤</span>
  </div>
</div>
<div class="layout">
  <div class="feed">
    <div class="stories-bar">
      ${['🌟','🎨','🚀','💫','🎯','🌈','⚡'].map((e,i) => `
      <div class="story">
        <div class="story-ring"><div class="story-avatar">${e}</div></div>
        <div style="font-size:0.68rem">user${i+1}</div>
      </div>`).join('')}
    </div>
    ${[
      {emoji:'🏔️',user:'alex_photo',likes:'1,248',caption:'Mountain vibes 🏔️'},
      {emoji:'🌆',user:'city_lights',likes:'892',caption:'City lights ✨'},
      {emoji:'🍕',user:'foodie_life',likes:'2,341',caption:'Best pizza 🍕'},
    ].map(p => `
    <div class="post">
      <div class="post-header">
        <div class="post-avatar">${p.user[0].toUpperCase()}</div>
        <div><div class="post-user">${p.user}</div><div class="post-time">2h ago</div></div>
      </div>
      <div class="post-img">${p.emoji}</div>
      <div class="post-actions">
        <button class="action-btn">❤️</button>
        <button class="action-btn">💬</button>
        <button class="action-btn">📤</button>
      </div>
      <div style="padding:0 16px 12px;font-weight:600;font-size:0.83rem">${p.likes} likes</div>
      <div style="padding:0 16px 12px;font-size:0.83rem"><strong>${p.user}</strong> ${p.caption}</div>
    </div>`).join('')}
  </div>
  <div class="sidebar">
    <div class="sidebar-card">
      <div style="font-weight:700">Suggestions For You</div>
    </div>
  </div>
</div>
<div class="build-badge"><div class="pulse"></div>XOVA: ${fileCount} files</div>
</body></html>`;
  }

  // E-Commerce Platform Preview
  generateEcommercePreview(name, fileCount) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#f8fafc}
.navbar{background:white;box-shadow:0 1px 4px rgba(0,0,0,0.08);padding:12px 20px;display:flex;align-items:center;gap:20px;position:sticky;top:0;z-index:10}
.logo{font-size:1.3rem;font-weight:900;color:#1a73e8}
.search-bar{flex:1;max-width:500px;display:flex;background:#f1f5f9;border-radius:8px;overflow:hidden}
.search-bar input{flex:1;border:none;background:transparent;padding:8px 14px;font-size:0.85rem;outline:none}
.search-bar button{background:#1a73e8;color:white;border:none;padding:8px 16px;cursor:pointer}
.nav-right{margin-left:auto;display:flex;gap:16px;align-items:center}
.cart-btn{background:#1a73e8;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:6px}
.hero{background:linear-gradient(135deg,#1a73e8,#4f46e5);padding:50px 40px;color:white;text-align:center}
.hero h1{font-size:2.2rem;font-weight:900;margin-bottom:12px}
.hero p{font-size:1rem;opacity:0.85;margin-bottom:24px}
.hero-btn{background:white;color:#1a73e8;border:none;padding:12px 28px;border-radius:8px;font-weight:700;cursor:pointer}
.categories{display:flex;gap:12px;padding:20px 40px;overflow-x:auto}
.cat{background:white;border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;text-align:center;min-width:100px;cursor:pointer}
.section{padding:20px 40px}
.products{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}
.product{background:white;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb}
.product-img{height:160px;background:linear-gradient(135deg,#e0f2fe,#ddd6fe);display:flex;align-items:center;justify-content:center;font-size:2.5rem}
.product-info{padding:12px}
.product-name{font-size:0.82rem;font-weight:600;margin-bottom:4px}
.product-price{font-size:1rem;font-weight:800;color:#1a73e8}
.build-badge{position:fixed;bottom:16px;right:16px;background:linear-gradient(135deg,#0ea5e9,#a78bfa);color:white;padding:8px 14px;border-radius:20px;font-size:0.72rem;font-weight:700}
</style></head>
<body>
<div class="navbar">
  <div class="logo">${name}</div>
  <div class="search-bar">
    <input placeholder="Search products..."/>
    <button>🔍</button>
  </div>
  <div class="nav-right">
    <span>📦</span>
    <span>❤️</span>
    <button class="cart-btn">🛒 Cart</button>
  </div>
</div>
<div class="hero">
  <h1>Best Deals</h1>
  <p>Up to 80% off on millions of products</p>
  <button class="hero-btn">Shop Now →</button>
</div>
<div class="categories">
  ${[{e:'📱',n:'Electronics'},{e:'👗',n:'Fashion'},{e:'🏠',n:'Home'},{e:'⚽',n:'Sports'}].map(c => `<div class="cat"><div style="font-size:1.8rem">${c.e}</div><div style="font-size:0.75rem">${c.n}</div></div>`).join('')}
</div>
<div class="section">
  <h2 style="margin-bottom:16px">⚡ Flash Deals</h2>
  <div class="products">
    ${[
      {e:'📱',n:'iPhone 15 Pro',p:'₹1,29,900'},
      {e:'💻',n:'MacBook Air',p:'₹99,900'},
      {e:'🎧',n:'AirPods Pro',p:'₹22,900'},
      {e:'⌚',n:'Apple Watch',p:'₹41,900'},
    ].map(p => `
    <div class="product">
      <div class="product-img">${p.e}</div>
      <div class="product-info">
        <div class="product-name">${p.n}</div>
        <div class="product-price">${p.p}</div>
        <button style="width:100%;background:#1a73e8;color:white;border:none;padding:8px;border-radius:6px;margin-top:8px;cursor:pointer;font-size:0.75rem">Add to Cart</button>
      </div>
    </div>`).join('')}
  </div>
</div>
<div class="build-badge">⚡ XOVA: ${fileCount} files</div>
</body></html>`;
  }

  // Streaming Platform Preview
  generateStreamingPreview(name, fileCount) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#0a0a0a;color:white;display:flex;height:100vh;overflow:hidden}
.sidebar{width:240px;background:#111;padding:20px;display:flex;flex-direction:column;gap:8px;overflow-y:auto}
.logo{font-size:1.5rem;font-weight:900;color:#1db954;padding:8px 0 20px}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:0.85rem;color:#b3b3b3;transition:all 0.2s}
.nav-item:hover{background:rgba(255,255,255,0.1);color:white}
.main{flex:1;overflow-y:auto;padding:24px}
.hero{background:linear-gradient(180deg,#1db95420,transparent);padding:24px;border-radius:12px;margin-bottom:24px;display:flex;gap:20px;align-items:center}
.hero-cover{width:160px;height:160px;border-radius:8px;background:linear-gradient(135deg,#1db954,#0ea5e9);display:flex;align-items:center;justify-content:center;font-size:3rem}
.hero-title{font-size:2rem;font-weight:900}
.play-btn{background:#1db954;border:none;color:black;padding:12px 28px;border-radius:25px;font-weight:700;cursor:pointer}
.section{margin-bottom:28px}
.section-name{font-size:1.1rem;font-weight:800;margin-bottom:14px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.card{background:#181818;border-radius:10px;padding:14px;cursor:pointer}
.card-img{width:100%;aspect-ratio:1;border-radius:6px;background:linear-gradient(135deg,#1db95460,#0ea5e960);display:flex;align-items:center;justify-content:center;font-size:2rem;margin-bottom:12px}
.card-name{font-size:0.82rem;font-weight:600}
.build-badge{position:fixed;top:16px;right:16px;background:linear-gradient(135deg,#0ea5e9,#a78bfa);color:white;padding:6px 12px;border-radius:20px;font-size:0.68rem;font-weight:700;z-index:200}
</style></head>
<body>
<div class="sidebar">
  <div class="logo">🎵 ${name}</div>
  ${[['🏠','Home'],['🔍','Search'],['📚','Library']].map(([e,n]) => `<div class="nav-item">${e} <span>${n}</span></div>`).join('')}
</div>
<div class="main">
  <div class="hero">
    <div class="hero-cover">🎵</div>
    <div>
      <div style="font-size:0.75rem;color:#1db954;font-weight:700">PLAYLIST</div>
      <div class="hero-title">Top Hits 2024</div>
      <div style="color:#b3b3b3;margin-bottom:16px">120 songs • 8 hours</div>
      <button class="play-btn">▶ Play</button>
    </div>
  </div>
  <div class="section">
    <div class="section-name">🔥 Trending Now</div>
    <div class="cards">
      ${['🎤','🎸','🎹','🎼','🎻','🪗'].map((e,i) => `<div class="card"><div class="card-img">${e}</div><div class="card-name">Track ${i+1}</div></div>`).join('')}
    </div>
  </div>
</div>
<div class="build-badge">⚡ XOVA: ${fileCount} files</div>
</body></html>`;
  }

  // SaaS Dashboard Preview
  generateSaasPreview(name, fileCount) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name} Dashboard</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#f1f5f9;display:flex;height:100vh}
.sidebar{width:220px;background:white;padding:16px;display:flex;flex-direction:column;gap:4px;flex-shrink:0;border-right:1px solid #e2e8f0}
.brand{display:flex;align-items:center;gap:8px;padding:8px;margin-bottom:16px}
.brand-icon{width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#a78bfa);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700}
.brand-name{font-size:1rem;font-weight:800;color:#0f172a}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:0.82rem;color:#64748b;transition:all 0.2s}
.nav-item:hover{background:#f1f5f9;color:#6366f1}
.nav-item.active{background:rgba(99,102,241,0.1);color:#6366f1}
.main{flex:1;overflow-y:auto;padding:24px}
.page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
.page-title{font-size:1.4rem;font-weight:800;color:#0f172a}
.btn-primary{background:linear-gradient(135deg,#6366f1,#a78bfa);color:white;border:none;padding:8px 16px;border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.metric{background:white;border-radius:12px;padding:16px;border:1px solid #e2e8f0}
.metric-label{font-size:0.75rem;color:#64748b;font-weight:500;margin-bottom:8px}
.metric-val{font-size:1.6rem;font-weight:900;color:#0f172a}
.metric-change{font-size:0.72rem;font-weight:600;margin-top:4px;color:#22c55e}
.build-badge{position:fixed;bottom:16px;right:16px;background:linear-gradient(135deg,#6366f1,#a78bfa);color:white;padding:8px 14px;border-radius:20px;font-size:0.72rem;font-weight:700}
</style></head>
<body>
<div class="sidebar">
  <div class="brand"><div class="brand-icon">X</div><div class="brand-name">${name}</div></div>
  ${[['📊','Dashboard'],['📈','Analytics'],['👥','Team'],['🔑','API Keys']].map(([e,n],i) => `<div class="nav-item ${i===0?'active':''}">${e} <span>${n}</span></div>`).join('')}
</div>
<div class="main">
  <div class="page-header">
    <div class="page-title">Dashboard</div>
    <button class="btn-primary">+ New Project</button>
  </div>
  <div class="metrics">
    ${[['Total Users','12,847','↑ 18% this month'],['API Calls','1.2M','↑ 32% vs last week'],['Revenue','$48,290','↑ 12% MoM'],['Uptime','99.97%','↓ 0.01% incident']].map(([l,v,c]) => `
    <div class="metric">
      <div class="metric-label">${l}</div>
      <div class="metric-val">${v}</div>
      <div class="metric-change">${c}</div>
    </div>`).join('')}
  </div>
</div>
<div class="build-badge">⚡ XOVA: ${fileCount} files</div>
</body></html>`;
  }

  // AI Platform Preview
  generateAIPreview(name, fileCount) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#0f0f0f;color:#e2e8f0;display:flex;height:100vh}
.sidebar{width:260px;background:#161616;padding:16px;display:flex;flex-direction:column;border-right:1px solid #222;flex-shrink:0}
.logo{font-size:1.2rem;font-weight:900;background:linear-gradient(135deg,#a78bfa,#6ee7f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;padding:8px 0 20px}
.new-chat-btn{background:linear-gradient(135deg,#a78bfa,#6ee7f7);color:white;border:none;padding:10px 16px;border-radius:8px;font-size:0.82rem;font-weight:700;cursor:pointer;margin-bottom:16px}
.history{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:4px}
.history-item{padding:8px 10px;border-radius:6px;font-size:0.78rem;color:#94a3b8;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.history-item:hover{background:#222;color:#e2e8f0}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.chat-area{flex:1;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:20px}
.msg{display:flex;gap:12px;max-width:800px}
.msg.user{flex-direction:row-reverse;align-self:flex-end}
.msg-avatar{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700}
.msg.ai .msg-avatar{background:linear-gradient(135deg,#a78bfa,#6ee7f7)}
.msg.user .msg-avatar{background:#374151;color:#94a3b8}
.msg-content{padding:12px 16px;border-radius:12px;font-size:0.85rem}
.msg.ai .msg-content{background:#1e1e2e;border:1px solid #2d2d3d}
.msg.user .msg-content{background:#2d2d3d}
.input-area{padding:20px;border-top:1px solid #222}
.input-wrap{background:#1e1e1e;border:1px solid #333;border-radius:12px;display:flex;align-items:flex-end;gap:8px;padding:10px 14px}
.chat-input{flex:1;background:none;border:none;color:#e2e8f0;font-size:0.85rem;resize:none;outline:none;max-height:120px;font-family:inherit}
.send-btn{background:linear-gradient(135deg,#a78bfa,#6ee7f7);border:none;color:white;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:0.9rem;flex-shrink:0}
.build-badge{position:fixed;top:16px;right:16px;background:linear-gradient(135deg,#a78bfa,#6ee7f7);color:white;padding:6px 12px;border-radius:20px;font-size:0.68rem;font-weight:700;z-index:200}
</style></head>
<body>
<div class="sidebar">
  <div class="logo">✦ ${name}</div>
  <button class="new-chat-btn">+ New Conversation</button>
  <div class="history">
    ${['Build a REST API','Explain transformers','Debug React hook','Generate SQL'].map((h,i) => `<div class="history-item ${i===0?'active':''}">${h}</div>`).join('')}
  </div>
</div>
<div class="main">
  <div class="chat-area">
    <div class="msg ai">
      <div class="msg-avatar">X</div>
      <div class="msg-content">
        👋 Hello! I'm <strong>${name} AI</strong>. I can help you with code generation, debugging, and architecture design.<br/><br/>
        What would you like to build today?
      </div>
    </div>
  </div>
  <div class="input-area">
    <div class="input-wrap">
      <textarea class="chat-input" placeholder="Ask anything..." rows="1"></textarea>
      <button class="send-btn">↑</button>
    </div>
  </div>
</div>
<div class="build-badge">⚡ XOVA: ${fileCount} files</div>
</body></html>`;
  }

  // Default Full-Stack App Preview
  generateDefaultPreview(name, fileCount) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:#f8fafc}
.navbar{background:white;border-bottom:1px solid #e2e8f0;padding:14px 24px;display:flex;align-items:center;gap:20px}
.logo{font-size:1.2rem;font-weight:900;background:linear-gradient(135deg,#0ea5e9,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:20px;font-size:0.85rem;color:#64748b;margin-left:auto}
.nav-links a{text-decoration:none;color:inherit;cursor:pointer}
.nav-links a:hover{color:#0ea5e9}
.hero{padding:80px 40px;text-align:center;background:linear-gradient(170deg,#e0f2fe,#faf5ff)}
.hero h1{font-size:2.5rem;font-weight:900;color:#0f172a;margin-bottom:16px}
.hero p{font-size:1rem;color:#64748b;max-width:500px;margin:0 auto 28px}
.btn-group{display:flex;gap:12px;justify-content:center}
.btn{padding:12px 24px;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;border:none}
.btn-primary{background:linear-gradient(135deg,#0ea5e9,#7c3aed);color:white}
.btn-outline{background:white;border:1px solid #e2e8f0;color:#374151}
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1000px;margin:40px auto;padding:0 40px}
.feature{background:white;border-radius:12px;padding:24px;border:1px solid #e2e8f0;text-align:center}
.feature-icon{font-size:2rem;margin-bottom:12px}
.feature h3{font-size:0.9rem;font-weight:700;margin-bottom:6px}
.feature p{font-size:0.8rem;color:#64748b}
.build-badge{position:fixed;bottom:16px;right:16px;background:linear-gradient(135deg,#0ea5e9,#a78bfa);color:white;padding:8px 14px;border-radius:20px;font-size:0.72rem;font-weight:700}
</style></head>
<body>
<div class="navbar">
  <div class="logo">${name}</div>
  <div class="nav-links">
    <a>Home</a>
    <a>Features</a>
    <a>Docs</a>
    <a>Pricing</a>
  </div>
  <button style="background:linear-gradient(135deg,#0ea5e9,#7c3aed);color:white;border:none;padding:8px 16px;border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer">Get Started</button>
</div>
<div class="hero">
  <h1>Welcome to ${name}</h1>
  <p>A production-ready full-stack application built by XOVA AI. Complete with authentication, APIs, database, and deployment configuration.</p>
  <div class="btn-group">
    <button class="btn btn-primary">Get Started →</button>
    <button class="btn btn-outline">View Docs</button>
  </div>
</div>
<div class="features">
  ${[['⚡','Fast & Scalable','Built for production with optimized queries'],['🔐','Secure Auth','JWT tokens and 2FA support'],['📊','Analytics','Real-time dashboards and insights']].map(([e,h,p]) => `
  <div class="feature">
    <div class="feature-icon">${e}</div>
    <h3>${h}</h3>
    <p>${p}</p>
  </div>`).join('')}
</div>
<div class="build-badge">⚡ XOVA: ${fileCount} files generated</div>
</body></html>`;
  }

  // Generate full preview (final state)
  generateFullPreviewHTML(projectName, platformType) {
    return this.getPreviewTemplate(platformType, projectName, 0);
  }
}

window.xovaPreview = new XOVAPreview();
