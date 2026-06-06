# 🚀 DEPLOY NOW - Quick Reference

## ONE Command to Deploy Everything

```powershell
cd C:\Users\santh\Website\APEXSKILLS && .\Deploy-Production.ps1
```

---

## What Happens

1. **Build** (2-3 min)
   - Compiles React + Vite
   - Bundles all components
   - Generates dist/ folder

2. **Deploy** (30 sec)
   - Syncs dist/ to S3
   - Clears CloudFront cache
   - Updates production frontend

3. **Verify** (30 sec)
   - Tests frontend loads
   - Tests API responds
   - Tests login works
   - Tests SSL certificate
   - Shows results

**Total Time**: ~5-10 minutes

---

## What Gets Updated

✅ Frontend: https://www.apexplacements.in
✅ Student Dashboard: https://www.apexplacements.in/#/lms/student
✅ Trainer Dashboard: https://www.apexplacements.in/#/lms/trainer
✅ All 25 LMS components
✅ Responsive CSS styling

---

## After Deployment

### Test With
- **Email**: srikanth.hr@apexplacements.in
- **Password**: Srikanth@12#*
- **Role**: HR
- **Expected**: HR Dashboard

### For Trainer Testing
- Create account first (see QUICK_FIX_TRAINER_LOGIN.md)
- **Email**: srikanth.tr@apexplacements.in
- **Password**: trainer@123
- **Expected**: Trainer Dashboard with all tabs

### For Student Testing
- Create account first
- **Email**: student@apexplacements.in
- **Password**: student@123
- **Expected**: Student Dashboard with all tabs

---

## If Something Goes Wrong

| Issue | Solution |
|-------|----------|
| Build fails | Run: `npm run build` manually in frontend/apex-app |
| Frontend shows old version | Clear browser cache (Ctrl+Shift+Delete) |
| API returns 401 | Create trainer account (see QUICK_FIX_TRAINER_LOGIN.md) |
| Components not loading | Check browser console (F12), look for import errors |
| Deployment fails | Verify AWS credentials: `aws sts get-caller-identity` |

---

## Documentation

- **Build Issues**: BUILD_FIX_SUMMARY.md
- **Login Issues**: QUICK_FIX_TRAINER_LOGIN.md
- **Deployment Issues**: PRODUCTION_LOGIN_FIX.md
- **Full Deployment**: PRODUCTION_DEPLOYMENT_CHECKLIST.md
- **LMS Guide**: LMS_README.md
- **LMS Quick Start**: LMS_QUICK_START.md

---

## Status After Deploy

✅ Frontend Live  
✅ Backend Running  
✅ Database Ready  
✅ LMS Integrated  
✅ Ready for Testing  

**Next**: Open browser → https://www.apexplacements.in → Login → Test

---

## Command Reference

```powershell
# Full deployment
.\Deploy-Production.ps1

# Build only
.\Deploy-Production.ps1 -Action build

# Deploy only (after build)
.\Deploy-Production.ps1 -Action deploy

# Verify only
.\Deploy-Production.ps1 -Action verify
```

---

**Ready? Run the deployment command above!** 🚀
