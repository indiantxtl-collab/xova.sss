/* ============================================================
   XOVA ENGINE — streamer.js
   REAL Code Streaming: Line-by-line streaming of generated
   code with live preview updates
============================================================ */

class XOVAEngineStreamer {
  constructor() {
    this.files = [];
    this.currentFileIndex = 0;
    this.isStreaming = false;
    this.generatedCode = {};
    this.projectName = '';

    // DOM refs
    this.fileList = document.getElementById('fileList');
    this.fileCountBadge = document.getElementById('fileCountBadge');
    this.codeContent = document.getElementById('codeContent');
    this.lineNumbers = document.getElementById('lineNumbers');
    this.activeFileName = document.getElementById('activeFileName');
    this.buildProgressFill = document.getElementById('buildProgressFill');
    this.buildProgressText = document.getElementById('buildProgressText');
    this.buildStatusText = document.getElementById('buildStatusText');
    this.buildProjectName = document.getElementById('buildProjectName');
    this.generationEta = document.getElementById('generationEta');
    this.buildCompleteBanner = document.getElementById('buildCompleteBanner');
    this.buildCompleteMsg = document.getElementById('buildCompleteMsg');
    this.previewOverlay = document.getElementById('previewOverlay');

    // Streaming config
    this.streamSpeed = 8; // chars per tick
    this.streamInterval = 12; // ms per tick
  }

  // Start streaming build
  async startBuild(planData) {
    const { appName } = planData;
    this.projectName = appName;
    this.projectId = Date.now().toString();
    this.isStreaming = true;

    // Generate all code from plan
    const allFiles = await window.xovaGenerator.generateProject(planData);
    this.generatedCode = allFiles;

    // Get list of files to stream
    this.files = Object.keys(allFiles).map((name, idx) => ({
      name,
      code: allFiles[name],
      index: idx,
      size: (allFiles[name].length / 1024).toFixed(1)
    }));

    // Setup UI
    this.buildProjectName.textContent = appName;
    this.fileCountBadge.textContent = this.files.length;
    this.renderFileList();
    this.updateProgress(0);

    // Ghost reacts
    window.xovaGhost.onBuilding();

    // Build status
    this.setBuildStatus('🔥 Streaming code generation…');

    // Hide preview overlay
    setTimeout(() => {
      if (this.previewOverlay) {
        this.previewOverlay.style.opacity = '0';
        this.previewOverlay.style.transition = 'opacity 0.5s';
        setTimeout(() => { this.previewOverlay.style.display = 'none'; }, 500);
      }
    }, 1500);

    // Stream all files
    await this.streamAllFiles();
  }

