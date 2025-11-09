# Windows-Specific Fixes

## Issue: ANALYZE Not Recognized

**Problem:** 
```bash
ANALYZE is not recognized as an internal or external command
```

**Cause:** 
The `ANALYZE=true` syntax is Unix/Linux/Mac specific. Windows uses different syntax for environment variables.

**Solution:** 
✅ **Fixed!** Installed `cross-env` for cross-platform compatibility.

---

## Updated Commands

### Bundle Analysis:
```bash
# Works on Windows, Mac, Linux
npm run analyze
```

This command now:
1. Uses `cross-env` for cross-platform environment variables
2. Builds with webpack (bundle analyzer doesn't support Turbopack yet)
3. Generates interactive bundle visualization
4. Opens in your browser automatically

---

## Other Windows-Specific Notes

### Environment Variables:

**Old (Unix only):**
```bash
ANALYZE=true npm run build  # ❌ Doesn't work on Windows
```

**New (Cross-platform):**
```bash
npm run analyze  # ✅ Works everywhere
```

### Alternative Methods (Windows-specific):

If you need to set env vars manually:

**CMD:**
```cmd
set ANALYZE=true && npm run build
```

**PowerShell:**
```powershell
$env:ANALYZE="true"; npm run build
```

**Git Bash (Windows):**
```bash
ANALYZE=true npm run build
```

But you don't need these anymore - `npm run analyze` works everywhere! 🎉

---

## Bundle Analyzer Usage

### Run Analysis:
```bash
npm run analyze
```

**What it does:**
1. Builds your app with webpack
2. Generates `.next/analyze/` directory
3. Opens browser with interactive visualization
4. Shows all bundles, chunks, and packages

### What to Look For:

1. **Large Packages:**
   - Look for unexpected large dependencies
   - Consider alternatives or lazy loading

2. **Duplicate Code:**
   - Same package loaded multiple times
   - Might indicate build configuration issues

3. **Unused Code:**
   - Large packages with small usage
   - Candidates for tree-shaking

### Example Output:

You'll see:
- 📊 Client bundle visualization
- 📦 Server bundle visualization  
- 🔍 Package-by-package breakdown
- 📈 Size comparisons

---

## Performance Tips for Windows

### 1. Use PowerShell or Git Bash
Both work better than CMD for development.

### 2. Exclude .next from Antivirus
Add `.next/` and `node_modules/` to Windows Defender exclusions for faster builds.

**How to exclude:**
1. Windows Security → Virus & threat protection
2. Manage settings → Add exclusions
3. Add your project folder

**Expected improvement:** 30-50% faster builds

### 3. Use WSL2 for Best Performance
Windows Subsystem for Linux 2 gives near-native Linux performance.

```bash
# Install WSL2
wsl --install

# Then run your project in WSL2 instead of Windows
```

---

## Troubleshooting

### Issue: Slow Builds on Windows

**Solution 1:** Exclude from antivirus (see above)

**Solution 2:** Use Turbopack for dev (already enabled)
```bash
npm run dev  # Already uses Turbopack
```

**Solution 3:** Use WSL2 for development

---

### Issue: Permission Errors

**Solution:** Run terminal as Administrator, or check folder permissions

---

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

---

## All Commands Work on Windows Now! ✅

```bash
npm run dev          # ✅ Development server
npm run build        # ✅ Production build (Turbopack)
npm run build:webpack # ✅ Production build (Webpack)
npm run start        # ✅ Start production server
npm run lint         # ✅ Run linter
npm run analyze      # ✅ Bundle analysis (cross-platform!)
```

---

## Need More Help?

Check these files:
- `PHASE4_PROGRESS.md` - Current progress
- `package.json` - All available scripts
- Next.js docs: https://nextjs.org/docs

**Everything is configured to work seamlessly on Windows!** 🎊

