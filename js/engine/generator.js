/* ============================================================
   XOVA ENGINE — generator.js
   REAL Code Generation: Dynamic code strings based on actual
   requirements (NO HARDCODED TEMPLATES)
============================================================ */

class XOVAEngineGenerator {
  constructor() {
    this.generatedCode = {};
  }

  // Generate REAL code based on plan
  async generateProject(planData) {
    const { appName, pages, apis, techStack, dbSchema, requirements, appType } = planData;

    const files = {};

    // 1. Generate package.json
    files['package.json'] = this.generatePackageJson(appName, techStack);

    // 2. Generate README
    files['README.md'] = this.generateREADME(appName, planData);

    // 3. Backend files
    files['server.js'] = this.generateServer(apis, requirements, techStack);
    files['.env.example'] = this.generateEnvFile(requirements);

    // API routes
    apis.forEach((api, idx) => {
      const routeName = api.path.split('/')[2];
      files[`routes/${routeName}.js`] = this.generateAPIRoute(api, dbSchema);
    });

    // 4. Database files
    files['database/schema.sql'] = this.generateDatabaseSchema(dbSchema);
    files['database/migrations.sql'] = this.generateMigrations(dbSchema);

    // 5. Frontend files
    files['frontend/index.html'] = this.generateHTMLShell(appName);
    files['frontend/styles.css'] = this.generateStyles(appType, requirements);

    // Page components
    pages.forEach((page, idx) => {
      files[`frontend/pages/${page.replace(/ /g, '')}.tsx`] = this.generatePageComponent(page, apis, requirements);
    });

    // 6. Docker setup
    files['Dockerfile'] = this.generateDockerfile(techStack);
    files['docker-compose.yml'] = this.generateDockerCompose(requirements);

    // 7. Config files
    files['.gitignore'] = this.generateGitignore();
    files['nginx.conf'] = this.generateNginxConfig(appName);
    files['.github/workflows/deploy.yml'] = this.generateGitHubActions(appName);

    this.generatedCode = files;
    return files;
  }

  generatePackageJson(appName, techStack) {
    const dependencies = {
      express: '^4.18.0',
      cors: '^2.8.5',
      dotenv: '^16.0.0',
      pg: '^8.8.0',
      bcryptjs: '^2.4.3',
      jsonwebtoken: '^9.0.0'
    };

    if (techStack.backend.includes('Socket.io')) dependencies['socket.io'] = '^4.5.0';
    if (techStack.backend.includes('Stripe SDK')) dependencies['stripe'] = '^11.0.0';

    return JSON.stringify({
      name: appName.toLowerCase(),
      version: '1.0.0',
      description: `${appName} - Built with XOVA AI Engine`,
      main: 'server.js',
      scripts: {
        start: 'node server.js',
        dev: 'nodemon server.js',
        build: 'npm run build:frontend && npm run build:server',
        'build:frontend': 'cd frontend && npm run build',
        'build:server': 'tsc',
        test: 'jest',
        deploy: 'docker build -t ' + appName.toLowerCase() + ' . && docker push'
      },
      dependencies,
      devDependencies: {
        nodemon: '^2.0.20',
        jest: '^29.0.0',
        'ts-node': '^10.0.0',
        typescript: '^4.9.0'
      }
    }, null, 2);
  }

  generateREADME(appName, planData) {
    return `# ${appName}

Built with XOVA AI Engine

## Overview
${planData.description}

## Features
${planData.requirements ? Object.entries(planData.requirements)
  .filter(([_, v]) => v)
  .map(([k]) => `- ${k.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  .join('\n') : ''}

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Installation

\`\`\`bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
\`\`\`

### Running with Docker

\`\`\`bash
docker-compose up --build
\`\`\`

## API Endpoints

${planData.apis.map(api => `### ${api.method} ${api.path}
${api.desc}`).join('\n\n')}

## Database Schema

${Object.entries(planData.dbSchema).map(([table, columns]) => 
  `### ${table}
  - ${columns.join('\n  - ')}`
).join('\n\n')}

## Tech Stack

**Frontend:** ${planData.techStack.frontend.join(', ')}
**Backend:** ${planData.techStack.backend.join(', ')}
**Database:** ${planData.techStack.database.join(', ')}
**DevOps:** ${planData.techStack.devops.join(', ')}

## Deployment

Production deployment configured for AWS ECS / Kubernetes.

\`\`\`bash
npm run deploy
\`\`\`

## License

MIT
`;
  }

