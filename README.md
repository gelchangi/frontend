# DecaDrive Frontend

A modern, responsive single-page application for browsing and booking driving lessons. Built with **Vue 2**, plain HTML/CSS/JavaScript, and designed for static hosting on GitHub Pages.

![DecaDrive Logo](assets/logo.svg)

## 🎯 Features

- **Vue 2 Single-Page App** - No router, uses `v-if`/`v-else` for page switching
- **Beautiful UI/UX** - Apple-inspired clean design with Material 3 principles
- **Light & Dark Modes** - Smooth theme toggle with localStorage persistence
- **Search & Sort** - Real-time search with backend integration and multi-field sorting
- **Shopping Cart** - Add lessons, adjust quantities, manage cart items
- **Form Validation** - Live validation for name (letters+spaces) and phone (digits only)
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Accessibility** - Semantic HTML, keyboard navigation, reduced motion support
- **No Build Tools** - Pure HTML/CSS/JS files, ready to deploy

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local development server) or any static file server
- DecaDrive backend running (see backend setup)

### Running Locally

1. **Clone or download this repository**

2. **Set the backend URL**

   Open `app.js` and update the `BACKEND_URL` constant (line 18):

   ```javascript
   const BACKEND_URL = "http://localhost:3000"; // Change to your backend URL
   ```

3. **Start a local server**

   Using Python 3 (recommended for macOS/Linux):

   ```bash
   cd /Users/paulkamani/Documents/decadrive/frontend
   python3 -m http.server 8080
   ```

   Or using Node.js (if you have `http-server` installed):

   ```bash
   npx http-server -p 8080
   ```

4. **Open in browser**

   Navigate to: `http://localhost:8080`

## 📁 Project Structure

```
frontend/
├── index.html          # Main HTML file with Vue app structure
├── app.js              # Vue instance, state management, API calls
├── styles.css          # All styles with light/dark theme support
├── assets/
│   └── logo.svg        # DecaDrive logo (steering wheel + car icon)
├── screenshots/        # (Add screenshots here for demo)
└── README.md           # This file
```

## 🎨 Pages & Navigation

The app has 5 main views controlled by `currentPage` variable:

### 1. **Home** (`currentPage === 'home'`)

- Landing page with DecaDrive branding
- Call-to-action button to browse lessons
- Light/dark mode toggle

### 2. **Lessons** (`currentPage === 'lessons'`)

- Displays all available driving lessons
- Features:
  - **Search**: Type to search (calls `GET /lessons?q=<query>`)
  - **Sort**: By subject, location, price, or spaces (ascending/descending)
  - **Lesson Cards**: Beautiful cards with Unsplash images from backend
  - **Add to Cart**: Button disabled when `spaces === 0`

### 3. **Cart** (`currentPage === 'cart'`)

- Review selected lessons
- Adjust quantities (validated against available spaces)
- Remove items
- View total price
- Proceed to checkout

### 4. **Checkout** (`currentPage === 'checkout'`)

- Order summary (read-only)
- Customer information form:
  - **Name**: Letters and spaces only, required
  - **Phone**: Digits only, minimum 6 digits, required
- Live validation with error messages
- Submit button disabled until form is valid

### 5. **Order Success** (`currentPage === 'orderSuccess'`)

- Confirmation screen with order ID
- Order summary details
- Return to lessons button

## 🔌 API Integration

All API calls use **fetch()** with Promises (no axios).

### Endpoints Used

| Method | Endpoint       | Purpose              | Query Params                                   |
| ------ | -------------- | -------------------- | ---------------------------------------------- |
| GET    | `/lessons`     | Fetch all lessons    | `?q=<search>&sortBy=<field>&order=<asc\|desc>` |
| POST   | `/orders`      | Create new order     | Body: `{name, phone, lessons[]}`               |
| PUT    | `/lessons/:id` | Update lesson spaces | Body: `{spaces: <new_count>}`                  |

### Example API Calls

**Fetch all lessons:**

```bash
curl http://localhost:3000/lessons
```

**Search lessons:**

```bash
curl "http://localhost:3000/lessons?q=driving"
```

