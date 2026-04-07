# XOVA Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Node.js 18+ (for running generated apps)
- Optional: GitHub account (for pushing code)

### Step 1: Open XOVA
```
Visit: your-xova-deployment-url
```

### Step 2: Enter Your App Idea

Click on the main input field and describe your app:

**Good Prompts** ✅
```
"Build a full e-commerce platform like Flipkart with product 
catalog, shopping cart, payment processing, order tracking, 
seller dashboard, and analytics"

"Build a social media platform like Instagram with feeds, stories, 
reels, direct messages, explore page, and creator monetization"

"Build a SaaS project management tool like Linear with boards, 
sprints, issues, team collaboration, and integrations"
```

**What NOT to do** ❌
```
❌ "Build a website"
❌ "Make an app"
❌ "Create something cool"
✅ Instead: Be specific about features and platforms
```

### Step 3: Click "Analyze & Plan"

XOVA will:
1. **Analyze** your prompt for features
2. **Parse** required functionality
3. **Design** architecture (pages, APIs, database)
4. **Select** appropriate tech stack
5. **Display** the complete plan

**Takes**: 3-5 seconds

### Step 4: Review the Plan

You'll see:
- **Architecture Overview**: Pages and API endpoints
- **Project Structure**: File tree preview
- **Tech Stack**: Frontend, backend, database, DevOps tools
- **Chat Interface**: Modify the plan if needed

**Modify the Plan** (optional):
```
Chat Input: "Add real-time notifications"
XOVA: Updates architecture with Socket.io, notification tables, etc.

Chat Input: "Remove payment processing for now"
XOVA: Removes Stripe integration from plan

Chat Input: "Make it mobile-first"
XOVA: Adjusts tech stack to React Native, adds mobile optimizations
```

### Step 5: Click "Build"

XOVA will:
1. **Generate** all code files
2. **Stream** code character-by-character
3. **Update** live preview in real-time
4. **Show** syntax-highlighted code
5. **Display** progress and stats

**Watch**:
- Left panel: File list showing generation progress
- Center panel: Syntax-highlighted code streaming
- Right panel: Live preview updating in real-time

**Time**: 30-60 seconds depending on complexity

### Step 6: Export Your App

Once build is complete:

#### Option A: Download as ZIP
```
Click: Export ZIP
Gets: Full project as single file
Unzip and run:
  cd project-folder
  npm install
  npm run dev
```

#### Option B: Push to GitHub
```
Click: Push to GitHub
Enter:
  - GitHub token (PAT)
  - Username
  - Repository name
Gets: Full repo on GitHub ready to clone
```

#### Option C: Save to XOVA
```
Click: Save Project
Gets: Saved in "My Projects"
Return anytime and continue building
```

---

## 🎨 Understanding the Interface

### Home Page
```
┌─────────────────────────────────────┐
│  XOVA — AI Software Engine          │
├─────────────────────────────────────┤
│                                     │
│  [SUPER] [NEW] [PRO] (Model select) │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ "Build anything..."         │   │
│  │ (Input field)               │   │
│  └─────────────────────────────┘   │
│                                     │
│  [🛒 E-commerce] [📸 Social] [...] │  Suggestion chips
│                                     │
│  [Analyze & Plan] [Attach Files]   │
│                                     │
└─────────────────────────────────────┘
```

### Planning Page
```
┌──────────────────┬──────────────────┐
│  Architecture    │  Chat Interface  │
│  - Pages         │  - AI responses  │
│  - APIs          │  - Modifications │
│  - Tech Stack    │  - Questions     │
│  - File Tree     │  [Ready to Build]│
│                  │                  │
└──────────────────┴──────────────────┘
```

### Build Page (Studio)
```
┌─────────┬────────────────┬──────────────┐
│ Files   │  Code Editor   │  Live        │
│         │  with Cursor   │  Preview     │
│ • index │  • Syntax Hi   │  • Responsive│
│ • server│  • Line Nums   │  • Working   │
│ • db    │  • Real Stream │  • Interactive
│ • pages │                │              │
│ • route │  Progress: 45% │              │
│         │                │              │
└─────────┴────────────────┴──────────────┘
```

---

## 📋 Real Examples & Expected Output

### Example 1: Instagram Clone

**Input**:
```
Build Instagram with feeds, stories, reels, DMs, explore, 
and creator monetization
```

**Generated**:
```
✓ 68 files total
✓ 12,847 lines of code
✓ 15 pages (Home Feed, Profile, Messages, Explore, etc.)
✓ 18 API endpoints
✓ 7 database tables
✓ Real React components
✓ Express.js backend
✓ PostgreSQL schema
✓ Socket.io for real-time
✓ Stripe integration
✓ Docker config
✓ GitHub Actions CI/CD
✓ Complete authentication
```

**Files Generated**:
```
instagram-clone/
├── package.json
├── server.js
├── .env.example
├── database/
│   ├── schema.sql
│   └── migrations.sql
├── routes/
│   ├── auth.js
│   ├── posts.js
│   ├── messages.js
│   └── ...
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── pages/
│   │   ├── Feed.tsx
│   │   ├── Profile.tsx
│   │   ├── Messages.tsx
│   │   └── ...
│   └── app.js
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/
│   └── deploy.yml
├── nginx.conf
├── README.md
└── (and 50+ more files)
```

