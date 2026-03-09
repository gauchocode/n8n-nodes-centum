---
name: n8n-community-node
description: Use when creating custom n8n community nodes for APIs, especially with many endpoints, verbose responses, or when the node should work as an AI Agent tool
---

# n8n Community Node Development

## Overview

Pattern for creating n8n community nodes with clean UX, simplified output, AI Agent compatibility, and npm publishing.

## Project Structure

```
n8n-nodes-myapi/
├── package.json           # Package config with n8n metadata
├── tsconfig.json          # TypeScript config
├── .npmignore             # Files to exclude from npm package
├── .env                   # NPM_TOKEN (gitignored)
├── .gitignore
├── nodes/
│   └── MyApi/
│       ├── MyApi.node.ts  # Main node implementation
│       └── myapi.svg      # Node icon
├── credentials/
│   └── MyApi.credentials.ts
└── dist/                  # Compiled output (gitignored)
```

**Optional Docker setup (recommended for CI/CD):**
```
├── Dockerfile
├── docker-compose.yml
├── pnpm-lock.yaml
```

## package.json Configuration

```json
{
  "name": "n8n-nodes-myapi",
  "version": "1.0.0",
  "description": "n8n community node for MyApi",
  "keywords": ["n8n", "n8n-community-node-package", "myapi"],
  "license": "MIT",
  "main": "dist/nodes/MyApi/MyApi.node.js",
  "scripts": {
    "build": "tsc && cp nodes/MyApi/myapi.svg dist/nodes/MyApi/",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "files": ["dist"],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": ["dist/credentials/MyApi.credentials.js"],
    "nodes": ["dist/nodes/MyApi/MyApi.node.js"]
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "n8n-workflow": "^1.0.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "n8n-workflow": ">=1.0.0"
  }
}
```

## Publishing to npm (Required for Community Nodes)

### Step 1: Create npm Account & Token

1. Create account at https://www.npmjs.com
2. Generate Access Token: Profile → Access Tokens → Generate New Token (Classic)
3. Copy token (starts with `npm_`)

### Step 2: Configure Authentication

**Option A: Local .npmrc (simple)**
```bash
# Create .npmrc in project root
echo "//registry.npmjs.org/:_authToken=npm_YOUR_TOKEN_HERE" > .npmrc
echo ".npmrc" >> .gitignore
```

**Option B: .env file (recommended for Docker)**
```bash
# Create .env (gitignored)
echo "NPM_TOKEN=npm_YOUR_TOKEN_HERE" > .env
echo ".env" >> .gitignore
```

### Step 3: Build & Publish

**Without Docker:**
```bash
# Install dependencies
pnpm install

# Clean and build
rm -rf dist && pnpm build

# Publish
npm publish --access public
```

**With Docker (recommended for consistency):**

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.1.4 --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Clean dist and build (ensures fresh compilation)
RUN rm -rf dist && pnpm build

# Default command
CMD ["sh"]
```

Create `docker-compose.yml`:
```yaml
services:
  build:
    build: .
    volumes:
      - ./dist:/app/dist
    command: pnpm build

  publish:
    build: .
    env_file:
      - .env
    command: sh -c "echo '//registry.npmjs.org/:_authToken=$${NPM_TOKEN}' > ~/.npmrc && npm publish --access public"
```

Publish:
```bash
docker compose build --no-cache
docker compose run publish
```

### Step 4: Verify Publication

```bash
# Check package exists
curl -s https://registry.npmjs.org/n8n-nodes-myapi | jq '.name, ."dist-tags".latest'