**Sort lessons:**

```bash
curl "http://localhost:3000/lessons?sortBy=price&order=asc"
```

**Create order:**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "1234567890",
    "lessons": [
      {"id": "abc123", "subject": "Highway Driving", "price": 50, "quantity": 2}
    ]
  }'
```

**Update lesson spaces:**

```bash
curl -X PUT http://localhost:3000/lessons/abc123 \
  -H "Content-Type: application/json" \
  -d '{"spaces": 8}'
```

## 🎬 Demo Script (for Presentation)

### Step 1: Browse Lessons

1. Navigate to Lessons page
2. Show lesson cards with images, prices, and available spaces
3. Demonstrate search functionality (type "highway" or location name)
4. Show sorting by different fields (price, spaces, subject)

### Step 2: Add to Cart

1. Click "Add to Cart" on multiple lessons
2. Notice cart badge updates in navbar
3. Try clicking on a lesson with 0 spaces (button disabled)
4. Show "Added" state on lessons already in cart

### Step 3: Manage Cart

1. Navigate to Cart page
2. Adjust quantities using +/- buttons
3. Show quantity validation (can't exceed available spaces)
4. Remove an item from cart
5. View real-time total price updates

### Step 4: Checkout & Validation

1. Click "Proceed to Checkout"
2. Try submitting empty form (validation errors appear)
3. Enter invalid name with numbers (see error message)
4. Enter invalid phone with letters (see error message)
5. Enter valid data and submit

### Step 5: Order Confirmation

1. Show success page with order ID
2. Point out order details display
3. Return to lessons and refresh
4. **Important**: Show that lesson spaces have decreased by ordered quantity

### Step 6: Theme Toggle

1. Click theme toggle in navbar
2. Show smooth transition between light and dark modes
3. Refresh page - theme persists (localStorage)

## 🎨 Design System

### Colors

**Light Mode:**

- Background: White (`#ffffff`)
- Text: Dark gray (`#1a1a1a`)
- Accent: Blue (`#3b82f6`)

**Dark Mode:**

- Background: Deep black (`#0a0a0a`)
- Text: Off-white (`#f5f5f5`)
- Accent: Light blue (`#60a5fa`)

### Typography

- Font: System font stack (San Francisco on macOS, Segoe UI on Windows)
- Headings: 700-800 weight
- Body: 400 weight
- Scale: 0.85rem to 3.5rem

### Spacing

- Uses consistent spacing scale (0.25rem to 3rem)
- CSS custom properties for easy theming

## ✅ Form Validation Rules

### Name Field

- **Required**: Cannot be empty
- **Pattern**: Only letters (A-Z, a-z) and spaces allowed
- **Regex**: `/^[A-Za-z ]+$/`
- **Error Messages**:
  - "Name is required" (if empty)
  - "Name must contain only letters and spaces" (if invalid chars)

### Phone Field

- **Required**: Cannot be empty
- **Pattern**: Only digits (0-9) allowed
- **Min Length**: 6 digits
- **Regex**: `/^\d+$/`
- **Error Messages**:
  - "Phone number is required" (if empty)
  - "Phone must contain only digits" (if invalid chars)
  - "Phone must be at least 6 digits" (if too short)

### Validation Behavior

- **Live validation**: Runs on `@input` and `@blur` events
- **Submit validation**: Final check before API call
- **Visual feedback**: Red border + error icon + message
- **Submit button**: Disabled until all fields valid

## 🚢 Deployment to GitHub Pages

### Method 1: Deploy entire repository

1. **Push to GitHub:**

   ```bash
   cd /Users/paulkamani/Documents/decadrive/frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/decadrive-frontend.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**

   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` / root
   - Save

3. **Update backend URL:**
   - In `app.js`, change `BACKEND_URL` to your production backend
   - Commit and push changes

### Method 2: Deploy via gh-pages branch (cleaner)

```bash
# Create orphan gh-pages branch
git checkout --orphan gh-pages
git reset --hard
git commit --allow-empty -m "Init gh-pages"
git push origin gh-pages

# Back to main
git checkout main

# Deploy
git subtree push --prefix . origin gh-pages
```

