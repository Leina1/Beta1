# Next.js Project - Standard React Structure

## 📁 Project Structure

```
src/
├── pages/              # Next.js Pages Router
│   ├── _app.js        # App wrapper
│   ├── index.js       # Home page
│   ├── about.js       # About page
│   └── contact.js     # Contact page
├── components/         # React Components
│   ├── Header.js      # Header component
│   ├── Footer.js      # Footer component
│   ├── ContactForm.js # Contact form component
│   ├── layout/        # Layout components
│   └── ui/            # UI components
├── hooks/             # Custom React Hooks
│   ├── useContact.js  # Contact form logic
│   ├── useContactForm.js
│   └── useLocalStorage.js
├── api/               # API Utilities
│   ├── contact.js     # Contact API functions
│   └── services/      # API services
├── lib/               # Shared Libraries
│   ├── api.js         # Base API utilities
│   └── constants.js   # Shared constants
├── utils/             # Utility Functions
│   ├── validation.js  # Validation helpers
│   ├── helpers.js     # General helpers
│   └── fetchData.js   # Data fetching
├── styles/            # CSS Modules & Global Styles
│   ├── globals.css    # Global styles
│   ├── Home.module.css
│   ├── Contact.module.css
│   └── Header.module.css
├── context/           # React Context
├── models/            # Data Models
└── views/             # Legacy views (to be cleaned)
```

## ✅ Standard React Patterns Applied

### 1. **Custom Hooks Pattern**
- `useContact.js` - Manages contact form state and logic
- Clean separation of logic from UI components
- Reusable across different components

### 2. **Component Structure**
- **Functional components** with hooks
- **Props interface** for clean data flow
- **CSS Modules** for scoped styling

### 3. **API Layer**
- `lib/api.js` - Base HTTP utilities
- `api/contact.js` - Specific API functions
- Clean separation of API concerns

### 4. **Shared Utilities**
- `lib/constants.js` - Centralized constants
- `utils/validation.js` - Reusable validation
- Standard error handling patterns

### 5. **Modern JavaScript**
- ES6+ features
- Async/await patterns
- Clean import/export structure

## 🚀 How to Use

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Visit the application:**
   - Home: http://localhost:3000
   - About: http://localhost:3000/about
   - Contact: http://localhost:3000/contact

## 🔧 Key Features

- ✅ Next.js 15 with Pages Router
- ✅ JavaScript ES6+ (no TypeScript)
- ✅ Tailwind CSS with CSS Modules
- ✅ Standard React hooks pattern
- ✅ Clean component architecture
- ✅ Shared utilities and constants
- ✅ Form validation and error handling
- ✅ Responsive design

## 📝 Code Examples

### Custom Hook Usage:
```javascript
// In component
const { formData, isLoading, errors, handleSubmit } = useContact();
```

### API Calls:
```javascript
// Using shared API utilities
import { post } from '../lib/api';
await post('/api/contact', formData);
```

### Validation:
```javascript
// Using shared constants
import { VALIDATION_MESSAGES } from '../lib/constants';
```

This structure follows **standard React/Next.js conventions** and is easily maintainable and scalable.