# Verify tarball contents
curl -s https://registry.npmjs.org/n8n-nodes-myapi/1.0.0 | jq '.dist.tarball' -r | xargs curl -s | tar -tzf -
```

### Step 5: Install in n8n

1. Go to n8n → Settings → Community Nodes
2. Click "Install a community node"
3. Enter: `n8n-nodes-myapi`
4. Click Install

**Or via CLI:**
```bash
n8n-cli community-package:install n8n-nodes-myapi
```

## Icon Configuration (SVG)

**Requirements:**
- Format: SVG (vector, scales well)
- Size: 60x60 pixels recommended
- Colors: Use brand colors, avoid gradients
- Keep it simple - displayed small

**Location:**
```
nodes/MyApi/myapi.svg
```

**Build script must copy icon:**
```json
{
  "scripts": {
    "build": "tsc && cp nodes/MyApi/myapi.svg dist/nodes/MyApi/"
  }
}
```

**Icon property in node description:**
```typescript
export class MyApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MyApi',
    name: 'myApi',
    icon: 'file:myapi.svg',  // Relative to node file
    group: ['transform'],
    version: 1,
    // ...
  };
}
```

**Creating a simple SVG:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <rect width="60" height="60" rx="8" fill="#3B82F6"/>
  <text x="30" y="40" text-anchor="middle" fill="white" font-size="24" font-weight="bold">MA</text>
</svg>
```

## Credential Definition

**Location:** `credentials/MyApi.credentials.ts`

```typescript
import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class MyApiApi implements ICredentialType {
	name = 'myApiApi';
	displayName = 'MyApi API';
	documentationUrl = 'https://docs.myapi.com/authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your MyApi API key',
		},
	];

	// Optional: Test credential button
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.myapi.com',
			url: '/me',  // Lightweight endpoint to verify auth
			method: 'GET',
			authentication: 'genericCredentialType',
		},
	};

	// Authentication configuration
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
```

**Using credentials in node:**
```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const credentials = await this.getCredentials('myApiApi');
  const apiKey = credentials.apiKey as string;

  const response = await this.helpers.request({
    method: 'GET',
    url: 'https://api.myapi.com/endpoint',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    json: true,
  });
  // ...
}
```

**Common authentication patterns:**

| Auth Type | Header Format |
|-----------|---------------|
| Bearer token | `Authorization: Bearer <token>` |
| API key header | `X-API-Key: <key>` |
| Basic auth | `Authorization: Basic base64(user:pass)` |
| Custom header | `X-Custom-Auth: <value>` |

**Register in package.json:**
```json
{
  "n8n": {
    "credentials": ["dist/credentials/MyApi.credentials.js"]
  }
}
```

## Complete Node Template

**File:** `nodes/MyApi/MyApi.node.ts`

