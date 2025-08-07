# Dopamax

A minimal Next.js portal for the Dopamax productivity app.

## Features

- **Home Page (`/`)**: Welcome page with links to support and privacy pages
- **Support Page (`/support`)**: Contact information with clickable email link
- **Privacy Policy Page (`/privacy`)**: Comprehensive privacy policy for the Dopamax app
- **Analytics**: Vercel Analytics integration for page view tracking

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DopamaxAdmin
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Analytics will automatically start collecting page views once deployed.

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

```
DopamaxAdmin/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── support/
│   │   └── page.tsx    # Support page
│   ├── privacy/
│   │   └── page.tsx    # Privacy policy page
│   └── globals.css     # Global styles
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## About Dopamax

Dopamax is a productivity app that turns task completion into a dopamine-boosting experience. It's designed to make productivity addictive by gamifying the process of completing tasks.

### Key Features:
- Task management with visual progress tracking
- Dopamine molecule icon representing the reward system
- Local SQLite database for privacy
- Clean, minimal UI focused on task management

## Contact

For support or privacy questions: aprameyakannan@gmail.com
