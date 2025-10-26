# Right Fit Matcher - Frontend

A modern, beautiful Next.js frontend for the Right Fit Matcher university matching system.

## 🎨 Features

- **Modern UI Design**: Beautiful gradient-based interface
- **Interactive Forms**: Real-time validation with visual feedback
- **Results Display**: Comprehensive university match results with:
  - Probability scores
  - Compatibility ratings
  - Detailed breakdowns
  - Top match highlighting
- **Statistics Dashboard**: Real-time database statistics
- **Responsive Design**: Works seamlessly on all devices
- **Type-Safe**: Full TypeScript support

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with match form
│   ├── results/
│   │   └── page.tsx         # Results display page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── MatchForm.tsx         # Main matching form component
│   ├── ResultsDisplay.tsx    # Results grid with cards
│   └── StatsSection.tsx      # Database statistics
└── lib/
    └── api.ts                # API client and types
```

## 🎯 Components

### MatchForm

- Input validation with visual feedback
- Real-time progress indicators
- Beautiful gradient design
- Error handling

### ResultsDisplay

- Grid layout for university cards
- Top match highlighting
- Detailed probability breakdowns
- Score visualizations

### StatsSection

- Real-time database statistics
- Interactive cards
- Gradient icons

## 🔌 API Integration

The frontend connects to these backend endpoints:

- `GET /api/universities` - List universities
- `GET /api/universities/stats` - Get statistics
- `POST /api/match` - Find matching universities

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📱 Screenshots

The UI features:

- Clean, modern design with gradients
- Interactive form with real-time feedback
- Beautiful results cards with probability indicators
- Statistics dashboard
- Responsive layout

## 🎨 Design Features

- **Gradient Effects**: Modern color gradients throughout
- **Animations**: Smooth transitions and hover effects
- **Visual Feedback**: Progress bars and status indicators
- **Card-based Layout**: Easy-to-scan information
- **Color Coding**: Probability-based color schemes

## 🚀 Deployment

Build for production:

```bash
npm run build
npm start
```

## 📝 License

MIT
