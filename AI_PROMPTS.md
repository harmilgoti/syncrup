# AI Prompts & JSON Schemas

## Overview
This document defines all AI interactions, including prompts and expected JSON schemas.

## 1. Node Enrichment

### Purpose
Enrich graph nodes with AI-generated metadata (description, criticality, tags).

### Input Schema
```typescript
{
  nodeId: string;
  nodeType: 'FILE' | 'FUNCTION' | 'API' | 'COMPONENT';
  label: string;
  context?: string; // Optional code snippet or summary
}
```

### Prompt Template
```
You are a code analysis assistant. Given the following code element, provide enrichment metadata.

Node Type: {nodeType}
Label: {label}
Context: {context || 'N/A'}

Respond ONLY with valid JSON matching this schema:
{
  "description": "Brief description of what this element does",
  "criticality": "LOW | MEDIUM | HIGH | CRITICAL",
  "riskLevel": 0-10,
  "tags": ["tag1", "tag2"]
}
```

### Output Schema
```typescript
{
  nodeId: string;
  description: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskLevel: number; // 0-10
  tags: string[];
}
```

### Example
**Input:**
```json
{
  "nodeId": "repo123:src/auth/login.ts:authenticateUser",
  "nodeType": "FUNCTION",
  "label": "authenticateUser",
  "context": "Function that validates user credentials"
}
```

**Output:**
```json
{
  "nodeId": "repo123:src/auth/login.ts:authenticateUser",
  "description": "Validates user credentials against database and returns JWT token",
  "criticality": "CRITICAL",
  "riskLevel": 9,
  "tags": ["authentication", "security", "user-management"]
}
```

---

## 2. Impact Analysis

### Purpose
Analyze how code changes propagate through the dependency graph.

### Input Schema
```typescript
{
  changedFiles: string[];
  graphContext: {
    nodes: Array<{ id: string; type: string; label: string }>;
    edges: Array<{ source: string; target: string; type: string }>;
  };
}
```

### Prompt Template
```
You are a code impact analysis assistant. Given the following changed files and dependency graph context, analyze the impact.

Changed Files:
{changedFiles.join('\n')}

Graph Context (simplified):
{JSON.stringify(graphContext, null, 2)}

Respond ONLY with valid JSON matching this schema:
{
  "affectedNodes": ["nodeId1", "nodeId2"],
  "impactPaths": [
    {
      "path": ["nodeA", "nodeB", "nodeC"],
      "explanation": "Why this path is affected",
      "riskLevel": 0-10
    }
  ],
  "summary": "Overall impact summary"
}
```

### Output Schema
```typescript
{
  affectedNodes: string[];
  impactPaths: Array<{
    path: string[];
    explanation: string;
    riskLevel: number; // 0-10
  }>;
  summary: string;
}
```

### Example
**Input:**
```json
{
  "changedFiles": ["src/api/users.ts"],
  "graphContext": {
    "nodes": [
      { "id": "src/api/users.ts", "type": "FILE", "label": "users.ts" },
      { "id": "src/services/userService.ts", "type": "FILE", "label": "userService.ts" }
    ],
    "edges": [
      { "source": "src/api/users.ts", "target": "src/services/userService.ts", "type": "IMPORTS" }
    ]
  }
}
```

**Output:**
```json
{
  "affectedNodes": ["src/services/userService.ts", "src/components/UserProfile.tsx"],
  "impactPaths": [
    {
      "path": ["src/api/users.ts", "src/services/userService.ts", "src/components/UserProfile.tsx"],
      "explanation": "Changes to user API will affect service layer and UI components that display user data",
      "riskLevel": 7
    }
  ],
  "summary": "API changes will propagate to 2 dependent modules with medium-high risk"
}
```

---

## 3. Breaking Change Classification

### Purpose
Determine if a code change is breaking or non-breaking.

### Input Schema
```typescript
{
  oldSignature: string;
  newSignature: string;
}
```

### Prompt Template
```
Compare these two function signatures and determine if the change is breaking.

Old: {oldSignature}
New: {newSignature}

Respond ONLY with valid JSON:
{
  "isBreaking": true/false,
  "explanation": "Brief explanation"
}
```

### Output Schema
```typescript
{
  isBreaking: boolean;
  explanation: string;
}
```

### Example
**Input:**
```json
{
  "oldSignature": "function getUser(id: string): User",
  "newSignature": "function getUser(id: string, includeProfile: boolean): User"
}
```

**Output:**
```json
{
  "isBreaking": false,
  "explanation": "Added optional parameter with default value, backward compatible"
}
```

---

## AI Safety Rules

1. **No Direct File Access**: AI never receives raw file contents
2. **Structured Input Only**: AI receives JSON summaries, not code
3. **Strict Output Validation**: All AI responses validated against schemas
4. **Graceful Degradation**: System works without AI (reduced insights)
5. **No Write Access**: AI cannot modify graph or database
6. **Human Approval**: Critical changes require human review

## Error Handling

If AI fails:
- Return default safe values
- Log error for debugging
- Continue operation without AI enrichment
- Display warning to user

## Rate Limiting

- Batch enrichment requests
- Cache AI responses
- Implement exponential backoff on failures
