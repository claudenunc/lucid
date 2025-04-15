# Lucid Dreams Application Documentation

## Project Overview

The Lucid Dreams application is a full-stack web and mobile application designed to help users practice, track, and enhance their lucid dreaming experiences. The application provides tools for dream journaling, guided breathing exercises, audio-guided meditations, progress tracking, and more.

## Project Structure

```
lucid-project/
├── src/
│   ├── components/         # React components
│   │   ├── AudioPlayer.tsx
│   │   ├── AudioResourceLibrary.tsx
│   │   ├── AuthForm.tsx
│   │   ├── BreathingGuide.tsx
│   │   ├── DreamJournalEntry.tsx
│   │   ├── DreamJournalList.tsx
│   │   ├── LucidityScale.tsx
│   │   ├── MainLayout.tsx
│   │   ├── MobileNavigation.tsx
│   │   ├── PracticeSession.tsx
│   │   └── ProgressTracking.tsx
│   ├── lib/                # Utility functions and context
│   │   └── dream-context.tsx
│   ├── database/           # Database schema files
│   │   ├── 0001_dream_schema.sql
│   │   ├── 0001_initial.sql
│   │   └── 0002_users.sql
│   ├── test/               # Test files
│   │   ├── TestWrapper.tsx
│   │   ├── AuthForm.test.tsx
│   │   ├── AudioPlayer.test.tsx
│   │   ├── BreathingGuide.test.tsx
│   │   ├── DreamJournalList.test.tsx
│   │   └── dream-context.test.tsx
│   ├── styles/             # CSS and styling files
│   │   └── globals.css
│   ├── pages/              # Page components (to be implemented)
│   └── hooks/              # Custom React hooks (to be implemented)
├── public/                 # Static assets (to be added)
├── package.json            # Project dependencies
└── tailwind.config.js      # Tailwind CSS configuration
```

## Database Schema

The application uses a relational database with the following tables:

1. **users**: Stores user authentication information
   - id, username, email, password_hash, created_at, updated_at

2. **user_profiles**: Extends user information with profile details
   - user_id, display_name, bio, avatar_url, preferences

3. **dream_journals**: Stores user dream journal entries
   - id, user_id, title, content, dream_date, lucidity_level, created_at, updated_at

4. **dream_tags**: Stores tags for dream journal entries
   - id, dream_id, tag_name

5. **practice_sessions**: Records user practice sessions
   - id, user_id, protocol_type, protocol_name, duration_minutes, effectiveness_rating, notes, created_at

6. **progress_metrics**: Tracks user progress over time
   - id, user_id, date, lucid_dreams, practice_minutes, consistency_score

7. **audio_resources**: Stores information about guided meditation audio files
   - id, title, description, protocol_type, duration_seconds, file_path

## Implemented Features

### 1. Global State Management
- **Dream Context Provider**: Manages application-wide state including theme, audio settings, breathing rate, and user information.

### 2. User Authentication
- **AuthForm Component**: Provides login and registration functionality with form validation.

### 3. Layout and Navigation
- **MainLayout Component**: Provides the overall application structure with header, footer, and responsive design.
- **MobileNavigation Component**: Implements a mobile-friendly navigation menu.

### 4. Dream Journal
- **DreamJournalEntry Component**: Allows users to create and edit dream journal entries with fields for title, content, date, lucidity level, dream signs, techniques used, and tags.
- **DreamJournalList Component**: Displays a list of dream journal entries with filtering and sorting capabilities.
- **LucidityScale Component**: Provides a visual scale for measuring lucidity levels in dreams.

### 5. Practice Tools
- **BreathingGuide Component**: Provides guided breathing exercises with different modes (meditation, protocol, relaxation) and customizable patterns.
- **PracticeSession Component**: Allows users to track practice sessions for different lucid dreaming protocols.
- **AudioPlayer Component**: Plays guided meditation audio with playback controls.
- **AudioResourceLibrary Component**: Provides a library of audio resources for different lucid dreaming protocols.

### 6. Progress Tracking
- **ProgressTracking Component**: Visualizes user progress over time with charts and statistics.

## Testing

The application includes comprehensive test coverage for all major components:

- **AuthForm Tests**: Verify form rendering, validation, and submission.
- **DreamJournalList Tests**: Verify loading states, filtering, sorting, and entry selection.
- **BreathingGuide Tests**: Verify guide functionality, phase transitions, and completion.
- **AudioPlayer Tests**: Verify playback controls and event handling.
- **Dream Context Tests**: Verify context provider state management.

## Future Enhancements

1. **API Integration**: Connect frontend components to backend services.
2. **User Dashboard**: Create a personalized dashboard for users.
3. **Community Features**: Add social features like sharing dreams and techniques.
4. **Advanced Analytics**: Implement more detailed progress analytics and insights.
5. **Mobile App**: Develop a dedicated mobile application using React Native.
