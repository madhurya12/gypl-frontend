# Frontend - Grand Yoga Premier League 2026

React + Vite + Tailwind CSS frontend application for yoga competition event management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will be available at `http://localhost:5173`

## 📦 Dependencies

- **react**: UI library
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API calls
- **react-hot-toast**: Toast notifications

## 🎨 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Top navigation bar
│   └── Footer.jsx      # Footer with links
├── pages/
│   ├── Home.jsx        # Home page with event details
│   ├── Registration.jsx # Registration form
│   └── Admin.jsx       # Admin dashboard
├── services/
│   └── api.js          # Axios API client
├── App.jsx             # Main app component
├── main.jsx            # Entry point
├── index.css           # Global styles + Tailwind
└── App.css             # App-specific styles
```

## 🔌 API Service

The `services/api.js` file exports an API client with methods:

```javascript
import { participantAPI } from '../services/api'

// Register a participant
participantAPI.register(data)

// Get all participants
participantAPI.getAll()

// Get statistics
participantAPI.getStats()

// Filter by category
participantAPI.getByCategory(category)
```

## 🎯 Pages

### Home Page (`/`)
- Event banner and highlights
- Live statistics (using data from backend)
- Category details (Faceoff League & Talent Showcase)
- Benefits and instructor rewards
- Call-to-action buttons

### Registration Page (`/register`)
- Form with 8 fields
- Real-time validation
- Loading spinner on submit
- Success/error notifications
- Auto-redirect on success

### Admin Page (`/admin`)
- Password-protected (admin123)
- Participant list with filters
- Search functionality
- CSV export feature
- Real-time statistics

## 🎨 Styling

Using **Tailwind CSS** with custom configuration:

```javascript
// Tailwind config includes:
- Custom yoga color palette (green shades)
- Primary button styles (.btn-primary)
- Secondary button styles (.btn-secondary)
- Loading spinner animation
- Fade-in animation
```

## 🔄 State Management

Using React hooks:
- `useState` for local state
- `useEffect` for side effects
- `useNavigate` for routing

## 🚨 Error Handling

All API calls are wrapped with:
- Try-catch blocks
- Toast error notifications
- User-friendly error messages
- Console logging for debugging

## 📱 Responsive Design

Breakpoints:
- **Mobile**: 320px and up
- **Tablet**: 768px and up  
- **Desktop**: 1024px and up

All pages use Tailwind Grid and Flexbox for responsive layouts.

## 🔐 Form Validation

Registration form validates:
- Name: Required, max 100 chars
- Age: Required, 5-100 range
- Gender: Required, select from list
- Category: Required, select from list
- Instructor: Required, max 100 chars
- Phone: Required, exactly 10 digits
- Email: Required, valid email format
- Address: Required, max 300 chars

## 🎁 Special Features

### Loading Spinner
Shows during form submission with custom CSS animation

### Toast Notifications
- Success messages (green)
- Error messages (red)
- Positioned top-right on screen
- Auto-dismiss after 3-4 seconds

### CSV Export
Admin can export selected/filtered participants as CSV with:
- Header row with column names
- Proper CSV formatting with quotes
- Timestamped filename
- Client-side processing (no server download)

## 🔧 Configuration

Edit in `vite.config.js`:
```javascript
// Change dev server port
server: { port: 5173 }

// Change backend API proxy
proxy: { '/api': { target: 'http://localhost:5000' } }
```

## 📝 Environment

No environment variables needed for frontend in development.
Adjust API URL in `services/api.js` if backend runs on different port.

## 🐛 Common Issues

**Cannot reach backend**: Check that backend is running on port 5000

**Tailwind styles not showing**: Run `npm install` again and restart dev server

**Hot reload not working**: Clear browser cache or restart dev server

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

---

Happy coding! 🚀
