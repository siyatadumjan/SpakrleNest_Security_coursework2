# Login Issues Troubleshooting Guide

## Common Issues and Solutions

### 1. Certificate Issues (Most Common)
**Problem**: Browser blocks self-signed certificates
**Solutions**:
- Open https://localhost:5000/test in browser and accept certificate
- Open https://localhost:3000 in browser and accept certificate
- Clear browser cache and try again

### 2. CORS Issues
**Problem**: Cross-Origin Request Blocked
**Solution**: Make sure both servers are running on HTTPS

### 3. Network Connection Issues
**Problem**: Cannot connect to backend
**Solutions**:
- Check if backend is running: `npm start` in backend folder
- Verify port 5000 is not blocked by firewall
- Test API: Open https://localhost:5000/test in browser

### 4. Authentication Issues
**Problem**: Login fails with correct credentials
**Solutions**:
- Check browser console for detailed error messages
- Verify user exists in database
- Check if account is locked (5 failed attempts = 15min lockout)

### 5. Database Connection Issues
**Problem**: MongoDB connection fails
**Solutions**:
- Start MongoDB: `mongod` or start MongoDB service
- Check connection string in .env file
- Verify database name: 'cosmocare'

## Step-by-Step Debugging

1. **Start Backend**:
   ```bash
   cd security_backend
   npm start
   ```

2. **Test Backend**:
   - Open https://localhost:5000/test
   - Should see "Test API is working!"

3. **Start Frontend**:
   ```bash
   cd security_frontend
   npm start
   ```

4. **Accept Certificates**:
   - Browser will show security warning
   - Click "Advanced" → "Proceed to localhost (unsafe)"
   - Do this for both frontend and backend URLs

5. **Test Login**:
   - Open browser developer tools (F12)
   - Go to Console tab
   - Attempt login
   - Check for error messages

## Common Error Messages

### "net::ERR_CERT_AUTHORITY_INVALID"
- **Cause**: Self-signed certificate not accepted
- **Fix**: Accept certificate in browser

### "Access to XMLHttpRequest has been blocked by CORS policy"
- **Cause**: CORS configuration issue
- **Fix**: Ensure both servers use HTTPS

### "Network Error"
- **Cause**: Backend not running or connection issue
- **Fix**: Start backend server and accept certificates

### "User Does Not Exist" or "Password Does Not Match"
- **Cause**: Invalid credentials or account lockout
- **Fix**: Check credentials or wait 15 minutes if locked

## Quick Fixes

1. **Restart both servers**
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Use incognito/private browsing mode**
4. **Disable browser extensions** temporarily
5. **Check Windows Firewall** settings

## If Still Having Issues

1. Check browser console (F12 → Console)
2. Check backend terminal for error messages
3. Verify MongoDB is running
4. Check if ports 3000 and 5000 are available
5. Try different browser

## Environment Setup Verification

Backend should show:
```
Server is running on PORT 5000
Database Connected Successfully!
```

Frontend should open browser to:
```
https://localhost:3000
```

Both should have valid HTTPS certificates (even if self-signed).
