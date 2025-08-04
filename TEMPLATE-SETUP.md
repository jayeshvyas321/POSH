# Template Setup Guide

## Files to Remove When Using as Template

When you download this project as a template for your own use, remove these files:

### Replit-specific files:
- `.replit`
- `replit.nix` 
- `.local/` folder (if present)

### Development/template files:
- `AuthContext-local.tsx`
- `README-LOCAL-SETUP.md`
- `package-final.json`
- `package-windows.json`
- `start-dev.bat`
- `vite.config-fixed.ts`
- `vite.config-local.ts`
- `vite.config.local.ts`
- `API-INTEGRATION-GUIDE.md`
- `TEMPLATE-SETUP.md` (this file)

### Clean Git History (Optional):
If you want a clean Git history for your new project:
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"
```

## Core Files to Keep

These are the essential template files:
- `client/` - React frontend
- `server/` - Express backend  
- `shared/` - Shared types and schemas
- `package.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `components.json`
- `drizzle.config.ts`
- `replit.md` (update with your project details)

## Getting Started

1. Remove the files listed above
2. Update `package.json` with your project name
3. Update `replit.md` with your project details
4. Install dependencies: `npm install`
5. Install cross-env for Windows compatibility: `npm install --save-dev cross-env`
6. Start development:
   - **Windows**: Use `dev-windows.bat` or `npm run dev:windows` (after adding script)
   - **Mac/Linux**: `npm run dev`

### Windows Setup Fix

If you get the error `'NODE_ENV' is not recognized as an internal or external command`:

**Option 1: Use the batch file (Recommended for Windows)**
```bash
# Run this instead of npm run dev
./dev-windows.bat
```

**Option 1b: PowerShell alternative**
```powershell
# If batch file doesn't work, try in PowerShell:
$env:NODE_ENV="development"; tsx server/index.ts
```

**Option 2: Install cross-env and update package.json**
```bash
npm install --save-dev cross-env
```
Then manually edit your `package.json` scripts to:
```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "dev:windows": "set NODE_ENV=development && tsx server/index.ts"
  }
}
```

The template includes:
- User management with CRUD operations
- Role-based access control
- API endpoints ready for backend integration
- Form validation and error handling
- Responsive UI with shadcn/ui components