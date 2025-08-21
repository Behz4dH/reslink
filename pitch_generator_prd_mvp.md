# PitchCraft MVP - Product Requirements Document

## Executive Summary
PitchCraft MVP is a web-based AI-powered pitch generation and teleprompter tool that helps users create personalized professional introductions and practice delivering them with confidence.

## Problem Statement
Professionals struggle to create compelling, personalized pitch scripts for video introductions, networking, and job applications. They often sound rehearsed, forget key points, or lack confidence when speaking on camera.

## Solution Overview
A streamlined web application that generates personalized pitch scripts using AI and provides a teleprompter interface for practicing delivery.

## MVP Feature Scope

### Core Features

#### 1. Pitch Input Form
- **Description**: Single field form for users to input their professional context
- **Fields**:
  - **Pitch Description** (required, large text area): Single field where users describe themselves, their role, experience, goals, and any specific context for the pitch
  - **Pitch Length** (optional, dropdown): 30 seconds, 60 seconds, 90 seconds (default: 60 seconds)
  - **Tone** (optional, dropdown): Professional, Casual, Enthusiastic (default: Professional)
- **Placeholder Example**: "I'm Sarah Chen, a Senior Marketing Manager with 8 years of experience in B2B SaaS companies. I specialize in growth marketing and have increased user acquisition by 150% at my current company. I'm looking to connect with other marketing leaders at this networking event."

#### 2. AI Pitch Generation
- **Description**: Generate personalized 30-60 second pitch scripts
- **Functionality**:
  - Process user input through AI model
  - Generate 1-2 paragraph professional introduction
  - Include: personal introduction, experience highlight, key strength, value proposition
- **Output**: Clean, conversational script optimized for video delivery

#### 3. Basic Script Editing
- **Description**: Simple editing capabilities for generated scripts
- **Features**:
  - Editable text area with generated script
  - Character/word count display
  - Save/reset functionality
  - Basic formatting (paragraphs)

#### 4. Teleprompter Interface
- **Description**: Display script in teleprompter format for practice
- **Features**:
  - Full-screen teleprompter mode
  - Adjustable font size (3 levels: Small, Medium, Large)
  - Adjustable scroll speed (5 levels: Very Slow to Very Fast)
  - Start/pause/reset controls
  - Exit to editor button

#### 5. Video Recording
- **Description**: Record video while using teleprompter
- **Features**:
  - WebRTC-based browser recording
  - Camera and microphone access
  - Record while teleprompter is running
  - Basic recording controls (start/stop/pause)
  - Automatic download to local folder
  - Support for common video formats (WebM, MP4)
  - Recording quality settings (720p, 1080p)
  - Visual recording indicators

### Technical Requirements

#### Performance
- Page load time < 2 seconds
- AI generation response time < 10 seconds
- Smooth scrolling in teleprompter mode
- Video recording at 30fps minimum
- Support for 720p and 1080p recording

#### Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- WebRTC support required for video recording
- getUserMedia API support for camera/microphone access
- Mobile responsive design (recording may be limited on mobile)

#### Data Storage
- Local storage for temporary script saving
- No user accounts required for MVP

### User Flow
1. User lands on homepage
2. User writes their pitch description in single text area (with helpful placeholder example)
3. User optionally selects pitch length and tone
4. User clicks "Generate Pitch"
5. AI generates script (loading indicator shown)
6. User reviews generated script in editor
7. User can edit script manually
8. User clicks "Practice with Teleprompter"
9. Teleprompter opens with adjustable settings
10. User can practice delivery OR start recording
11. **Recording Flow:**
    - User clicks "Start Recording" 
    - Browser requests camera/microphone permissions
    - User sees video preview with teleprompter overlay
    - User records while teleprompter scrolls
    - User stops recording
    - Video automatically downloads to local folder
12. User can return to editor or start over

### Success Metrics
- Time from input to generated script < 10 seconds
- User completes full flow (input → generate → teleprompter) > 60%
- Script character count between 200-400 characters (30-60 second delivery)
- Video recording completion rate > 70%
- Recording quality meets minimum standards (clear audio/video)

### Out of Scope for MVP
- User accounts/authentication
- Cloud video storage/sharing
- Advanced video editing features
- Multiple script versions
- Advanced editing features
- Analytics/tracking
- Payment processing
- Video upload to external platforms

