# Setup Instructions - AI Code Impact Analysis Platform

## ⚠️ Important: PowerShell Execution Policy Issue

Your system has PowerShell execution policies that are blocking npm commands. You'll need to install dependencies manually.

## Quick Fix for PowerShell

Run this command in PowerShell **as Administrator**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then close and reopen your terminal.

---

## Backend Setup (REQUIRED)

### Step 1: Install Dependencies

Navigate to the backend folder and run:
```bash
cd c:\syncup\impact-analysis-platform\backend
npm install express @prisma/client prisma@5.22.0 @types/node @types/express ts-node nodemon
```

### Step 2: Create .env File

Copy the example file:
```bash
copy .env.example .env
```

Edit `.env` with your actual values:
```env
DATABASE_URL="mysql://root:password@localhost:3306/impact_analysis"
PORT=3001
GEMINI_API_KEY="your-actual-gemini-api-key"
```

**Get Gemini API Key**: https://makersuite.google.com/app/apikey

### Step 3: Setup Database

Run Prisma migrations:
```bash
npx prisma db push
npx prisma generate
```

### Step 4: Start Backend

```bash
npm run dev
```

Backend should start on `http://localhost:3001`

---

## Frontend Setup (REQUIRED)

### Step 1: Install Dependencies

```bash
cd c:\syncup\impact-analysis-platform\frontend
npm install
```

### Step 2: Start Frontend

```bash
npm run dev
```

Frontend should start on `http://localhost:5173`

---

## What Changed: OpenAI → Gemini

✅ **AIService** now uses Google Gemini instead of OpenAI
✅ **Environment variable** changed from `OPENAI_API_KEY` to `GEMINI_API_KEY`
✅ **Model**: Uses `gemini-pro` instead of `gpt-4`
✅ **JSON extraction**: Handles Gemini's markdown code block responses

All AI features work identically, just with a different provider.

---

## Verification Checklist

After setup, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can create a project in the UI
- [ ] Can add a repository
- [ ] Graph visualizes after indexing

---

## Common Issues

### Issue: "Cannot find module '@prisma/client'"
**Solution**: Run `npx prisma generate` in the backend folder

### Issue: "Cannot find module 'express'"
**Solution**: Run `npm install` in the backend folder

### Issue: Prisma version error
**Solution**: We're using Prisma 5.22.0 (compatible with Node 20.16)

### Issue: npm commands fail
**Solution**: Fix PowerShell execution policy (see top of document)

---

## Files Modified

1. `backend/src/services/AIService.ts` - Switched to Gemini
2. `backend/.env.example` - Updated to GEMINI_API_KEY
3. `backend/src/config/env.ts` - Updated config
4. `README.md` - Updated documentation
5. `backend/package.json` - Added missing dependencies

---

## Next Steps

1. Fix PowerShell execution policy
2. Install backend dependencies
3. Create `.env` file with your credentials
4. Run `npx prisma db push`
5. Start both backend and frontend
6. Test by adding a repository!
