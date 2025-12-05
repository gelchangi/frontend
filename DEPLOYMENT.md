# DecaDrive Frontend - Deployment Checklist

Use this checklist before deploying to production or presenting your project.

## Pre-Deployment Checklist

### 1. Backend Configuration

- [ ] Backend is running and accessible
- [ ] Backend URL is updated in `app.js` (line 18)
  - Development: `http://localhost:3000`
  - Production: `https://your-backend.onrender.com` (or your deployed URL)
- [ ] CORS is enabled on backend for your frontend domain
- [ ] All API endpoints are working:
  - [ ] `GET /lessons`
  - [ ] `GET /lessons?q=search`
  - [ ] `GET /lessons?sortBy=price&order=asc`
  - [ ] `POST /orders`
  - [ ] `PUT /lessons/:id`

### 2. Frontend Testing

- [ ] Home page loads correctly
- [ ] Lessons page fetches and displays lessons
- [ ] Search functionality works (type in search box)
- [ ] Sort functionality works (try different fields and orders)
- [ ] Add to cart works
- [ ] Cart page displays items correctly
- [ ] Quantity controls work (+ and - buttons)
- [ ] Remove from cart works
- [ ] Checkout form validation works:
  - [ ] Name field validates (letters and spaces only)
  - [ ] Phone field validates (digits only, min 6)
  - [ ] Submit button disabled until valid
- [ ] Order submission works
- [ ] Spaces decrement after successful order
- [ ] Order success page shows order ID
- [ ] Theme toggle works (light/dark mode)
- [ ] Theme persists on refresh
- [ ] All pages are responsive (test on mobile size)

### 3. Browser Testing

Test in multiple browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)

### 4. Code Quality

- [ ] All console errors resolved (check browser DevTools)
- [ ] No 404 errors for resources
- [ ] Images load correctly (Unsplash URLs from backend)
- [ ] Material Icons load correctly

### 5. Documentation

- [ ] README.md is complete and accurate
- [ ] Screenshots added to `screenshots/` folder
- [ ] Comments in code are clear and helpful
- [ ] Demo script is ready

### 6. GitHub Pages Deployment

- [ ] Repository created on GitHub
- [ ] All files committed and pushed
- [ ] GitHub Pages enabled in repository settings
- [ ] Custom domain configured (if applicable)
- [ ] Site is accessible at GitHub Pages URL
- [ ] Backend URL points to production backend (not localhost)

### 7. Demo Preparation

- [ ] Practice running through demo script
- [ ] Prepare to explain:
  - [ ] Why Vue 2 (course requirement)
  - [ ] Why fetch instead of axios (course requirement)
  - [ ] How page switching works (v-if instead of router)
  - [ ] How search calls the backend
  - [ ] How cart state is managed
  - [ ] How validation works (regex patterns)
  - [ ] How order flow works (POST order → PUT spaces)
- [ ] Screenshots ready to show
- [ ] Network tab ready to show API calls

## Quick Test Commands

### Test backend connectivity:

```bash
# Check if backend is running
curl http://localhost:3000/lessons

# Should return JSON array of lessons
```

### Test frontend locally:

```bash
# Start server
cd /Users/paulkamani/Documents/decadrive/frontend
python3 -m http.server 8080

# Open in browser
# http://localhost:8080
```

### Deploy to GitHub Pages:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Complete DecaDrive frontend"

# Add remote
git remote add origin https://github.com/yourusername/decadrive-frontend.git

# Push to main
git push -u origin main

# Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch
```

## Common Issues & Solutions

### Issue: Lessons not loading

**Solution**:

1. Check browser console for errors
2. Verify `BACKEND_URL` in `app.js`
3. Ensure backend is running
4. Check CORS settings on backend

### Issue: Images broken

**Solution**:

1. Check that backend returns `image` field with valid URLs
2. Open Network tab and check image requests
3. Verify Unsplash URLs are accessible

### Issue: Order fails to submit

**Solution**:

1. Ensure form validation passes
2. Check cart is not empty
3. Verify backend `/orders` endpoint works
4. Check browser console for error details

### Issue: Spaces not updating

**Solution**:

1. Verify `PUT /lessons/:id` endpoint works
2. Check that order was created successfully first
3. Reload lessons page to see updated spaces

### Issue: Theme not saving

**Solution**:

1. Check localStorage is enabled (not in private mode)
2. Open DevTools → Application → Local Storage
3. Verify `darkMode` key exists

## Pre-Demo Checklist

30 minutes before presentation:

- [ ] Backend is running (production or local)
- [ ] Frontend is accessible (GitHub Pages or local)
- [ ] Browser is open with DevTools ready
- [ ] Network tab is cleared
- [ ] No cached data interfering
- [ ] Screenshots are ready to show
- [ ] Demo script is reviewed

Good luck with your presentation! 🚗💨