```typescript
import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// ==================== CONSTANTS ====================
const BASE_URL = 'https://api.myapi.com';

const RESOURCES = {
	CONVERSATION: 'conversation',
	CONTACT: 'contact',
	TEAM: 'team',
};

const OPERATIONS = {
	LIST: 'list',
	GET: 'get',
	CREATE: 'create',
	UPDATE: 'update',
	DELETE: 'delete',
};

// ==================== SIMPLIFIED FIELDS ====================
const SIMPLIFIED_FIELDS: Record<string, string[]> = {
	conversation: ['id', 'title', 'date_time', 'team_id', 'status'],
	contact: ['id', 'first_name', 'last_name', 'email', 'company_name'],
};

// ==================== RESPONSE WRAPPERS ====================
const RESPONSE_WRAPPERS: Record<string, string> = {
	conversation: 'data',
	contact: 'contacts',
	team: 'teams',
};

function extractItems(response: any, resource: string): any[] {
	const wrapperKey = RESPONSE_WRAPPERS[resource];
	if (wrapperKey && response?.[wrapperKey]) {
		return response[wrapperKey];
	}
	if (response?.data) return Array.isArray(response.data) ? response.data : [response.data];
	if (Array.isArray(response)) return response;
	return [response];
}

// ==================== MAIN CLASS ====================
export class MyApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MyApi',
		name: 'myApi',
		icon: 'file:myapi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with MyApi',
		defaults: {
			name: 'MyApi',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'myApiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: BASE_URL,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// ==================== RESOURCE SELECTOR ====================
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Conversation', value: RESOURCES.CONVERSATION },
					{ name: 'Contact', value: RESOURCES.CONTACT },
					{ name: 'Team', value: RESOURCES.TEAM },
				],
				default: RESOURCES.CONVERSATION,
			},

			// ==================== CONVERSATION OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: { resource: [RESOURCES.CONVERSATION] },
				},
				options: [
					{ name: 'List', value: OPERATIONS.LIST, action: 'List conversations' },
					{ name: 'Get', value: OPERATIONS.GET, action: 'Get a conversation' },
					{ name: 'Create', value: OPERATIONS.CREATE, action: 'Create a conversation' },
				],
				default: OPERATIONS.LIST,
			},

			// ==================== CONVERSATION: LIST OPTIONS ====================
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				displayOptions: {
					show: {
						resource: [RESOURCES.CONVERSATION],
						operation: [OPERATIONS.LIST],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Team',
						name: 'teamId',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getTeams' },
						default: '',
						description: 'Filter by team',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Max results',
					},
				],
			},

			// ==================== CONVERSATION: CREATE FIELDS ====================
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [RESOURCES.CONVERSATION],
						operation: [OPERATIONS.CREATE],
					},
				},
				default: '',
				description: 'Conversation title',
			},

			// ==================== SIMPLIFIED OUTPUT ====================
			{
				displayName: 'Simplified Output',
				name: 'simplifiedOutput',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: [RESOURCES.CONVERSATION],
						operation: [OPERATIONS.LIST, OPERATIONS.GET],
					},
				},
				default: true,
				description: 'Return only key fields',
			},

			// ... Add more resources following the same pattern
		],
	};

	// ==================== LOAD OPTIONS METHODS ====================
	methods = {
		loadOptions: {
			async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('myApiApi');
				const response = await this.helpers.request({
					method: 'GET',
					url: `${BASE_URL}/teams`,
					headers: { 'Authorization': `Bearer ${credentials.apiKey}` },
					json: true,
				});

				const teams = extractItems(response, 'team');
				return teams.map((team: any) => ({
					name: team.name,
					value: team.id,
				}));
			},
		},
	};

	// ==================== EXECUTE METHOD ====================
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('myApiApi');
		const apiKey = credentials.apiKey as string;

		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let response: any;

				// ==================== CONVERSATION ====================
				if (resource === RESOURCES.CONVERSATION) {
					if (operation === OPERATIONS.LIST) {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as {
							teamId?: string;
							limit?: number;
						};

						const qs: Record<string, any> = {};
						if (additionalOptions.teamId) qs.team = additionalOptions.teamId;
						if (additionalOptions.limit) qs.limit = additionalOptions.limit;

						response = await this.helpers.request({
							method: 'GET',
							url: `${BASE_URL}/conversations`,
							headers: { 'Authorization': `Bearer ${apiKey}` },
							qs,
							json: true,
						});

						const simplifiedOutput = this.getNodeParameter('simplifiedOutput', i, true) as boolean;
						let items = extractItems(response, resource);

						if (simplifiedOutput) {
							const allowed = SIMPLIFIED_FIELDS[resource] || [];
							items = items.map(item => {
								const filtered: any = {};
								for (const field of allowed) {
									if (item[field] !== undefined) filtered[field] = item[field];
								}
								return filtered;
							});
						}

						for (const item of items) {
							returnData.push({ json: item });
						}
					}
					else if (operation === OPERATIONS.GET) {
						const id = this.getNodeParameter('id', i) as string;
						response = await this.helpers.request({
							method: 'GET',
							url: `${BASE_URL}/conversations/${id}`,
							headers: { 'Authorization': `Bearer ${apiKey}` },
							json: true,
						});
						returnData.push({ json: response });
					}
					else if (operation === OPERATIONS.CREATE) {
						const title = this.getNodeParameter('title', i) as string;
						response = await this.helpers.request({
							method: 'POST',
							url: `${BASE_URL}/conversations`,
							headers: { 'Authorization': `Bearer ${apiKey}` },
							body: { title },
							json: true,
						});
						returnData.push({ json: response });
					}
				}

				// ==================== ADD MORE RESOURCES HERE ====================
				// else if (resource === RESOURCES.CONTACT) { ... }

			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
```

## Class Structure Breakdown

### Imports
```typescript
import {
	IExecuteFunctions,      // For execute() method
	ILoadOptionsFunctions,  // For loadOptions methods
	INodeExecutionData,     // Return type for items
	INodePropertyOptions,   // For dropdown options
	INodeType,              // Interface for node class
	INodeTypeDescription,   // Interface for description
	NodeOperationError,     // For throwing errors
} from 'n8n-workflow';
```

