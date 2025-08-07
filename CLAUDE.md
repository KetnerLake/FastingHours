# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Start development server with hot reload
- **Build**: `npm run build` - Create production build using Vite
- **Preview**: `npm run preview` - Preview production build locally
- **Prepare**: `npm run prepare` - Sync SvelteKit (used for setup)

## Architecture Overview

This is a **fasting tracker application** built with SvelteKit 5 and modern web technologies:

### Core Technology Stack
- **Framework**: SvelteKit 5 with Vite
- **Database**: Dexie (IndexedDB wrapper) for local storage
- **UI**: Custom Svelte components with vanilla CSS
- **Icons**: Iconify for iconography
- **Location**: SunCalc library for sunrise/sunset calculations
- **Fonts**: Roboto Variable font

### Application Structure

**Single Page Application**: The entire app is contained in `src/routes/+page.svelte` with a collection of reusable components in `src/lib/`.

**Database Layer**: `src/lib/Database.svelte.js` provides a Dexie-based abstraction with three main data stores:
- `history` - Fasting session records (start/end times)
- `hunger` - Hunger level entries (1-10 scale)
- `water` - Water intake tracking

**State Management**: Uses Svelte 5's runes (`$state`) for reactive state management. All application state is managed in the main page component and passed down to child components.

### Key Components
- `FastingView.svelte` - Main fasting interface with timer and controls
- `HoursView.svelte` - Historical data visualization and timeline
- `ActivityGraph.svelte` - Activity pattern visualization
- `HistoryEditor.svelte`, `HungerEditor.svelte`, `WaterEditor.svelte` - Modal editors for data entry
- `Settings.svelte` - Application settings modal
- `Calendar.svelte`, `Clock.svelte`, `Timer.svelte` - Time-related UI components

### Data Flow Pattern
1. Main page component loads initial data from Database on mount
2. User actions trigger event handlers that update database
3. After database operations, reload functions refresh reactive state
4. State changes automatically update all dependent components

### Location Features
The app requests geolocation permission once to calculate sunrise/sunset times using SunCalc, important for religious fasting observations. Location data is stored in localStorage.

### Responsive Design
The app uses a split-screen layout on desktop (fasting view + history) and switches to tabbed interface on mobile screens (<780px width).

## Development Notes

- Uses SvelteKit's static adapter configured for SPA mode with fallback routing
- All data is stored locally using IndexedDB (no server required)
- Component naming follows PascalCase convention
- Database operations return promises and use async/await pattern
- State updates trigger automatic re-rendering via Svelte's reactivity system