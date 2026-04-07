/* ============================================================
   XOVA — streamer.js
   Live code streaming engine: file-by-file generation
   with character streaming, progress tracking, error detection
============================================================ */

class XOVAStreamer {
  constructor() {
    this.files = [];
    this.currentFileIndex = 0;
    this.isStreaming = false;
    this.isPaused = false;
    this.totalFiles = 0;
    this.projectName = '';
    this.platformType = 'default';
    this.generatedFiles = {}; // stores all generated code

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
    this.errorDetector = document.getElementById('errorDetector');
    this.errorText = document.getElementById('errorText');
    this.buildCompleteBanner = document.getElementById('buildCompleteBanner');
    this.buildCompleteMsg = document.getElementById('buildCompleteMsg');
    this.previewOverlay = document.getElementById('previewOverlay');

    // Streaming config for realistic speed
    this.streamSpeed = 4; // chars per tick
    this.streamInterval = 10; // ms per tick
  }

  // Start build sequence with real-time simulation
  async startBuild(planData) {
    const { projectName, platformType, platformConfig } = planData;
    this.projectName = projectName;
    this.platformType = platformType;

    // Get files list
    this.files = window.XOVA_DATA.generateFilesList(platformType, projectName);
    this.totalFiles = this.files.length;
    this.currentFileIndex = 0;
    this.generatedFiles = {};
    this.isStreaming = true;

    // Setup UI
    this.buildProjectName.textContent = projectName;
    this.fileCountBadge.textContent = this.totalFiles;
    this.renderFileList();
    this.updateProgress(0);

    // Ghost reacts
    window.xovaGhost.onBuilding();

    // Build status
    this.setBuildStatus('🔥 Generating code…');

    // Hide preview overlay with animation
    setTimeout(() => {
      if (this.previewOverlay) {
        this.previewOverlay.style.opacity = '0';
        this.previewOverlay.style.transition = 'opacity 0.5s';
        setTimeout(() => { this.previewOverlay.style.display = 'none'; }, 500);
      }
    }, 2000);

    // Stream all files
    await this.streamAllFiles();
  }