### INodeTypeDescription Properties

| Property | Required | Description |
|----------|----------|-------------|
| `displayName` | ✅ | Name shown in n8n UI |
| `name` | ✅ | Internal identifier (camelCase) |
| `icon` | ✅ | Path to SVG: `file:icon.svg` |
| `group` | ✅ | Category: `['transform']` |
| `version` | ✅ | Node version (number) |
| `description` | ✅ | Brief description |
| `defaults` | ✅ | `{ name: 'NodeName' }` |
| `usableAsTool` | ⚪ | `true` for AI Agent support |
| `inputs` | ✅ | `['main']` |
| `outputs` | ✅ | `['main']` |
| `credentials` | ✅ | Array of credential references |
| `properties` | ✅ | Array of UI fields |

### Execute Method Pattern

```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();           // Get input items
	const returnData: INodeExecutionData[] = []; // Output accumulator
	const credentials = await this.getCredentials('credName');
	const resource = this.getNodeParameter('resource', 0) as string;

	for (let i = 0; i < items.length; i++) {
		try {
			const operation = this.getNodeParameter('operation', i) as string;

			if (resource === 'x') {
				if (operation === 'list') {
					// Handle list
				} else if (operation === 'get') {
					// Handle get
				}
			}
			// More resources...

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
		}
	}

	return [returnData];
}
```

### Load Options Registration

```typescript
methods = {
	loadOptions: {
		async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			// Fetch and return options
		},
		async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
			// Fetch and return options
		},
	},
};
```

**Use in property:**
```typescript
{
	displayName: 'Team',
	name: 'teamId',
	type: 'options',
	typeOptions: { loadOptionsMethod: 'getTeams' },  // <-- Method name
	default: '',
}
```

## Core Node Patterns

### 1. Parameter Organization

**Rule: Show only required fields by default. Optional filters go in "Additional Options" collection.**

```typescript
// Required field - always visible
{
  displayName: 'Title',
  name: 'title',
  type: 'string',
  required: true,
  displayOptions: {
    show: { resource: ['conversation'], operation: ['create'] },
  },
  default: '',
  description: 'The conversation title',
}

// Additional Options - collapsible, contains optional filters
{
  displayName: 'Additional Options',
  name: 'additionalOptions',
  type: 'collection',
  placeholder: 'Add Option',
  displayOptions: {
    show: { resource: ['conversation'], operation: ['list'] },
  },
  default: {},
  options: [
    {
      displayName: 'Team',
      name: 'teamId',
      type: 'options',
      typeOptions: { loadOptionsMethod: 'getTeams' },
      default: '',
      description: 'Filter by team',
    },
    {
      displayName: 'Limit',
      name: 'limit',
      type: 'number',
      default: 10,
      description: 'Max results to return',
    },
  ],
}
```

### 2. Simplified Output

For APIs with 30+ fields, add simplified output. Include 8-12 key fields.

**How to choose fields:**
1. Call API, examine response
2. Keep: id, name, title, date, status, foreign keys
3. Exclude: verbose content (transcripts, metadata, raw data)

```typescript
// Property
{
  displayName: 'Simplified Output',
  name: 'simplifiedOutput',
  type: 'boolean',
  displayOptions: {
    show: { resource: ['conversation'], operation: ['list', 'get'] },
  },
  default: true,
  description: 'Return only key fields instead of full response',
}

// Field whitelist at top of file
const SIMPLIFIED_FIELDS: Record<string, string[]> = {
  conversation: ['id', 'title', 'date_time', 'team_id', 'project_id', 'status'],
  contact: ['id', 'first_name', 'last_name', 'email', 'company_name'],
};

// In execute()
if (simplifiedOutput && response) {
  const allowed = SIMPLIFIED_FIELDS[resource] || [];
  return items.map(item => {
    const filtered: any = {};
    for (const field of allowed) {
      if (item[field] !== undefined) filtered[field] = item[field];
    }
    return filtered;
  });
}
```

### 3. AI Agent Tool Support (CRITICAL)

**Two properties are needed for AI Agent compatibility:**