  // Render file list in sidebar
  renderFileList() {
    this.fileList.innerHTML = '';
    this.files.forEach((file, i) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.id = `file-item-${i}`;
      item.dataset.index = i;
      item.innerHTML = `
        <i class="fas ${this.getFileIcon(file.name)}"></i>
        <span class="file-name" title="${file.name}">${file.name}</span>
        <span class="file-size">${file.size}KB</span>
      `;
      item.addEventListener('click', () => {
        if (this.generatedCode[file.name]) {
          this.displayCode(file.name, this.generatedCode[file.name]);
        }
      });
      this.fileList.appendChild(item);
    });
  }

  getFileIcon(name) {
    const ext = name.split('.').pop();
    const icons = {
      tsx: 'fab fa-react', ts: 'fas fa-code', js: 'fab fa-js-square',
      json: 'fas fa-brackets-curly', yml: 'fas fa-cog', yaml: 'fas fa-cog',
      sql: 'fas fa-database', md: 'fas fa-file-alt', prisma: 'fas fa-database',
      conf: 'fas fa-cog', css: 'fab fa-css3-alt', html: 'fab fa-html5',
      env: 'fas fa-key', dockerfile: 'fab fa-docker', sh: 'fas fa-terminal'
    };
    return icons[ext] || 'fas fa-file-code';
  }

  // Stream all files sequentially
  async streamAllFiles() {
    for (let i = 0; i < this.files.length; i++) {
      if (!this.isStreaming) break;
      await this.streamFile(i);
      await this.delay(150); // brief pause between files
    }

    if (this.isStreaming) {
      await this.delay(300);
      this.onBuildComplete();
    }
  }

  // Stream single file with character streaming
  async streamFile(index) {
    const file = this.files[index];
    this.currentFileIndex = index;

    // Update file item state
    const fileItem = document.getElementById(`file-item-${index}`);
    if (fileItem) {
      fileItem.classList.add('active', 'generating');
      fileItem.innerHTML += `<div class="file-stream-bar"></div>`;
      fileItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Set active tab
    this.activeFileName.textContent = file.name;

    // Clear code editor
    this.codeContent.innerHTML = '';
    this.lineNumbers.innerHTML = '';

    // Update ETA
    const remaining = this.files.length - index;
    const avgTimePerFile = 1.2; // seconds
    const etaSeconds = Math.round(remaining * avgTimePerFile);
    this.generationEta.textContent = `~${etaSeconds}s remaining`;

    // Status update
    this.setBuildStatus(`📝 Streaming ${file.name}…`);

    // Stream code character by character
    await this.streamCodeToEditor(file.code, file.name);

    // Mark file as complete
    if (fileItem) {
      fileItem.classList.remove('active', 'generating');
      fileItem.classList.add('complete');
      const streamBar = fileItem.querySelector('.file-stream-bar');
      if (streamBar) streamBar.remove();
      fileItem.style.animation = 'none';
      fileItem.style.backgroundColor = 'rgba(34,197,94,0.08)';
      setTimeout(() => { fileItem.style.backgroundColor = ''; }, 800);
    }

    // Update progress
    const progress = Math.round(((index + 1) / this.files.length) * 100);
    this.updateProgress(progress);

    // Update live preview
    window.xovaPreview.updatePreview(this.generatedCode, this.projectName, 'live');
  }

  // Stream code to editor with line awareness
  async streamCodeToEditor(code, fileName) {
    const lines = code.split('\n');
    let displayedLines = [];
    let charIndex = 0;

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      let lineBuffer = '';

      for (let charIdx = 0; charIdx <= line.length; charIdx++) {
        if (!this.isStreaming) return;

        if (charIdx < line.length) {
          lineBuffer += line[charIdx];
        }

        // Update display every N chars or at line end
        if (charIdx % this.streamSpeed === 0 || charIdx === line.length) {
          displayedLines[lineIdx] = lineBuffer;
          this.renderCodeInEditor(displayedLines, lineIdx);
          charIndex += this.streamSpeed;
          await this.delay(this.streamInterval);
        }
      }

      displayedLines[lineIdx] = line;
    }

    // Final render
    this.renderCodeInEditor(lines, lines.length - 1);
  }

  // Render code with syntax highlighting
  renderCodeInEditor(lines, currentLineIdx) {
    // Line numbers
    const lineNumsHtml = lines.map((_, i) =>
      `<div style="color:${i === currentLineIdx ? '#0ea5e9' : '#94a3b8'};font-weight:${i === currentLineIdx ? '600' : '400'}">${i + 1}</div>`
    ).join('');
    this.lineNumbers.innerHTML = lineNumsHtml;

    // Code content with highlighting
    const codeHtml = lines.map((line, i) => {
      const highlighted = this.syntaxHighlight(line);
      const isCurrent = i === currentLineIdx;
      return `<div style="background:${isCurrent ? 'rgba(14,165,233,0.06)' : 'transparent'};min-height:1.4em;transition:background 0.2s">${highlighted}<span style="display:${isCurrent ? 'inline-block' : 'none'};width:2px;height:1.4em;background:#0ea5e9;animation:blink 0.8s infinite;margin-left:2px"></span></div>`;
    }).join('');
    this.codeContent.innerHTML = codeHtml;

    // Auto-scroll to bottom
    const editor = document.getElementById('codeEditor');
    if (editor) editor.scrollTop = editor.scrollHeight;
  }

  // Syntax highlighter
  syntaxHighlight(line) {
    if (!line.trim()) return '&nbsp;';

    let result = this.escapeHtml(line);

    // Comments
    result = result.replace(/(\/\/.*$|#.*$)/g, '<span class="code-cmt">$1</span>');

    // Strings
    result = result.replace(/(&quot;[^&quot;]*&quot;|&#x27;[^&#x27;]*&#x27;|`[^`]*`)/g, '<span class="code-str">$1</span>');

    // Keywords
    const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'class', 'interface', 'type', 'enum'];
    keywords.forEach(kw => {
      result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="code-kw">$1</span>');
    });

    // Numbers
    result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-num">$1</span>');

    // Function calls
    result = result.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, '<span class="code-fn">$1</span>');

    // HTML Tags
    result = result.replace(/(&lt;\/?\w+[^&gt;]*&gt;)/g, '<span class="code-tag">$1</span>');

    return result;
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  // Display code when clicking file
  displayCode(fileName, code) {
    this.activeFileName.textContent = fileName;
    const lines = code.split('\n');
    
    const lineNumsHtml = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    this.lineNumbers.innerHTML = lineNumsHtml;
    
    this.codeContent.innerHTML = lines.map(line =>
      `<div>${this.syntaxHighlight(line) || '&nbsp;'}</div>`
    ).join('');
  }

  // Update progress
  updateProgress(percent) {
    this.buildProgressFill.style.width = `${percent}%`;
    this.buildProgressText.textContent = `${percent}%`;
  }

  setBuildStatus(text) {
    this.buildStatusText.textContent = text;
  }

  // Build complete
  onBuildComplete() {
    this.isStreaming = false;
    this.updateProgress(100);
    this.setBuildStatus('✅ Build Complete!');
    this.generationEta.textContent = 'All files streamed!';

    // Calculate stats
    const totalLines = Object.values(this.generatedCode)
      .reduce((sum, code) => sum + code.split('\n').length, 0);
    const totalSize = Object.values(this.generatedCode)
      .reduce((sum, code) => sum + code.length, 0);

    const sizeKb = (totalSize / 1024).toFixed(1);

    // Show complete banner
    this.buildCompleteMsg.textContent = `Generated ${this.files.length} files with ${totalLines.toLocaleString()} lines of code (${sizeKb}KB total)`;
    this.buildCompleteBanner.style.display = 'flex';

    // Ghost celebrates
    window.xovaGhost.onCelebrate();
    window.xovaGhost.say(`Build complete! ${this.files.length} files ready 🎉`, 4000);

    // Enable publish button
    const publishBtn = document.getElementById('publishBtn');
    if (publishBtn) {
      publishBtn.disabled = false;
    }

    // Save to projects
    window.xovaProjects.saveProject({
      name: this.projectName,
      files: this.generatedCode,
      fileCount: this.files.length,
      totalLines,
      totalSize: sizeKb,
      status: 'complete',
      timestamp: new Date().toISOString(),
      projectId: this.projectId
    });

    // Final preview
    window.xovaPreview.renderFinalPreview(this.generatedCode, this.projectName);
  }

  // Export as ZIP
  exportAsZip() {
    let content = `XOVA Generated Project: ${this.projectName}\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Files: ${this.files.length}\n`;
    content += `${'='.repeat(60)}\n\n`;

    Object.entries(this.generatedCode).forEach(([name, code]) => {
      content += `\n${'='.repeat(60)}\n`;
      content += `FILE: ${name}\n`;
      content += `Lines: ${code.split('\n').length} | Size: ${(code.length / 1024).toFixed(2)}KB\n`;
      content += `${'='.repeat(60)}\n`;
      content += code + '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.projectName}-XOVA-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    window.xovaApp.showToast(`Exported ${this.files.length} files!`, 'success');
    window.xovaGhost.say('Project exported! 📦', 2000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isStreaming = false;
  }
}

window.xovaStreamer = new XOVAEngineStreamer();
