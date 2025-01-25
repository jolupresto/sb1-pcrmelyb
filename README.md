# Boardly - A Modern Kanban Board Application bbbbbb

A full-featured Kanban board application built with React, TypeScript, and Supabase, featuring real-time updates, drag-and-drop functionality, and collaborative features.

## Mobile Development

The project now includes iOS mobile support using NativeScript. The mobile version maintains feature parity with the web version while providing a native iOS experience.

### iOS-Specific Files

- `App_Resources/iOS/`
  - `Info.plist` - iOS application configuration
  - `build.xcconfig` - Xcode build settings
  - `LaunchScreen.storyboard` - Launch screen design

### Mobile Configuration

- `nativescript.config.ts` - NativeScript configuration
- `webpack.config.js` - Mobile build configuration
- `src/app.css` - Mobile-specific styles
- `src/app.ts` - Mobile entry point
- `src/AppContainer.tsx` - Mobile app container

## Project Structure

### Core Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Root component handling authentication and board initialization
- `src/index.css` - Global styles and Tailwind CSS imports

### Components

#### Authentication
- `src/components/Auth.tsx` - Main authentication component
- `src/components/auth/`
  - `SignInForm.tsx` - Email/password sign in
  - `SignUpForm.tsx` - New user registration
  - `ForgotPasswordForm.tsx` - Password reset flow
  - `GoogleButton.tsx` - Google OAuth integration
  - `Divider.tsx` - Auth form divider component

#### Board
- `src/components/Board.tsx` - Main board component with drag-and-drop
- `src/components/Column.tsx` - Board column component
- `src/components/Task.tsx` - Task card component
- `src/components/board/`
  - `AddColumnButton.tsx` - New column creation
  - `ArchivedTasks.tsx` - Archive management
  - `BoardTemplates.tsx` - Pre-defined board templates
  - `BoardShare.tsx` - Collaboration features
  - `TaskSearch.tsx` - Task search functionality
  - `UserSearch.tsx` - User search for sharing

#### Task Features
- `src/components/task/`
  - `TaskModal.tsx` - Task details modal
  - `TaskLabels.tsx` - Label management
  - `TaskDueDate.tsx` - Due date handling
  - `TaskPriority.tsx` - Priority management
  - `TaskChecklists.tsx` - Checklist functionality
  - `TaskComments.tsx` - Comment system
  - `TaskAttachments.tsx` - File attachment handling

### State Management
- `src/store/useBoardStore.ts` - Global state management using Zustand

### Services
- `src/services/`
  - `attachmentService.ts` - File upload/management
  - `boardService.ts` - Board CRUD operations
  - `checklistService.ts` - Checklist operations
  - `columnService.ts` - Column management
  - `commentService.ts` - Comment functionality
  - `labelService.ts` - Label management
  - `taskService.ts` - Task CRUD operations

### Database
- `supabase/migrations/` - Database schema and policy definitions
  - Tables: boards, columns, tasks, labels, checklists, comments, attachments
  - Row Level Security (RLS) policies
  - Indexes for performance optimization

### Types
- `src/types/`
  - `auth.ts` - Authentication types
  - `board.ts` - Board, column, and task interfaces

### Configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## Features

1. Authentication
   - Email/password authentication
   - Google OAuth integration
   - Password reset functionality

2. Board Management
   - Create/edit/delete boards
   - Drag-and-drop columns and tasks
   - Board templates
   - Custom backgrounds

3. Task Management
   - Rich text descriptions
   - Labels and priorities
   - Due dates
   - Checklists
   - Comments
   - File attachments
   - Task archiving

4. Collaboration
   - Board sharing
   - User search
   - Member management
   - Real-time updates

5. Search & Organization
   - Task search
   - Label filtering
   - Archive management

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Mobile**: NativeScript
- **Authentication**: Supabase Auth
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Build Tool**: Vite

## Mobile Development Setup

1. Install NativeScript CLI:
   ```bash
   npm install -g @nativescript/cli
   ```

2. Install iOS development dependencies:
   - Xcode (from Mac App Store)
   - Xcode Command Line Tools
   - iOS Simulator

3. Run the mobile app:
   ```bash
   ns run ios
   ```

4. For development:
   ```bash
   ns debug ios
   ```

## Security

The application implements comprehensive security measures:
- Row Level Security (RLS) policies for data access control
- Secure authentication flows
- Protected API endpoints
- Sanitized user inputs
- Secure file uploads

## Performance

Performance optimizations include:
- Optimized database indexes
- Efficient state management
- Lazy loading of components
- Debounced search operations
- Optimized drag-and-drop operations