#### 1. `usableAsTool: true` (Node Level)

Add this to the node description to enable the node as an AI Agent tool:

```typescript
export class MyApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'MyApi',
    name: 'myApi',
    icon: 'file:myapi.svg',
    usableAsTool: true,  // <-- Enable as AI Agent tool
    inputs: ['main'],
    outputs: ['main'],
    // ...
  };
}
```

#### 2. `action` Property (Operation Level)

Add `action` to each operation option for AI Agent descriptions:

```typescript
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  options: [
    { name: 'List', value: 'list', action: 'List conversations' },
    { name: 'Get', value: 'get', action: 'Get a conversation' },
    { name: 'Create', value: 'create', action: 'Create a conversation' },
  ],
  default: 'list',
}
```

**Red Flags - These are WRONG:**
- `routing` for AI tools - This is only for declarative HTTP request routing, not AI Agent compatibility
- `tool` - Not a valid property

**Both `usableAsTool: true` AND `action` are needed for full AI Agent compatibility.**

### 4. Load Options (Dynamic Dropdowns)

```typescript
// Property with loadOptionsMethod
{
  displayName: 'Team',
  name: 'teamId',
  type: 'options',
  typeOptions: { loadOptionsMethod: 'getTeams' },
  default: '',
  description: 'Filter by team',
}

// Helper function
async function getTeamOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  const credentials = await this.getCredentials('myApi');
  const response = await this.helpers.request({
    method: 'GET',
    url: `${BASE_URL}/teams`,
    headers: { 'Authorization': `Bearer ${credentials.apiKey}` },
    json: true,
  });

  // Handle response wrapper - CRITICAL
  const teams = Array.isArray(response)
    ? response
    : (response?.teams || response?.data || []);

  return teams.map((team: any) => ({
    name: team.name,
    value: team.id,
  }));
}
```

### 5. Response Wrappers

APIs nest data differently. Always handle wrapper keys:

```typescript
const RESPONSE_WRAPPERS: Record<string, string> = {
  conversation: 'data',      // { "data": [...] }
  contact: 'contacts',       // { "contacts": [...] }
  project: 'projects',       // { "projects": [...] }
};

function extractItems(response: any, resource: string): any[] {
  const wrapperKey = RESPONSE_WRAPPERS[resource];

  if (wrapperKey && response?.[wrapperKey]) {
    return response[wrapperKey];
  }
  if (response?.data) return Array.isArray(response.data) ? response.data : [response.data];
  if (Array.isArray(response)) return response;
  return [response];
}
```

## Quick Reference

| Pattern | Implementation |
|---------|----------------|
| Required fields | Direct properties with `required: true` |
| Optional filters | Collection named `additionalOptions` |
| Simplified output | Boolean option (default: true) + 8-12 field whitelist |
| **AI Agent tool** | **`usableAsTool: true` in description + `action` in operations** |
| Dynamic dropdowns | `loadOptionsMethod` + helper with wrapper handling |
| Response extraction | Check wrapper key, then `data`, then array |
| Publish to npm | `npm publish --access public` |
| Docker build | `docker compose run build` |
| Docker publish | `docker compose run publish` (requires .env with NPM_TOKEN) |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| All fields visible | Move optional fields to Additional Options collection |
| No simplified output | Add for APIs with 30+ fields |
| Missing `action` property | **REQUIRED** - add `action: 'Description'` to each operation |
| Missing `usableAsTool` | Add `usableAsTool: true` to node description for AI Agent compatibility |
| Dropdown empty | API wraps data: check `response.teams`, `response.data`, etc. |
| Publishing without building | Always `rm -rf dist && pnpm build` before publish |
| Docker volume overwrites fresh build | Don't mount `./dist:/app/dist` in publish service |
| Token in git | Use `.env` (gitignored) with `NPM_TOKEN` |

## Version Bumping

```bash
# Patch (1.0.0 → 1.0.1) - bug fixes
npm version patch

# Minor (1.0.0 → 1.1.0) - new features
npm version minor

# Major (1.0.0 → 2.0.0) - breaking changes
npm version major
```

After version bump, rebuild and publish:
```bash
rm -rf dist && pnpm build && npm publish --access public
```
