# System Architecture - AI Code Impact Analysis Platform

## Overview
This platform provides cross-repository code impact analysis using AST parsing, graph databases, and AI enrichment.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Vite + React)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │ Graph View   │  │  API Client  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │ REST API
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + TypeScript)                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Controllers                          │   │
│  │  ┌─────────────────┐         ┌─────────────────┐        │   │
│  │  │ ProjectController│         │  AIController   │        │   │
│  │  └─────────────────┘         └─────────────────┘        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                       Services                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ProjectService│  │IndexerService│  │ GraphService │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │  ┌──────────────┐                                        │   │
│  │  │  AIService   │ (OpenAI Integration)                   │   │
│  │  └──────────────┘                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                                │
         │ Prisma ORM                     │ File I/O
         ▼                                ▼
┌──────────────────┐          ┌──────────────────┐
│  MySQL Database  │          │  Graph Storage   │
│  - Projects      │          │  (graph.json)    │
│  - Repositories  │          │  - Nodes         │
│  - Scans         │          │  - Edges         │
│  - ImpactReports │          └──────────────────┘
└──────────────────┘
```

## Data Flow

### 1. Repository Indexing Flow
```
User adds Repo → IndexerService clones → AST Parser extracts nodes
→ GraphService stores nodes/edges → Persist to graph.json
```

### 2. AI Enrichment Flow
```
Graph nodes created → AIService.enrichNode() → OpenAI API
→ Returns metadata (criticality, risk, tags) → Store in graph
```

### 3. Impact Analysis Flow
```
Code change detected → Identify changed files → Traverse graph
→ AIService.analyzeImpact() → Returns affected paths + explanations
→ Store in ImpactReport
```

## Key Design Principles

### 1. AI Safety Rules (ENFORCED)
- ✅ AI NEVER reads raw repositories
- ✅ AI NEVER clones repos
- ✅ AI NEVER creates/deletes graph nodes
- ✅ AI ONLY enriches existing data
- ✅ Backend is ONLY writer to databases
- ✅ All AI outputs are validated JSON

### 2. Data Persistence
- **MySQL (Prisma)**: Application metadata (projects, repos, scans)
- **Graph Storage**: Code intelligence (files, functions, dependencies)
- **Separation**: UI state ≠ Code graph

### 3. Scalability
- Graph stored in JSON (MVP) → Easily swappable to Neo4j
- Indexing runs async (background jobs)
- Frontend polls for status updates

## Component Responsibilities

### Frontend
- **Dashboard**: Project/repo management UI
- **GraphView**: D3/react-force-graph visualization
- **API Client**: REST communication with backend

### Backend Services

#### ProjectService
- CRUD for projects and repositories
- Manages Prisma/MySQL interactions
- Updates repository status (PENDING → INDEXED → FAILED)

#### IndexerService
- Clones Git repositories
- Invokes AST parser
- Builds graph nodes and edges
- Saves to GraphService

#### GraphService
- In-memory graph management
- Persists to `data/graph.json`
- Provides graph query interface
- Thread-safe operations

#### AIService
- **enrichNode()**: Adds descriptions, criticality, tags
- **analyzeImpact()**: Explains change propagation
- **classifyChange()**: Detects breaking changes
- All methods return strict JSON schemas

### AST Parser
- Scans `.ts`, `.tsx`, `.js`, `.jsx` files
- Extracts: Files, Functions, Imports
- Ignores: `node_modules`, `.git`, `dist`, `build`
- Creates graph nodes with metadata

## API Endpoints

### Project Management
- `POST /projects` - Create project
- `GET /projects` - List all projects
- `POST /repos` - Add repository to project
- `GET /graph` - Get full dependency graph

### AI Endpoints
- `POST /ai/enrich` - Enrich a node with AI metadata
- `POST /ai/analyze-impact` - Analyze change impact
- `POST /ai/classify-change` - Classify breaking changes

## Security Considerations

1. **Environment Variables**: All secrets in `.env` (never committed)
2. **Git Credentials**: Uses system Git config (SSH/HTTPS)
3. **API Keys**: OpenAI key required for AI features
4. **Input Validation**: All API inputs validated
5. **Error Handling**: AI failures gracefully degrade

## Future Enhancements

1. **Neo4j Integration**: Replace JSON with graph database
2. **Webhooks**: Auto-trigger on Git push
3. **Multi-language Support**: Python, Java, Go parsers
4. **Real-time Updates**: WebSocket for live graph updates
5. **User Authentication**: OAuth/JWT
6. **Approval Workflows**: Human-in-the-loop for critical changes
