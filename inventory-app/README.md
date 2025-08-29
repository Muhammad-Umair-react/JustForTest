# Family Task Management System

A comprehensive React.js application designed to manage family tasks, medical records, appointments, daily schedules, and financial tracking. Built with modern web technologies and optimized for family collaboration.

## Features

- 👥 **Family Management** - Manage all family members with roles and responsibilities
- 🏥 **Medical Records** - Store and track health reports, appointments, and medications
- 📅 **Appointments** - Schedule and manage medical appointments with calendar view
- ⏰ **Daily Schedule** - Assign and track daily tasks with priority management
- 💰 **Financial Tracker** - Track income, expenses, and shared costs among family
- 📊 **Dashboard** - Comprehensive overview of family activities and statistics
- 🔒 **Role-based Access** - Different permissions for different family members
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 + Vite
- **UI Library**: Ant Design
- **State Management**: TanStack React Query
- **HTTP Client**: Axios
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Ant Design + Custom CSS

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Top navigation header
│   │   ├── Sidebar.jsx         # Left sidebar navigation
│   │   └── MainLayout.jsx      # Main layout wrapper
│   └── inventory/              # Inventory-specific components
├── pages/
│   ├── Dashboard.jsx           # Main dashboard page
│   └── Products.jsx            # Product management page
├── hooks/                      # Custom React hooks
├── utils/
│   ├── firebase.js            # Firebase configuration
│   └── api.js                 # Axios configuration
├── App.jsx                    # Main app component
└── main.jsx                   # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore and Authentication
   - Copy your Firebase config and update `src/utils/firebase.js`

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Dashboard
- Real-time inventory statistics
- Recent orders table
- Low stock alerts
- Quick action buttons

### Sidebar Navigation
- Collapsible sidebar with icons
- Organized menu structure
- Responsive design
- Easy navigation between sections

### Product Management
- Add new products
- Edit existing products
- Delete products with confirmation
- Search and filter functionality
- Stock status indicators

### Layout Features
- **Header**: User profile, notifications, settings
- **Sidebar**: Collapsible navigation menu
- **Responsive**: Works on all screen sizes
- **Theme**: Customizable Ant Design theme

## Customization

### Theme Configuration
Update the theme in `src/main.jsx`:
```javascript
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
  },
};
```

### Adding New Pages
1. Create component in `src/pages/`
2. Add route to sidebar menu in `src/components/layout/Sidebar.jsx`
3. Import and use in your routing system

## API Integration

The project is set up to work with a REST API. Update the base URL in `src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  // ... other config
});
```

## Firebase Setup

1. **Firestore Collections**:
   - `products` - Product information
   - `orders` - Order data
   - `users` - User profiles
   - `categories` - Product categories

2. **Authentication**:
   - Enable Email/Password authentication
   - Configure authorized domains

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] Add more chart types to dashboard
- [ ] Implement real-time notifications
- [ ] Add data export functionality
- [ ] Implement barcode scanning
- [ ] Add multi-language support
- [ ] Create mobile app version
