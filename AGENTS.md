# n8n-nodes-centum - Agent Guide

> ⚠️ **CRITICAL - Read First**: This project uses Docker for builds. Read the "CRITICAL RULES" section below before making ANY changes.

---

## 📋 Quick Reference

| What | Command |
|------|---------|
| **Build** | `docker compose run build` |
| **Publish** | `docker compose run publish` |
| **Clean dist** | `rm -rf dist` |

**Critical Rules:**
1. **100% Docker-based** - ALL commands use Docker, including publish
2. Build before every commit and publish
3. Never add `Co-Authored-By` to commits - keep them clean
4. **Never commit credentials** - `.env` is in `.gitignore`
5. **ALWAYS clean dist before build** - Run `rm -rf dist` before building to avoid stale compiled code

---

## 🚨 CRITICAL RULES - READ FIRST

### 1. 100% DOCKER-BASED ENVIRONMENT

This project is **100% Docker-based**. ALL npm/pnpm commands MUST run inside containers.

#### ❌ FORBIDDEN (will not work):
```bash
pnpm install
pnpm build
pnpm dev
npm publish
npm whoami
```

#### ✅ CORRECT (always use Docker):
```bash
docker compose run build    # Build the package
docker compose run publish  # Publish to npm
```

### 2. PUBLISHING WORKFLOW

**One-time setup:**
Create `.env` file with your npm token:
```bash
echo "NPM_TOKEN=npm_your_token_here" > .env
```

**Publish:**
```bash
# 1. Clean dist (CRITICAL - avoids stale compiled code)
rm -rf dist

# 2. Build with fresh Docker image
docker compose build --no-cache

# 3. Publish to npm
docker compose run publish
```

**Note:** `.env` is in `.gitignore` - never commit credentials.

**Verify published code matches source:**
```bash
# Check if a function in published package matches local source
curl -s https://registry.npmjs.org/n8n-nodes-centum/VERSION | jq '.dist.tarball' -r | xargs curl -s | tar -xzf - -O package/dist/nodes/Centum/Centum.node.js | grep -A 10 "FUNCTION_NAME"
```

### 3. GIT COMMIT CONVENTIONS

**⚠️ NEVER add `Co-Authored-By` lines to commits.**

**✅ CORRECT:**
```
feat(node): add new resource
```

**❌ WRONG:**
```
feat(node): add new resource

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

## Project Overview

This is an **n8n community node** that provides integration with the **Centum ERP** API. It allows n8n users to interact with Centum resources (clientes, artículos, pedidos, facturas, compras, stock, etc.) directly in their workflows.

- **Package**: `n8n-nodes-centum`
- **GitHub**: `https://github.com/gauchocode/n8n-nodes-centum`
- **Author**: GauchoCode
- **Node.js**: >=20.15
- **Package Manager**: pnpm (inside Docker)

---

## Project Structure

```
n8n-nodes-centum/
├── package.json           # Package config, n8n metadata
├── tsconfig.json          # TypeScript config
├── .env                   # NPM_TOKEN (gitignored)
├── .gitignore             # Ignored files
├── README.md              # User documentation
├── AGENTS.md              # This file
├── Dockerfile             # Build container
├── docker-compose.yml     # Docker compose for builds
├── nodes/
│   └── Centum/
│       ├── Centum.node.ts         # Main node implementation
│       ├── CentumDescription.ts   # Node property definitions
│       ├── centum.svg             # Node icon
│       ├── helpers/
│       │   └── functions.ts       # API helper functions
│       ├── interfaces/            # TypeScript interfaces
│       │   ├── index.ts
│       │   ├── articulos.ts
│       │   ├── clientes.ts
│       │   ├── nuevoPedidoVenta.ts
│       │   └── ...
│       └── constants/             # Static data constants
│           ├── index.ts
│           ├── condiciones.ts
│           ├── provincias.ts
│           └── zonas.ts
├── credentials/
│   └── CentumApi.credentials.ts   # API credential definition
└── dist/                  # Built output (gitignored)
    ├── nodes/
    └── credentials/
```

---

## Build Process

### Docker Build (REQUIRED)

```bash
# Build using Docker
docker compose run build
```

This is the **only supported way** to build in this environment.

### What the Build Does

1. Cleans `dist/` directory (`npm run clean`)
2. Compiles TypeScript (`tsc`)
3. Copies icons via gulp (`gulp build:icons`)
4. Outputs to `dist/` directory

### Output Structure

```
dist/
├── nodes/
│   └── Centum/
│       ├── Centum.node.js         # Compiled node
│       ├── Centum.node.d.ts       # Type declarations
│       ├── CentumDescription.js
│       └── centum.svg             # Icon
└── credentials/
    ├── CentumApi.credentials.js
    └── CentumApi.credentials.d.ts
```

---

## Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| **Language** | TypeScript ^5.8.2 |
| **Target** | ES2022 / CommonJS |
| **Runtime** | Node.js >=20.15 |
| **n8n API** | n8n-workflow * |
| **Package Manager** | pnpm (Docker) |
| **Build Tool** | gulp (icons) |