Your app will be available at: `https://yourusername.github.io/decadrive-frontend/`

## 🔧 Configuration

### Backend URL

Located in `app.js` (line 18):

```javascript
const BACKEND_URL = "http://localhost:3000";
```

Change this to your deployed backend URL before deploying to production.

### Theme Persistence

Theme preference is saved to `localStorage` with key `darkMode`.
To clear: `localStorage.removeItem('darkMode')`

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (full layout)
- **Tablet**: 481px - 768px (stacked sidebars)
- **Mobile**: ≤ 480px (single column, compact nav)

## ♿ Accessibility Features

- **Semantic HTML**: Proper use of `<nav>`, `<main>`, `<footer>`, headings
- **Keyboard Navigation**: All interactive elements focusable
- **Focus Indicators**: Visible focus states with outline
- **Alt Text**: Images have descriptive alt attributes
- **ARIA**: Icons marked as `aria-hidden` where decorative
- **Reduced Motion**: Respects `prefers-reduced-motion` media query

## 🐛 Troubleshooting

### Issue: Lessons not loading

- **Check**: Backend is running and accessible
- **Check**: `BACKEND_URL` in `app.js` is correct
- **Check**: CORS is enabled on backend
- **Solution**: Open browser console (F12) and check for errors

### Issue: Images not displaying

- **Check**: Backend is returning `image` field with valid Unsplash URLs
- **Check**: Network tab shows successful image requests
- **Solution**: Verify backend lesson schema includes `image` field

### Issue: Order not submitting

- **Check**: Form validation passes (name and phone valid)
- **Check**: Cart is not empty
- **Check**: Backend `/orders` endpoint is working
- **Solution**: Check browser console for error messages

### Issue: Theme not persisting

- **Check**: Browser supports localStorage
- **Check**: Not in private/incognito mode (may restrict localStorage)
- **Solution**: Try a different browser

## 📚 Code Documentation

All code includes extensive inline comments explaining:

- **Why** each function/method exists
- **How** search and sorting work
- **How** cart management works
- **How** checkout validation works
- **How** the order flow works

These comments are designed to help during demo presentations and code walkthroughs.

## 🎓 Technologies Used

- **Vue 2.7.16** - Progressive JavaScript framework (via CDN)
- **Material Icons** - Icon font for UI affordances (via Google Fonts CDN)
- **Fetch API** - Modern HTTP client (native browser API)
- **CSS Custom Properties** - For theming and design system
- **LocalStorage API** - For theme persistence

## 📄 License

This project is created for coursework/educational purposes.

## 👤 Author

Created for CST3144 Coursework - DecaDrive Project

---

## 💡 Tips for Demo

1. **Show the code**: Open `app.js` and point out commented sections
2. **Explain page switching**: Show `currentPage` variable and `v-if` in HTML
3. **Demonstrate API calls**: Open Network tab, show fetch requests
4. **Show validation**: Type invalid data and explain regex patterns
5. **Highlight responsiveness**: Resize browser window
6. **Theme toggle**: Switch themes and explain CSS custom properties
7. **Order flow**: Walk through entire process from browse to confirmation

## 🎯 Course Requirements Checklist

- ✅ Vue 2 only (not Vue 3)
- ✅ No template engines
- ✅ fetch() + Promises for all API calls (no axios)
- ✅ Works on GitHub Pages (static files)
- ✅ Plain HTML/CSS/JS
- ✅ Light/dark mode toggle
- ✅ DecaDrive logo and branded UI
- ✅ Font icons (Material Icons)
- ✅ Responsive and mobile-friendly
- ✅ Page switching with v-if
- ✅ All pages implemented (home, lessons, cart, checkout, success)
- ✅ Search-as-you-type
- ✅ Sorting functionality
- ✅ Cart management
- ✅ Form validation (name: letters+spaces, phone: digits)
- ✅ Order submission with space updates
- ✅ Comprehensive comments for demo
- ✅ Complete documentation

---

**Ready to demo! 🚗💨**
