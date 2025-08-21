# PitchCraft MVP

An AI-powered pitch generation and teleprompter tool that helps users create personalized professional introductions and practice delivering them with confidence.

## Features

- **AI Pitch Generation**: Generate personalized pitch scripts using OpenAI
- **Script Editor**: Edit and refine generated scripts
- **Teleprompter**: Practice delivery with adjustable scroll speed and font size
- **Video Recording**: Record yourself using WebRTC while using the teleprompter
- **Local Storage**: Automatically save your scripts

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Video**: WebRTC for browser-based recording

## Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

1. **Clone and setup**:
```bash
cd reslink
```

2. **Setup Backend**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your OpenAI API key
npm run dev
```

3. **Setup Frontend** (in a new terminal):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

**Backend (.env)**:
```
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**:
```
VITE_API_URL=http://localhost:3001/api
```

## Usage

1. **Create a Pitch**: Enter your professional description, select length and tone
2. **Edit Script**: Review and refine the AI-generated script
3. **Practice**: Use the teleprompter to practice delivery
4. **Record**: Record yourself while the teleprompter scrolls

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- WebRTC support required for video recording
- getUserMedia API support for camera/microphone access

## Development

```bash
# Backend
cd backend
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Run production build

# Frontend
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## API Endpoints

- `POST /api/pitch/generate` - Generate pitch script
- `GET /health` - Health check

## License

MIT