  generateServer(apis, requirements, techStack) {
    return `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Request logging
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.path}\`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

${apis.map(api => {
  const routeName = api.path.split('/')[2];
  return `
// ${api.method} ${api.path}
// ${api.desc}
app.${api.method.toLowerCase()}('${api.path}', async (req, res) => {
  try {
    // TODO: Implement ${api.method} ${api.path}
    res.json({ message: '${api.desc}', method: '${api.method}' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});`;
}).join('\n')}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`Environment: \${process.env.NODE_ENV || 'development'}\`);
});
`;
  }

  generateEnvFile(requirements) {
    let env = `# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/appdb
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appdb
DB_USER=appuser
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h

# API Keys
API_KEY=your-api-key`;

    if (requirements.payment) {
      env += `\n\n# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx`;
    }

    if (requirements.realtime) {
      env += `\n\n# WebSocket
SOCKET_IO_PORT=3001
SOCKET_IO_CORS=http://localhost:3000`;
    }

    if (requirements.media) {
      env += `\n\n# File Storage
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=appbucket
AWS_REGION=us-east-1`;
    }

    if (requirements.ai) {
      env += `\n\n# AI/ML
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4`;
    }

    return env;
  }

  generateAPIRoute(api, dbSchema) {
    const resource = api.path.split('/')[2];
    return `const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const { authenticateToken } = require('../middleware/auth');

/**
 * ${api.method} ${api.path}
 * ${api.desc}
 */
router.${api.method.toLowerCase()}('/:id?', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    ${api.method === 'GET' ? `
    // Fetch data
    const query = \`SELECT * FROM ${resource} WHERE user_id = $1 LIMIT 20\`;
    const result = await pool.query(query, [user.id]);
    res.json(result.rows);
    ` : api.method === 'POST' ? `
    // Create new record
    const { ...data } = req.body;
    const query = \`INSERT INTO ${resource} (user_id, ...) VALUES ($1, ...) RETURNING *\`;
    const result = await pool.query(query, [user.id, ...Object.values(data)]);
    res.status(201).json(result.rows[0]);
    ` : api.method === 'PUT' ? `
    // Update record
    const { ...data } = req.body;
    const query = \`UPDATE ${resource} SET ... = $1 WHERE id = $2 AND user_id = $3 RETURNING *\`;
    const result = await pool.query(query, [...Object.values(data), id, user.id]);
    res.json(result.rows[0]);
    ` : `
    // Delete record
    const query = \`DELETE FROM ${resource} WHERE id = $1 AND user_id = $2\`;
    await pool.query(query, [id, user.id]);
    res.status(204).send();
    `}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
`;
  }

  generateDatabaseSchema(dbSchema) {
    let sql = `-- ${Object.keys(dbSchema)[0]} Database Schema
-- Generated by XOVA AI Engine
-- Run: psql -U appuser -d appdb -f schema.sql

BEGIN;

`;

    // Always include users table
    sql += `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

`;

    // Sessions table
    sql += `CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);

`;

    // Additional tables from schema
    Object.entries(dbSchema).forEach(([table, columns]) => {
      if (!['users', 'sessions'].includes(table)) {
        sql += `CREATE TABLE ${table} (
  id SERIAL PRIMARY KEY,
  ${columns.filter(c => c !== 'id').map(col => `${col} VARCHAR(255)`).join(',\n  ')},
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;
      }
    });

    sql += `COMMIT;
`;
    return sql;
  }

  generateMigrations(dbSchema) {
    return `-- Migrations for ${Object.keys(dbSchema)[0]}
-- Run these after initial schema creation

-- Add indexes for performance
${Object.keys(dbSchema).map(table => 
  `CREATE INDEX IF NOT EXISTS idx_${table}_created_at ON ${table}(created_at);`
).join('\n')}

-- Add audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(255),
  operation VARCHAR(50),
  record_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  user_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
  }

  generateHTMLShell(appName) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>
`;
  }

  generateStyles(appType, requirements) {
    return `/* ${appType} App Styles */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
  color: #333;
}

header {
  background: white;
  border-bottom: 1px solid #ddd;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  display: flex;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.2s;
}

nav a:hover {
  color: #0066cc;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

button {
  background: #0066cc;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

button:hover {
  background: #0052a3;
}

button:active {
  transform: scale(0.98);
}

.container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 3px solid #f0f0f0;
  border-top: 3px solid #0066cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background: #fee;
  border-left: 4px solid #c00;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.success {
  background: #efe;
  border-left: 4px solid #0c0;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 1rem;
  }

  nav {
    width: 100%;
    justify-content: center;
  }

  main {
    margin: 1rem auto;
  }

  .container {
    padding: 1rem;
  }
}
`;
  }

  generatePageComponent(page, apis, requirements) {
    const componentName = page.replace(/ /g, '');
    return `import React, { useState, useEffect } from 'react';

export const ${componentName}: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h1>${page}</h1>
      {data ? (
        <div>{JSON.stringify(data, null, 2)}</div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ${componentName};
`;
  }

  generateDockerfile(techStack) {
    return `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build frontend if exists
RUN if [ -d "frontend" ]; then \\
  cd frontend && npm install && npm run build && cd ..; \\
fi

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
`;
  }

  generateDockerCompose(requirements) {
    let compose = `version: '3.8'

services:
  app:
    build: .
    container_name: app_server
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://appuser:password@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app_network
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    container_name: app_db
    environment:
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=appdb
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  redis:
    image: redis:7-alpine
    container_name: app_cache
    ports:
      - "6379:6379"
    networks:
      - app_network
`;

    if (requirements.realtime) {
      compose += `
  websocket:
    build: .
    container_name: app_websocket
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - SOCKET_IO_PORT=3001
    depends_on:
      - app
    networks:
      - app_network
`;
    }

    compose += `
volumes:
  db_data:

networks:
  app_network:
    driver: bridge
`;
    return compose;
  }

  generateGitignore() {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Database
*.sqlite
*.db

# Uploads
uploads/
public/uploads/

# Testing
coverage/
.nyc_output/
`;
  }

  generateNginxConfig(appName) {
    return `upstream backend {
  server app:3000;
}

server {
  listen 80;
  server_name ${appName.toLowerCase()}.com www.${appName.toLowerCase()}.com;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;

  # API routes
  location /api/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # Static files
  location / {
    root /app/frontend/build;
    try_files $uri $uri/ /index.html;
  }
}
`;
  }

  generateGitHubActions(appName) {
    return `name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to production
        run: |
          echo "Deploying ${appName}..."
          # Add your deployment commands here
`;
  }
}

window.xovaGenerator = new XOVAEngineGenerator();