### Future Considerations
- Cloud video storage and sharing
- Advanced video editing and post-processing
- User account system
- Script library/history
- Social sharing features
- Mobile app versions
- Real-time collaboration

---

## Technical Architecture - MVP

### Frontend Architecture

#### Technology Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify

#### Component Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── TextArea.tsx
│   │   ├── Select.tsx
│   │   └── LoadingSpinner.tsx
│   ├── PitchForm/
│   │   ├── PitchForm.tsx
│   │   └── PitchFormTypes.ts
│   ├── ScriptEditor/
│   │   ├── ScriptEditor.tsx
│   │   └── ScriptEditorTypes.ts
│   ├── Teleprompter/
│   │   ├── Teleprompter.tsx
│   │   ├── TeleprompterControls.tsx
│   │   └── TeleprompterTypes.ts
│   ├── VideoRecording/
│   │   ├── VideoRecorder.tsx
│   │   ├── CameraPreview.tsx
│   │   ├── RecordingControls.tsx
│   │   └── VideoRecordingTypes.ts
│   └── Layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── usePitchGeneration.ts
│   ├── useTeleprompter.ts
│   ├── useVideoRecording.ts
│   └── useMediaDevices.ts
├── services/
│   ├── api.ts
│   ├── aiService.ts
│   ├── mediaService.ts
│   └── downloadService.ts
├── contexts/
│   └── AppContext.tsx
├── types/
│   └── index.ts
├── utils/
│   └── constants.ts
└── App.tsx
```

### Backend Architecture

#### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **Deployment**: Railway/Render
- **Environment**: Docker containerized

#### API Structure
```
src/
├── controllers/
│   └── pitchController.ts
├── services/
│   └── aiService.ts
├── middleware/
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── types/
│   └── index.ts
├── utils/
│   └── constants.ts
└── server.ts
```

#### API Endpoints
```
POST /api/pitch/generate
Request:
{
  "description": "string", // User's full pitch description
  "length": 30 | 60 | 90,  // Optional: target length in seconds
  "tone": "professional" | "casual" | "enthusiastic" // Optional: desired tone
}

Response:
{
  "success": true,
  "data": {
    "script": "string",
    "wordCount": "number",
    "estimatedDuration": "number"
  }
}
```

### Data Models

#### TypeScript Interfaces
```typescript
interface PitchInput {
  description: string;
  length?: 30 | 60 | 90; // seconds
  tone?: 'professional' | 'casual' | 'enthusiastic';
}

interface GeneratedPitch {
  script: string;
  wordCount: number;
  estimatedDuration: number;
  createdAt: Date;
}

interface TeleprompterSettings {
  fontSize: 'small' | 'medium' | 'large';
  scrollSpeed: 1 | 2 | 3 | 4 | 5;
  isPlaying: boolean;
  currentPosition: number;
}

interface VideoRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordedBlob: Blob | null;
  duration: number;
  error: string | null;
}

interface MediaConstraints {
  video: {
    width: { ideal: number };
    height: { ideal: number };
    frameRate: { ideal: number };
  };
  audio: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
  };
}
```

### Security & Performance

#### Rate Limiting
- 10 requests per minute per IP
- 100 requests per hour per IP

#### Input Validation
- Sanitize all user inputs
- Limit text field lengths
- Validate enum values

#### Error Handling
- Graceful AI service failures
- User-friendly error messages
- Retry mechanisms for transient failures

### Development Setup

#### Environment Variables
```
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key
PORT=3001
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# Video Recording Settings
MAX_RECORDING_DURATION=300000  # 5 minutes in milliseconds
SUPPORTED_VIDEO_FORMATS=webm,mp4
DEFAULT_VIDEO_QUALITY=720p
```

#### Scripts
- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm run test` - Run test suites
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Deployment Strategy
- Frontend: Static site deployment (Vercel/Netlify)
- Backend: Container deployment (Railway/Render)
- Environment-specific configurations
- Automated CI/CD pipeline with GitHub Actions

### Monitoring & Analytics
- Error tracking with Sentry
- Basic usage analytics (page views, API calls)
- Performance monitoring (response times, error rates)
- Video recording success/failure rates
- Browser compatibility tracking for WebRTC features