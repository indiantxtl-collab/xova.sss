# XOVA API Reference

Complete API documentation for the XOVA AI App Builder Engine.

---

## Table of Contents

1. [Planner API](#planner-api)
2. [Generator API](#generator-api)
3. [Streamer API](#streamer-api)
4. [Preview API](#preview-api)
5. [Main App API](#main-app-api)

---

## Planner API

**File**: `js/engine/planner.js`

The planning engine that analyzes prompts and generates architecture plans.

### `analyzePrompt(prompt)`

Analyzes a user prompt and returns a complete architecture plan.

**Parameters**:
- `prompt` (string): User's app description

**Returns**:
```javascript
{
  prompt: string,
  appName: string,
  description: string,
  appType: string,
  requirements: {
    authentication: boolean,
    payment: boolean,
    realtime: boolean,
    search: boolean,
    media: boolean,
    analytics: boolean,
    multiTenant: boolean,
    messaging: boolean,
    socialFeatures: boolean,
    apiFirst: boolean,
    mobile: boolean,
    ai: boolean
  },
  pages: string[],
  apis: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    desc: string
  }>,
  techStack: {
    frontend: string[],
    backend: string[],
    database: string[],
    devops: string[]
  },
  dbSchema: {
    [tableName]: string[]
  },
  fileCount: number,
  estimatedComplexity: 'low' | 'medium' | 'high'
}
```

**Example**:
```javascript
const plan = await window.xovaPlanner.analyzePrompt(
  "Build a social media platform like Instagram"
);
console.log(plan.appName); // "Instagram-like-app"
console.log(plan.pages.length); // 15
console.log(plan.apis.length); // 18
```

---

### `startPlanning(prompt, model)`

Starts the interactive planning session with UI updates.

**Parameters**:
- `prompt` (string): User's app description
- `model` (string): 'super', 'new', or 'pro'

**Side Effects**:
- Displays planning page
- Shows architecture visualization
- Enables chat refinement
- Updates ghost assistant

**Example**:
```javascript
await window.xovaPlanner.startPlanning(userPrompt, 'super');
```

---

### `getPlanData()`

Retrieves the current plan data.

**Returns**: Plan object (same structure as `analyzePrompt`)

**Example**:
```javascript
const currentPlan = window.xovaPlanner.getPlanData();
```

---

### `extractRequirements(prompt)`

Extracts feature requirements from prompt text.

**Parameters**:
- `prompt` (string): User input text

**Returns**:
```javascript
{
  authentication: boolean,
  payment: boolean,
  realtime: boolean,
  search: boolean,
  media: boolean,
  analytics: boolean,
  multiTenant: boolean,
  messaging: boolean,
  socialFeatures: boolean,
  apiFirst: boolean,
  mobile: boolean,
  ai: boolean
}
```

---

### `identifyAppStructure(prompt, requirements)`

Determines the app type and primary structure.

**Parameters**:
- `prompt` (string): User input
- `requirements` (object): Features object from `extractRequirements`

**Returns**:
```javascript
{
  appType: string, // 'social-media', 'ecommerce', 'streaming', etc.
  hasBackend: boolean,
  isMobileFirst: boolean,
  isRealtime: boolean,
  isScale: boolean
}
```

---

### `determineTechStack(structure, requirements)`

Builds tech stack based on app needs.

**Parameters**:
- `structure` (object): From `identifyAppStructure`
- `requirements` (object): From `extractRequirements`

**Returns**:
```javascript
{
  frontend: string[],     // ['React 18', 'TypeScript', ...]
  backend: string[],      // ['Node.js', 'Express', ...]
  database: string[],     // ['PostgreSQL', 'Redis', ...]
  devops: string[]        // ['Docker', 'GitHub Actions', ...]
}
```

---

### `generatePages(structure, requirements)`

Creates list of pages based on app type.

**Parameters**:
- `structure` (object): From `identifyAppStructure`
- `requirements` (object): From `extractRequirements`

**Returns**: `string[]` - List of page names

**Example**:
```javascript
const pages = window.xovaPlanner.generatePages(structure, requirements);
// ['Home / Landing', 'Home Feed', 'Explore', 'Profile', 'Messages', ...]
```

---

### `designAPIs(structure, pages, requirements)`

Generates API endpoint list.

**Parameters**:
- `structure` (object): From `identifyAppStructure`
- `pages` (string[]): From `generatePages`
- `requirements` (object): From `extractRequirements`

**Returns**:
```javascript
Array<{
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  desc: string
}>
```

---

### `createDatabaseSchema(structure, pages, requirements)`

Generates database schema.

**Parameters**:
- `structure` (object): From `identifyAppStructure`
- `pages` (string[]): From `generatePages`
- `requirements` (object): From `extractRequirements`

**Returns**:
```javascript
{
  [tableName]: string[], // ['id', 'user_id', 'content', ...]
  ...
}
```

---

## Generator API

**File**: `js/engine/generator.js`

Generates real production code from plans.

### `generateProject(planData)`

Generates complete project with all files.

**Parameters**:
- `planData` (object): Plan from `xovaPlanner.analyzePrompt()`

**Returns**:
```javascript
{
  'package.json': string,
  'server.js': string,
  'database/schema.sql': string,
  'frontend/index.html': string,
  'frontend/styles.css': string,
  'Dockerfile': string,
  'docker-compose.yml': string,
  '.gitignore': string,
  // ... 60+ more files
}
```

**Example**:
```javascript
const plan = window.xovaPlanner.getPlanData();
const files = await window.xovaGenerator.generateProject(plan);
console.log(Object.keys(files).length); // 68
console.log(files['server.js']); // Full Express server code
```

---

### `generatePackageJson(appName, techStack)`

Generates package.json with dependencies.

**Parameters**:
- `appName` (string): Application name
- `techStack` (object): Tech stack configuration

**Returns**: JSON string

---

### `generateServer(apis, requirements, techStack)`

Generates Express.js server with all endpoints.

**Parameters**:
- `apis` (array): API endpoints list
- `requirements` (object): Features object
- `techStack` (object): Technology stack

**Returns**: JavaScript code string

---

### `generateDatabaseSchema(dbSchema)`

Generates PostgreSQL schema SQL.

**Parameters**:
- `dbSchema` (object): Database schema definition

**Returns**: SQL code string

---

### `generateDockerfile(techStack)`

Generates production Dockerfile.

**Parameters**:
- `techStack` (object): Technology stack

**Returns**: Dockerfile content string

---

### `generateDockerCompose(requirements)`

Generates docker-compose.yml with services.

**Parameters**:
- `requirements` (object): Feature requirements

**Returns**: YAML string

---

## Streamer API

**File**: `js/engine/streamer.js`

Streams generated code to UI in real-time.

### `startBuild(planData)`

Begins streaming build process.

**Parameters**:
- `planData` (object): Plan from planner

**Side Effects**:
- Generates all code
- Streams to editor
- Updates preview
- Shows progress

**Example**:
```javascript
const plan = window.xovaPlanner.getPlanData();
await window.xovaStreamer.startBuild(plan);
```

---

### `streamFile(index)`

Streams single file with character animation.

**Parameters**:
- `index` (number): File index to stream

**Example**:
```javascript
await window.xovaStreamer.streamFile(0); // Stream first file
```

---

### `updateProgress(percent)`

Updates progress bar.

**Parameters**:
- `percent` (number): 0-100

**Example**:
```javascript
window.xovaStreamer.updateProgress(50); // 50% complete
```

---

### `displayCode(fileName, code)`

Shows code for clicked file.

**Parameters**:
- `fileName` (string): File name
- `code` (string): File content

---

### `exportAsZip()`

Exports all generated files as downloadable ZIP.

**Side Effects**:
- Creates text file
- Triggers download
- Shows toast notification

**Example**:
```javascript
window.xovaStreamer.exportAsZip();
```

---

### `stop()`

Stops the streaming process.

**Example**:
```javascript
window.xovaStreamer.stop();
```

---

## Preview API

**File**: `js/engine/preview.js`

Manages live preview in iframe.

### `updatePreview(generatedCode, projectName, mode)`

Updates preview with latest generated code.

**Parameters**:
- `generatedCode` (object): Generated files object
- `projectName` (string): Project name
- `mode` (string): 'streaming' or 'live'

**Side Effects**:
- Injects HTML/CSS into iframe
- Updates live preview
- Shows responsive design

**Example**:
```javascript
window.xovaPreview.updatePreview(generatedCode, 'MyApp', 'streaming');
```

---

### `renderFinalPreview(generatedCode, projectName)`

Renders completed production preview.

**Parameters**:
- `generatedCode` (object): All generated files
- `projectName` (string): Project name

**Example**:
```javascript
window.xovaPreview.renderFinalPreview(generatedCode, 'MyApp');
```

---

### `setDevice(device)`

Changes viewport size for responsiveness testing.

**Parameters**:
- `device` (string): 'mobile', 'tablet', or 'desktop'

**Example**:
```javascript
window.xovaPreview.setDevice('mobile'); // Show mobile view
```

---

### `writeToFrame(html)`

Injects HTML directly into preview iframe.

**Parameters**:
- `html` (string): Complete HTML document

**Example**:
```javascript
const html = '<html><body>Test</body></html>';
window.xovaPreview.writeToFrame(html);
```

---

## Main App API

**File**: `js/main.js`

Main application controller.

### `showPage(pageId)`

Navigates to a specific page.

**Parameters**:
- `pageId` (string): 'home', 'planning', 'build', 'projects', 'api-docs', 'roadmap', or 'community'

**Example**:
```javascript
window.xovaApp.showPage('build');
```

---

### `startBuildFlow()`

Initiates the build process from home page.

**Side Effects**:
- Validates input
- Starts planning
- Shows planning page

**Example**:
```javascript
window.xovaApp.startBuildFlow();
```

---

### `showToast(message, type)`

Shows toast notification.

**Parameters**:
- `message` (string): Notification text
- `type` (string): 'success', 'error', or 'info'

**Example**:
```javascript
window.xovaApp.showToast('Project saved!', 'success');
```

---

### `handleGithubPush()`

Pushes generated project to GitHub.

**Side Effects**:
- Creates repository
- Uploads files
- Shows status

**Example**:
```javascript
await window.xovaApp.handleGithubPush();
```

---

## Complete Workflow Example

```javascript
// 1. Analyze prompt
const plan = await window.xovaPlanner.analyzePrompt(
  "Build an Instagram-like social media platform"
);

// 2. Show planning page
await window.xovaPlanner.startPlanning(
  "Build an Instagram-like social media platform",
  'super'
);

// 3. Wait for user approval...

// 4. Generate all files
const files = await window.xovaGenerator.generateProject(plan);

// 5. Start streaming build
await window.xovaStreamer.startBuild(plan);

// 6. During streaming, preview updates automatically
window.xovaPreview.updatePreview(files, 'Instagram-like-app', 'streaming');

// 7. On completion
window.xovaStreamer.exportAsZip();

// 8. Push to GitHub
await window.xovaApp.handleGithubPush();
```

---

## Events & Hooks

### Ghost Assistant Events

```javascript
window.xovaGhost.say(message);      // Ghost says something
window.xovaGhost.onThinking();      // Ghost thinks
window.xovaGhost.onTyping();        // Ghost responds to typing
window.xovaGhost.onBuilding();      // Ghost watches build
window.xovaGhost.onCelebrate();     // Ghost celebrates completion
window.xovaGhost.onIdle();          // Ghost goes idle
```

---

## Project Management API

**File**: `js/projects.js`

### `saveProject(projectData)`

Saves project to localStorage.

**Parameters**:
```javascript
{
  name: string,
  files: object,
  fileCount: number,
  totalLines: number,
  totalSize: string,
  status: string,
  timestamp: string
}
```

---

### `getProjects()`

Retrieves all saved projects.

**Returns**: Array of project objects

---

## Error Handling

All API methods use try-catch internally. Check console for errors:

```javascript
try {
  const plan = await window.xovaPlanner.analyzePrompt(prompt);
} catch (error) {
  console.error('Planning failed:', error);
  window.xovaApp.showToast(error.message, 'error');
}
```

---

## Performance Tips

1. **Large Prompts**: Simpler descriptions analyze faster
2. **Live Preview**: Only updates every 800ms to avoid lag
3. **File Streaming**: Streams 8 characters per tick (12ms)
4. **Progress Bar**: Smooth 60fps animation

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES2020+ support (no IE11).

---

## Versioning

Current Version: **1.0.0**

API is stable. No breaking changes planned.

---

## Support

For issues or questions:
- Check ARCHITECTURE.md for detailed explanation
- Review example flows in main.js
- Check browser console for errors

---

**XOVA Engine v1.0** | Production Ready