### Node Files

| File | Purpose |
|------|---------|
| `Centum.node.ts` | Main node with execute logic and method registration |
| `CentumDescription.ts` | All property/operation definitions |
| `CentumApi.credentials.ts` | API credential definition |
| `helpers/functions.ts` | API request helpers |
| `interfaces/` | TypeScript interfaces for API entities |
| `constants/` | Static data (provincias, zonas, condiciones) |

### Authentication

- **Type**: API Key / Token
- **Credential name**: `centumApi`

---

## Code Conventions

### File Naming

- Source files: `PascalCase.ts` for node files
- Output files: `PascalCase.js` (compiled)
- Helpers/interfaces/constants: `camelCase.ts`

### Code Style

- **Indentation**: Tabs
- **Strings**: Single quotes for TypeScript
- **Types**: Explicit return types for async functions
- **Error Handling**: Use `NodeOperationError` with `itemIndex`

### Error Handling Pattern

```typescript
try {
  // API call
} catch (error: any) {
  if (this.continueOnFail()) {
    returnData.push({ json: { error: error.message } });
    continue;
  }
  throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
}
```

---

## Git Commit Conventions

**Do NOT add `Co-Authored-By` lines to commits.**

**Commit message format:**
```
type(scope): brief description

- Optional bullet point
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(node): add pedido venta resource
fix(credentials): handle missing API key
docs(readme): update installation instructions
```

---

## Development Workflow

### Adding a New Resource

1. Add to `RESOURCES` constant in `CentumDescription.ts`
2. Add operation selector with `displayOptions.show.resource`
3. Add all field definitions for the resource
4. Add `else if (resource === RESOURCES.NEW_RESOURCE)` block in `execute()` in `Centum.node.ts`
5. Implement all operations
6. Add interfaces to `interfaces/` if needed
7. Update README.md

### Adding a New Operation

1. Add to `OPERATIONS` constant (if new)
2. Add operation selector option in `CentumDescription.ts`
3. Add field definitions with proper `displayOptions`
4. Implement in `execute()` method in `Centum.node.ts`

### Testing

1. Build the project: `docker compose run build`
2. Link to n8n for testing:
   ```bash
   # In n8n's custom directory
   cd ~/.n8n/custom
   npm link /path/to/n8n-nodes-centum
   ```
3. Restart n8n
4. Test in n8n workflow editor

### Publishing to npm

**One-time setup:**
Create `.env` file with your npm token:
```bash
echo "NPM_TOKEN=npm_your_token_here" > .env
```

**Publish workflow:**
```bash
# 1. Build
docker compose run build

# 2. Publish
docker compose run publish
```

**Note:** `.env` is in `.gitignore` - never commit credentials.

**After publishing:**
- Verify at https://www.npmjs.com/package/n8n-nodes-centum
- Test installation in n8n: Settings > Community Nodes > Install `n8n-nodes-centum`

---

## Common Tasks

### Add a New Field

1. Add property definition in `CentumDescription.ts`
2. Add parameter retrieval in `Centum.node.ts` `execute()`:
   ```typescript
   const newField = this.getNodeParameter('newField', i, 'default') as string;
   ```
3. Add to request body if needed

### Add Dropdown Options (Static)

Add an `options` array directly in the property definition in `CentumDescription.ts`.

### Add Dropdown Options (Dynamic)

1. Create load options helper in `Centum.node.ts` methods:
   ```typescript
   async getOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
     // fetch from API
   }
   ```
2. Register in `methods.loadOptions`
3. Use in property with `typeOptions.loadOptionsMethod`

---

## Troubleshooting

### Build Errors

**TypeScript compilation fails:**
- Verify all imports are correct
- Check for type errors in console output
- Ensure interfaces in `interfaces/` are up to date

**Icon not copied:**
- Verify `centum.svg` exists in `nodes/Centum/`
- Check gulp build script in `package.json`

### Runtime Errors

**"Credentials not found":**
- Verify credential is saved in n8n
- Check credential name matches `centumApi`

**"API request failed":**
- Verify API key/token is valid
- Check network connectivity to Centum API

**Dropdown options not loading:**
- Check load options method is registered in `methods.loadOptions`
- Verify API endpoint is accessible
- Check credentials are valid

---

## n8n Package Configuration

### package.json n8n Section

```json
{
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/CentumApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/Centum/Centum.node.js"
    ]
  }
}
```

### Important Notes

- **Main entry**: `dist/nodes/Centum/Centum.node.js`
- **Files included**: Only `dist/` directory
- **Node version**: 1 (n8n API version)
- **Node.js requirement**: >=20.15

---

## Related Resources

- [n8n Node Development](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Workflow Types](https://github.com/n8n-io/n8n/tree/master/packages/workflow)
- [GitHub Repo](https://github.com/gauchocode/n8n-nodes-centum)

---

**Last Updated**: 2026-03-09
**Version**: 0.2.47
**Node.js**: >=20.15
**Package Manager**: pnpm (Docker)
