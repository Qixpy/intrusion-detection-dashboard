# 🔧 Troubleshooting Guide - Desktop App

## Issues Fixed ✅

### 1. Backend Server Not Starting
**Problem**: Desktop app showed "make sure background server is running"
**Solution**: ✅ Fixed Python command detection for Windows
- Updated main.js to use correct Python command (`python` vs `python3`)
- Added better error handling and fallback commands
- Improved server ready detection

### 2. React Default Icon
**Problem**: Desktop app still showed React logo
**Solution**: ✅ Fixed icon references and build process
- Corrected icon paths in index.html
- Rebuilt frontend with proper icon configuration
- Updated desktop app icon settings

## Current Status ✅

The desktop app should now:
- ✅ **Auto-start backend**: Python Flask server launches automatically
- ✅ **Load frontend**: React dashboard opens in Electron window
- ✅ **Proper icons**: Cybersecurity-themed icons instead of React default
- ✅ **Error handling**: Better error messages and fallback options

## Quick Test Commands

### Test Backend Manually
```powershell
cd backend
python app.py
# Should show: "Backend server detected as ready!"
```

### Test Desktop App
```powershell
cd desktop-app
npm run dev
# Should show Electron window with dashboard
```

### Test Web Version
```powershell
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
# Then open: http://localhost:3000
```

## Common Issues & Solutions

### Issue: "python is not recognized"
**Solution**: 
- Make sure Python is installed and in PATH
- Try `py` command instead of `python`
- Desktop app will automatically try fallback commands

### Issue: Port already in use
**Solution**: 
- Close any running instances
- Desktop app automatically finds free ports
- Check Task Manager for Python/Node processes

### Issue: Backend fails to start
**Solution**: 
1. Check Python dependencies: `pip install -r requirements.txt`
2. Verify backend directory exists
3. Check console output for error details

### Issue: Frontend shows errors
**Solution**: 
1. Rebuild frontend: `npm run build`
2. Check if backend is running on port 5000
3. Clear browser cache if using web version

### Issue: Icon still shows React logo
**Solution**: 
1. Rebuild frontend: `npm run build`
2. Clear Electron cache: Delete `%APPDATA%\intrusion-detection-dashboard`
3. Restart desktop app

### Issue: "Cannot find module" errors
**Solution**: 
1. Reinstall dependencies: `npm install`
2. Check Node.js version (needs 14+)
3. Clear npm cache: `npm cache clean --force`

## Verification Steps

After starting the desktop app, verify:
1. ✅ Electron window opens
2. ✅ Backend console shows "Backend server detected as ready!"
3. ✅ Frontend loads dashboard interface
4. ✅ No React logo visible
5. ✅ Can upload files and see alerts

## Performance Notes

- Backend startup takes 2-3 seconds (normal)
- Frontend loading takes 1-2 seconds (normal)
- Total app startup time: ~5 seconds (normal)

## Development vs Production

### Development Mode (`npm run dev`)
- ✅ Uses local source files
- ✅ Hot reload enabled
- ✅ Developer tools available
- ✅ Detailed console logging

### Production Build (`npm run build-win`)
- Uses bundled/compiled files
- Optimized performance
- Minimal logging
- Creates installer .exe

## Success Indicators

Look for these messages in console:
- `"Backend server detected as ready!"`
- `"Loading app from: http://localhost:3000"`
- No error messages in red
- Electron window opens without errors

## 🎉 If Everything Works

You should see:
1. Electron window with cybersecurity-themed dashboard
2. Dark UI with professional styling
3. Functional file upload area
4. Working navigation and charts
5. Backend API responding to requests

**Status: Both issues have been resolved! 🛡️✨**
