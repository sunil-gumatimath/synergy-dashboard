# Aurora - Employee Management System 🌟

A modern, responsive Employee Management Dashboard built with React, Vite, and Tailwind CSS. Aurora provides an intuitive interface for managing employee data, viewing analytics, and navigating through administrative tasks with a beautiful, professional design.

## ✨ Features

### 📊 **Analytics Dashboard**
- Interactive charts and graphs for tracking employee growth
- Department distribution visualization with pie charts
- Weekly performance trends with bar charts
- Real-time statistics with staggered fade-in animations
- Quick insights cards with hover effects
- Fully responsive grid layouts

### 📅 **Calendar & Scheduling**
- Integrated calendar view for managing team events and meetings
- Interactive day cells with hover states
- Color-coded event categories (meetings, work, client, workshop)
- Event sidebar with detailed information
- Smooth animations and transitions
- Mobile-friendly with horizontal scrolling

### ⚙️ **Settings Management**
- Comprehensive profile management
- Email and push notification controls
- System preferences (theme, language, timezone)
- Security settings with password management
- Two-factor authentication toggle
- Form validation with error states
- Smooth tab navigation with glow effects

### 👥 **Employee Management**
- View and manage employee information
- Localized data support (Indian context with Hindu names)
- Employee cards with status badges
- Search and filter capabilities
- Responsive grid layout