**Run It**:
```bash
npm install
npm run dev
# Opens on localhost:3000
# Fully functional social media platform
```

### Example 2: E-commerce Platform

**Input**:
```
Build Flipkart-like marketplace with products, cart, payments, 
seller portal, analytics, and admin dashboard
```

**Generated**:
```
✓ 74 files
✓ 14,200+ lines of code
✓ 12 pages (Products, Cart, Checkout, etc.)
✓ 22 API endpoints
✓ 8 database tables
✓ Product search with Elasticsearch
✓ Payment integration
✓ Seller portal
✓ Admin analytics
✓ Inventory management
✓ Order tracking
✓ Real-time notifications
```

### Example 3: Project Management Tool

**Input**:
```
Build a Linear-like project management tool with boards, sprints, 
issues, team collaboration, comments, and integrations
```

**Generated**:
```
✓ 52 files
✓ 11,500+ lines
✓ 10 pages (Projects, Board, Timeline, etc.)
✓ 16 API endpoints
✓ 6 database tables
✓ Real-time board updates
✓ Drag-drop interface
✓ Team collaboration
✓ Integration hooks
✓ Activity logging
```

---

## 🔧 Working With Generated Code

### Installing Dependencies
```bash
cd your-app
npm install
```

### Running Locally
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

### Database Setup
```bash
# Create database
createdb appdb

# Run schema
psql appdb < database/schema.sql

# Run migrations
psql appdb < database/migrations.sql
```

### Environment Setup
```bash
# Copy template
cp .env.example .env

# Edit with your values
# - Database credentials
# - API keys (Stripe, etc.)
# - JWT secret
# - Redis connection
```

### Docker Deployment
```bash
# Build image
docker build -t myapp .

# Run container
docker run -p 3000:3000 myapp

# Or use docker-compose
docker-compose up --build
```

### Push to GitHub
```bash
git clone https://github.com/yourusername/yourrepo
cd yourrepo
git config user.email "you@example.com"
git config user.name "Your Name"
git add .
git commit -m "Initial commit - Built with XOVA"
git push origin main
```

---

## 🚀 Deployment Options

### Option 1: Heroku
```bash
heroku login
heroku create your-app
git push heroku main
heroku config:set DATABASE_URL=postgresql://...
```

### Option 2: AWS
```bash
# Using generated Docker config
aws ecr create-repository --repository-name myapp
docker tag myapp:latest [account].dkr.ecr.[region].amazonaws.com/myapp:latest
docker push [account].dkr.ecr.[region].amazonaws.com/myapp:latest
# Deploy via ECS or App Runner
```

### Option 3: DigitalOcean
```bash
# Using docker-compose
doctl apps create --spec app.yaml
```

### Option 4: Vercel (Frontend Only)
```bash
# For frontend part
vercel deploy
# Connect to your API backend
```

---

## 🎯 Pro Tips

### Tip 1: Be Specific
```
❌ "Build a marketplace"
✅ "Build a peer-to-peer marketplace for freelancers with 
   portfolio portfolios, project posting, bidding system, 
   messaging, escrow payments, and ratings"
```

### Tip 2: Modify the Plan
Don't settle for the auto-generated plan. Chat with XOVA:
```
"Add two-factor authentication"
"Remove video streaming for now"
"Make it multi-language"
"Add blockchain integration"
```

### Tip 3: Study the Generated Code
Each file is production-ready. Read them to:
- Learn best practices
- Understand architecture
- Customize for your needs

### Tip 4: Keep Version History
Every build is saved. Return to earlier versions:
```
Projects → Version History → Restore
```

### Tip 5: Export Early & Often
Export your generated code immediately:
```
During Build → Export ZIP
Keep backups on GitHub
Work locally with full control
```

---

## ❓ FAQ

### Q: Is the generated code production-ready?
**A**: Yes! It includes authentication, error handling, database relationships, API validation, and security headers.

### Q: Can I customize the generated code?
**A**: Absolutely. Once exported, it's yours to modify. XOVA generates the foundation; you build on top.

### Q: What if I don't like the plan?
**A**: Chat with XOVA to modify it before building. Change features, tech stack, pages, etc.

### Q: How long does generation take?
**A**: Typically 30-90 seconds depending on app complexity.

### Q: Can I generate the same app twice?
**A**: The architecture will be similar, but always slightly different based on refined parsing. Use version history to restore exact builds.

### Q: What about frontend vs backend?
**A**: Both are generated completely. Frontend in React, backend in Node.js/Express.

### Q: Can I use a different tech stack?
**A**: Currently fixed to: React/Node.js/PostgreSQL. Custom stacks coming soon.

### Q: Is my data secure?
**A**: All generation happens locally in your browser. No server-side processing of your prompts.

### Q: Can I commercialize generated apps?
**A**: Yes. XOVA code is yours to own and monetize.

### Q: What about scaling?
**A**: Generated apps include Redis caching, database indexing, and deployment configs for scaling.

---

## 📞 Support

- **Documentation**: Check ARCHITECTURE.md
- **API Reference**: In-app API Docs page
- **Examples**: Try the suggestion chips
- **Community**: See built apps in Community section

---

## 🎉 You're Ready!

Start building amazing apps with XOVA today.

```
App Idea → Prompt → Plan → Build → Code Streams → Live Preview → Deploy
```

**That's it. That's the power of XOVA.** 🚀
