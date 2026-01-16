# AI Code Impact Analysis Platform

## Overview
A production-ready platform for cross-repository code impact analysis.
- **Backend**: Node.js + TypeScript + Express + Prisma (MySQL)
- **Frontend**: Vite + React
- **GraphDB**: In-memory JSON graph (persisted to `backend/data/graph.json`)

## Prerequisites
- Node.js (v18+)
- MySQL (Running locally or remotely)
- Git

## Setup & Run

### 1. Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual credentials:
   - `DATABASE_URL`: Your MySQL connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key (for AI enrichment)
4. Run Migrations:
   ```bash
   npx prisma db push
   ```
5. Start Server:
   ```bash
   npm run dev
   ```

### 2. Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Dev Server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`.

## Usage
1. Create a Project in the Dashboard.
2. Select the Project.
3. Add a Repository URL (Must be cloneable via public HTTPS or SSH if configured on your machine).
4. The system will clone, index, and populate the graph.
5. View the dependency graph in the UI.

## Architecture
- **IndexerService**: Clones Git repos, parses AST, builds graph nodes.
- **GraphService**: Manages the global dependency graph.
- **ProjectService**: Manages project metadata in MySQL.
- **AIService**: Enriches graph nodes and analyzes impact using Google Gemini (optional).

## AI Features
The platform includes AI-powered features:
- **Node Enrichment**: AI describes code elements and assigns criticality levels
- **Impact Analysis**: AI explains how changes propagate through the codebase
- **Breaking Change Detection**: AI classifies if API changes are breaking

**Note**: AI features require a Google Gemini API key in `.env`. The system works without AI but with reduced insights.