  // Render file list in sidebar with interactive state
  renderFileList() {
    this.fileList.innerHTML = '';
    this.files.forEach((file, i) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.id = `file-item-${i}`;
      item.dataset.index = i;
      item.innerHTML = `
        <i class="${this.getFileIcon(file.name)}"></i>
        <span class="file-name" title="${file.path}${file.name}">${file.name}</span>
      `;
      item.addEventListener('click', () => {
        if (this.generatedFiles[file.name]) {
          this.displayCode(file.name, this.generatedFiles[file.name]);
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

  // Stream all files sequentially with realistic timing
  async streamAllFiles() {
    for (let i = 0; i < this.files.length; i++) {
      if (!this.isStreaming) break;
      await this.streamFile(i);
      await this.delay(200); // brief pause between files
    }

    if (this.isStreaming) {
      await this.delay(500);
      this.onBuildComplete();
    }
  }

  // Stream a single file with line-by-line generation
  async streamFile(index) {
    const file = this.files[index];
    this.currentFileIndex = index;

    // Update file item to generating state
    const fileItem = document.getElementById(`file-item-${index}`);
    if (fileItem) {
      fileItem.classList.add('active', 'generating');
      fileItem.innerHTML += `<div class="file-stream-bar"></div>`;
      fileItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Set active tab
    this.activeFileName.textContent = file.name;

    // Get code for this file
    const code = window.XOVA_DATA.getCodeSample(file.name, this.projectName, this.platformType);
    this.generatedFiles[file.name] = '';

    // Clear code editor
    this.codeContent.innerHTML = '';
    this.lineNumbers.innerHTML = '';

    // Update ETA dynamically
    const remaining = this.files.length - index;
    const avgTimePerFile = 1.5; // seconds
    const etaSeconds = Math.round(remaining * avgTimePerFile);
    this.generationEta.textContent = `~${etaSeconds}s remaining`;

    // Status update
    this.setBuildStatus(`📝 Writing ${file.name}…`);

    // Stream code character by character with line awareness
    await this.streamCodeToEditor(code, file.name);

    // Mark file as complete
    this.generatedFiles[file.name] = code;
    if (fileItem) {
      fileItem.classList.remove('active', 'generating');
      fileItem.classList.add('complete');
      // Remove stream bar
      const streamBar = fileItem.querySelector('.file-stream-bar');
      if (streamBar) streamBar.remove();
      // Add checkmark animation
      fileItem.style.animation = 'none';
      fileItem.style.backgroundColor = 'rgba(34,197,94,0.08)';
      setTimeout(() => { fileItem.style.backgroundColor = ''; }, 1000);
    }

    // Update progress
    const progress = Math.round(((index + 1) / this.totalFiles) * 100);
    this.updateProgress(progress);

    // Update live preview in real-time
    window.xovaPreview.updatePreview(this.generatedFiles, this.projectName, this.platformType);

    // Occasionally simulate error detection and auto-fix
    if (Math.random() < 0.02 && index > 2) {
      await this.simulateErrorDetection();
    }
  }

  // Stream code to editor with line-by-line rendering
  async streamCodeToEditor(code, fileName) {
    const lines = code.split('\n');
    let displayedLines = [];
    let charIndex = 0;
    const totalChars = code.length;

    // Process line by line with character streaming
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
          
          // Update overall progress
          charIndex += this.streamSpeed;
          
          await this.delay(this.streamInterval);
        }
      }

      displayedLines[lineIdx] = line;
    }

    // Final render
    this.renderCodeInEditor(lines, lines.length - 1);
  }

  // Render code with syntax highlighting and live line numbers
  renderCodeInEditor(lines, currentLineIdx) {
    // Line numbers with current line highlight
    const lineNumsHtml = lines.map((_, i) =>
      `<div style="color:${i === currentLineIdx ? '#0ea5e9' : '#94a3b8'};font-weight:${i === currentLineIdx ? '600' : '400'}">${i + 1}</div>`
    ).join('');
    this.lineNumbers.innerHTML = lineNumsHtml;

    // Code content with syntax highlighting
    const codeHtml = lines.map((line, i) => {
      const highlighted = this.syntaxHighlight(line);
      const isCurrent = i === currentLineIdx;
      return `<div style="background:${isCurrent ? 'rgba(14,165,233,0.06)' : 'transparent'};min-height:1.4em;transition:background 0.2s">${highlighted}<span style="display:${isCurrent ? 'inline-block' : 'none'};animation:blink 0.7s infinite" class="stream-cursor">█</span></div>`;
    }).join('');
    this.codeContent.innerHTML = codeHtml;

    // Auto-scroll to bottom
    const editor = document.getElementById('codeEditor');
    if (editor) editor.scrollTop = editor.scrollHeight;
  }

  // Syntax highlighter for multiple languages
  syntaxHighlight(line) {
    if (!line.trim()) return '&nbsp;';

    let result = this.escapeHtml(line);

    // Comments (both // and # styles)
    result = result.replace(/(\/\/.*$|#.*$)/g, '<span class="code-cmt">$1</span>');
    
    // Strings (quotes and backticks)
    result = result.replace(/(&quot;[^&quot;]*&quot;|&#x27;[^&#x27;]*&#x27;|`[^`]*`)/g, '<span class="code-str">$1</span>');
    
    // JavaScript/TypeScript Keywords
    const jsKeywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'import', 'export', 'default', 'from', 'as', 'class', 'extends', 'interface', 'type', 'enum', 'namespace', 'public', 'private', 'protected', 'readonly', 'static', 'implements'];
    jsKeywords.forEach(kw => {
      result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span class="code-kw">$1</span>');
    });
    
    // SQL Keywords
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'WHERE', 'FROM', 'JOIN', 'ON', 'GROUP', 'BY', 'ORDER', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN'];
    sqlKeywords.forEach(kw => {
      result = result.replace(new RegExp(`\\b(${kw})\\b`, 'gi'), '<span class="code-kw">$1</span>');
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

  // Display existing code when clicking completed file
  displayCode(fileName, code) {
    this.activeFileName.textContent = fileName;
    const lines = code.split('\n');
    const lineNumsHtml = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    this.lineNumbers.innerHTML = lineNumsHtml;
    this.codeContent.innerHTML = lines.map(line =>
      `<div>${this.syntaxHighlight(line) || '&nbsp;'}</div>`
    ).join('');
  }

  // Simulate error detection and auto-fix with visual feedback
  async simulateErrorDetection() {
    const errors = [
      'Missing type annotation on line 47',
      'Unhandled promise rejection in async function',
      'Import path resolution mismatch',
      'React hook dependency array incomplete',
      'Database query missing await keyword',
      'Unused variable declaration detected',
      'Missing error boundary in component tree'
    ];

    const error = errors[Math.floor(Math.random() * errors.length)];
    this.errorText.textContent = `Detected: ${error} — auto-fixing…`;
    this.errorDetector.style.display = 'flex';
    window.xovaGhost.onError();

    await this.delay(1500);
    
    // Show fixed state
    this.errorText.textContent = '✓ Fixed automatically';
    this.errorDetector.style.backgroundColor = 'rgba(34,197,94,0.1)';
    this.errorDetector.style.borderTopColor = 'rgba(34,197,94,0.3)';
    this.errorText.style.color = '#15803d';
    const icon = this.errorDetector.querySelector('i');
    if (icon) icon.style.color = '#22c55e';

    await this.delay(1000);
    
    // Reset
    this.errorDetector.style.display = 'none';
    this.errorDetector.style.backgroundColor = '';
    this.errorDetector.style.borderTopColor = '';
    this.errorText.style.color = '';
    if (icon) icon.style.color = '';
  }

  // Update progress bar with smooth animation
  updateProgress(percent) {
    this.buildProgressFill.style.width = `${percent}%`;
    this.buildProgressText.textContent = `${percent}%`;
  }

  setBuildStatus(text) {
    this.buildStatusText.textContent = text;
  }

  // Build complete with summary
  onBuildComplete() {
    this.isStreaming = false;
    this.updateProgress(100);
    this.setBuildStatus('✅ Build Complete!');
    this.generationEta.textContent = 'All files generated!';

    // Calculate stats
    const totalLines = Object.values(this.generatedFiles)
      .reduce((sum, code) => sum + code.split('\n').length, 0);
    const totalSize = Object.values(this.generatedFiles)
      .reduce((sum, code) => sum + code.length, 0);
    
    const sizeKb = (totalSize / 1024).toFixed(1);
    
    // Show complete banner with stats
    this.buildCompleteMsg.textContent = `Generated ${this.totalFiles} files with ${totalLines.toLocaleString()} lines of production code (${sizeKb}KB total)`;
    this.buildCompleteBanner.style.display = 'flex';

    // Ghost celebrates
    window.xovaGhost.onCelebrate();
    window.xovaGhost.say(`Build complete! ${this.totalFiles} files ready 🎉`, 4000);

    // Save to projects
    window.xovaProjects.saveProject({
      name: this.projectName,
      platformType: this.platformType,
      files: this.generatedFiles,
      fileCount: this.totalFiles,
      totalLines,
      totalSize: sizeKb,
      status: 'complete',
      timestamp: new Date().toISOString()
    });

    // Update preview to final state
    window.xovaPreview.renderFinalPreview(this.generatedFiles, this.projectName, this.platformType);
  }

  // Export all files as downloadable text
  exportAsZip() {
    let content = `XOVA Generated Project: ${this.projectName}\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Platform: ${this.platformType}\n`;
    content += `Files: ${this.totalFiles}\n`;
    content += `${'='.repeat(60)}\n\n`;

    Object.entries(this.generatedFiles).forEach(([name, code]) => {
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

    window.xovaApp.showToast(`Exported ${this.totalFiles} files successfully!`, 'success');
    window.xovaGhost.say('Project exported! 📦', 2000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  pause() { this.isPaused = true; }
  resume() { this.isPaused = false; }
  stop() { this.isStreaming = false; }
}

window.xovaStreamer = new XOVAStreamer();
