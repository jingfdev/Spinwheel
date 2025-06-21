# 🎯 Spin Wheel Application

An interactive, customizable spin wheel application built with React, TypeScript, and Express. Create your own fortune wheel with custom segments, smooth animations, and real-time management.

![Spin Wheel App](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Express](https://img.shields.io/badge/Express-4+-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-purple.svg)

## ✨ Features

### 🎨 Interactive Wheel
- **Smooth Animations**: Beautiful spinning animations with easing curves
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Visual Effects**: Pulse rings, gradient backgrounds, and animated elements
- **Sound Controls**: Toggle sound effects for spins and wins

### ⚙️ Customization
- **Dynamic Segments**: Add, remove, and manage wheel segments in real-time
- **Random Colors**: Auto-generated gradient colors for each segment
- **Flexible Size**: Supports 2-12 segments with automatic layout adjustment
- **Reset Functionality**: Clear all segments and start fresh

### 📊 Statistics
- **Spin Counter**: Track total number of spins
- **Segment Count**: Monitor current number of segments
- **Session Management**: Persistent session data across page reloads

### 🎯 Winner Selection
- **Fair Algorithm**: Mathematically accurate winner calculation
- **Visual Feedback**: Clear winner display with animations
- **Result Persistence**: Winner results displayed until next spin

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd spin-wheel-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Shadcn/ui components
│   │   │   ├── SpinWheel.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   └── WheelSegment.tsx
│   │   ├── pages/          # Application pages
│   │   │   ├── spin-wheel.tsx
│   │   │   └── not-found.tsx
│   │   ├── lib/            # Utilities and configurations
│   │   │   ├── queryClient.ts
│   │   │   ├── utils.ts
│   │   │   └── wheelUtils.ts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # In-memory data storage
│   └── vite.ts             # Vite development server setup
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Database schema and types
└── package.json            # Project dependencies and scripts
```

## 🔧 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with full IntelliSense
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Data fetching and state management
- **Shadcn/ui**: Beautiful, accessible UI components

### Backend
- **Express.js**: Fast, minimalist web framework
- **TypeScript**: Server-side type safety
- **Zod**: Runtime type validation and parsing
- **In-Memory Storage**: Simple data persistence (easily replaceable with database)

### Development Tools
- **ESBuild**: Fast TypeScript compilation
- **PostCSS**: CSS processing and optimization
- **Drizzle ORM**: Type-safe database schema definition

## 📚 API Reference

### Segments Endpoints

#### Get All Segments
```http
GET /api/segments
```
Returns array of wheel segments with id, label, color, and order.

#### Create Segment
```http
POST /api/segments
Content-Type: application/json

{
  "label": "Prize Name",
  "color": "from-blue-500 to-blue-600",
  "order": 0
}
```

#### Delete Segment
```http
DELETE /api/segments/:id
```

#### Reset All Segments
```http
DELETE /api/segments
```

### Session Endpoints

#### Get Session
```http
GET /api/session
```
Returns current session with totalSpins and soundEnabled status.

#### Update Session
```http
PATCH /api/session
Content-Type: application/json

{
  "soundEnabled": true
}
```

#### Increment Spin Count
```http
POST /api/session/spin
```

## 🎮 Usage Guide

### Adding Segments
1. Type segment name in the "Add New Segment" input field
2. Press Enter or click the + button
3. Segment automatically gets a random color and is added to the wheel

### Spinning the Wheel
1. Click the "SPIN!" button to start the wheel
2. Watch the smooth 4-second animation
3. Winner is displayed with celebration effects
4. Spin counter automatically increments

### Managing Segments
- **Remove**: Hover over a segment in the list and click the trash icon
- **Reset**: Click "Reset Wheel" to remove all segments
- **Randomize Colors**: Click "Randomize Colors" to shuffle segment colors
- **Minimum**: At least 2 segments required to spin
- **Maximum**: Up to 12 segments supported

### Sound Controls
- Toggle sound effects on/off using the checkbox below the wheel
- Separate sounds for spinning and winning

## 🎨 Customization

### Adding New Colors
Edit `client/src/lib/wheelUtils.ts` to add new gradient combinations:

```typescript
const colorGradients = [
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  // Add your custom gradients here
  'from-emerald-500 to-emerald-600',
];
```

### Modifying Animation Duration
Adjust spin duration in `client/src/components/SpinWheel.tsx`:

```typescript
// Change the timeout duration (currently 4000ms)
setTimeout(() => {
  // Winner calculation logic
}, 4000);
```

### Styling Modifications
The app uses Tailwind CSS. Modify styles in component files or extend the theme in `tailwind.config.ts`.

## 🔄 Data Flow

1. **Initial Load**: App fetches segments and session data from API
2. **User Interaction**: Adding/removing segments triggers API calls
3. **State Management**: TanStack Query handles caching and synchronization
4. **Spin Action**: Wheel rotation calculated client-side, results sent to API
5. **Real-time Updates**: UI automatically updates when data changes

## 🚦 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Database operations (if using real database)
npm run db:generate
npm run db:migrate
```

### Development Workflow

1. **Frontend Changes**: Edit files in `client/src/`, auto-reload enabled
2. **Backend Changes**: Edit files in `server/`, server auto-restarts
3. **Shared Types**: Modify `shared/schema.ts` for data model changes
4. **Styling**: Use Tailwind classes or modify `client/src/index.css`

## 🔒 Data Storage

Currently uses in-memory storage for simplicity. To persist data across server restarts:

1. **Database Integration**: Replace `MemStorage` with database implementation
2. **Supported Databases**: PostgreSQL (via Drizzle ORM configuration)
3. **Schema Migration**: Use `drizzle-kit` for database migrations

## 🌟 Future Enhancements

### Potential Features
- **User Accounts**: Save multiple wheels per user
- **Wheel Templates**: Pre-built wheel configurations
- **Export/Import**: Save and share wheel configurations
- **Advanced Animations**: More spin effects and winner celebrations
- **Sound Library**: Multiple sound effect options
- **Wheel Themes**: Different visual styles and themes
- **History**: Track spin results and statistics
- **Multiplayer**: Real-time collaborative wheels

### Performance Optimizations
- **Image Optimization**: Lazy loading for assets
- **Code Splitting**: Route-based code splitting
- **PWA Support**: Offline functionality
- **Database**: Production database integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support, please:
1. Check the [Issues](../../issues) section
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

**Made with ❤️ for spinning wheels everywhere**