### 🎨 **Design System**
- **Sharp & Premium UI**: Modern, high-end interface with a sharp design language (no rounded corners except for circles)
- **Consistent Styling**: All components use CSS custom properties for colors, spacing, and shadows
- **Smooth Animations**: Fade-in, slide, scale, and hover effects throughout
- **Responsive Design**: Fully responsive layout that works seamlessly on all devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### 🎯 **Navigation**
- Sidebar with smooth hover effects
- Brand logo with scale animation
- Active state indicators with primary color accent
- User profile section with avatar
- Logout functionality

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom CSS
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Package Manager**: [Bun](https://bun.sh/) (or npm/yarn)
- **Linting**: ESLint with React plugins

## 🎨 Design System

### **Color Palette**
- **Primary**: `#4f46e5` (Indigo 600)
- **Primary Hover**: `#4338ca` (Indigo 700)
- **Primary Light**: `#eef2ff` (Indigo 50)
- **Text Main**: `#111827` (Gray 900)
- **Text Muted**: `#6b7280` (Gray 500)
- **Border**: `#e5e7eb` (Gray 200)

### **Spacing System**
- `--space-xs`: 0.25rem
- `--space-sm`: 0.5rem
- `--space-md`: 1rem
- `--space-lg`: 1.5rem
- `--space-xl`: 2rem

### **Border Radius**
- `--radius-sm`: 0 (sharp corners)
- `--radius-md`: 0 (sharp corners)
- `--radius-lg`: 0 (sharp corners)
- `--radius-full`: 9999px (circles only)

### **Shadows**
- `--shadow-sm`: Subtle elevation
- `--shadow-md`: Medium elevation
- `--shadow-lg`: High elevation

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Bun](https://bun.sh/) (optional, but recommended for faster installs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunil-gumatimath/emp-management-vibecode.git
   cd aurora-emp-management
   ```

2. **Install dependencies**
   
   Using Bun (recommended):
   ```bash
   bun install
   ```
   
   Or using npm:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
bun run dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
bun run build
# or
npm run build
```

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

## 📜 Scripts

- `dev`: Starts the development server with hot module replacement
- `build`: Builds the application for production
- `preview`: Previews the production build locally
- `lint`: Runs ESLint to check for code quality issues

## 📂 Project Structure

```
aurora-emp-management/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx      # Navigation sidebar with hover effects
│   │   ├── Stats.jsx        # Statistics cards
│   │   ├── Card.jsx         # Reusable card component
│   │   ├── Button.jsx       # Button component with variants
│   │   └── Toast.jsx        # Toast notification component
│   │
│   ├── features/            # Feature-specific components
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   └── analytics-styles.css
│   │   ├── calendar/
│   │   │   ├── CalendarView.jsx
│   │   │   └── calendar-styles.css
│   │   ├── employees/
│   │   │   └── EmployeeList.jsx
│   │   └── settings/
│   │       ├── SettingsView.jsx
│   │       └── settings-styles.css
│   │
│   ├── data/                # Mock data and constants
│   │   └── employees.js     # Employee data with Indian names
│   │
│   ├── App.jsx              # Main application component
│   ├── index.css            # Global styles and design system
│   └── main.jsx             # Entry point
│
├── .agent/                  # Documentation and implementation guides
│   ├── settings-style-review.md
│   ├── settings-implementation-complete.md
│   ├── calendar-implementation-complete.md
│   ├── analytics-implementation-complete.md
│   ├── sidebar-implementation-complete.md
│   └── aurora-rebrand-complete.md
│
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── README.md                # This file
```

## 🎯 Key Features Breakdown

### **Analytics Dashboard**
- **Stat Cards**: Display key metrics with staggered fade-in animations (0s, 0.1s, 0.2s, 0.3s)
- **Employee Growth Chart**: Area chart showing employee count over time
- **Department Distribution**: Donut chart with color-coded departments
- **Weekly Performance**: Bar chart tracking daily performance
- **Quick Insights**: Interactive cards with hover lift effects

### **Calendar View**
- **Month Navigation**: Previous/Next month with "Today" quick action
- **Day Cells**: Interactive cells with hover states and event counts
- **Event Management**: Color-coded events with time and location
- **Sidebar Details**: Selected day events with detailed information
- **Responsive Grid**: Adapts to different screen sizes

### **Settings**
- **Profile Tab**: Name, email, and bio management with validation
- **Notifications Tab**: Toggle switches for email, push, and alert preferences
- **System Tab**: Theme, language, timezone, and data retention settings
- **Security Tab**: Password change and two-factor authentication
- **Form Validation**: Real-time error checking with visual feedback

### **Sidebar Navigation**
- **Brand Logo**: Hover scale effect with primary color
- **Nav Items**: Slide animation on hover with active state indicator
- **User Profile**: Avatar with scale effect and email display
- **Logout**: Quick access to sign out

## 🎨 Design Highlights

### **Animations**
- Staggered fade-in for stat cards
- Hover lift effects on cards and buttons
- Slide animations on navigation items
- Scale effects on logos and avatars
- Smooth transitions throughout (0.2s ease)

### **Consistency**
- All components use CSS custom properties
- Sharp corners (0px border-radius) for modern look
- Circles use full radius (9999px) for avatars and badges
- Consistent spacing using design system variables
- Unified color scheme across all features

### **Accessibility**
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states with visible outlines
- Screen reader friendly
- Semantic HTML structure

## 🚀 Performance

- **Code Splitting**: Lazy loading for Analytics and Calendar
- **Optimized Builds**: Vite's fast build system
- **CSS Optimization**: Tailwind CSS purging unused styles
- **Component Reusability**: Shared components reduce bundle size
- **Efficient Rendering**: React 19's latest optimizations

## 📱 Responsive Design

- **Mobile**: Single column layouts, touch-friendly controls
- **Tablet**: 2-column grids, optimized spacing
- **Desktop**: Full multi-column layouts, enhanced interactions
- **Breakpoints**: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

## 🔧 Customization

### **Changing Colors**
Edit `src/index.css` to modify the color palette:
```css
:root {
  --primary: #4f46e5;        /* Change primary color */
  --primary-hover: #4338ca;  /* Change hover state */
  --primary-light: #eef2ff;  /* Change light variant */
}
```

### **Adding New Features**
1. Create feature folder in `src/features/`
2. Add component and styles
3. Import in `App.jsx`
4. Add navigation item in `Sidebar.jsx`

### **Modifying Spacing**
Adjust spacing variables in `src/index.css`:
```css
:root {
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
}
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Sunil Kumar**
- Email: sunil.kumar@aurora.app
- GitHub: [@sunil-gumatimath](https://github.com/sunil-gumatimath)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the blazing fast build tool
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful chart components
- Lucide for the icon library
- date-fns for date manipulation

---

**Aurora** - Where employee management meets excellence! 🌟

Built with ❤️ using React, Vite, and Tailwind CSS
