# HUNTIQ V3 - BIONIC Hunting Platform

## Project Overview
HUNTIQ V3 is a professional hunting intelligence platform following the "BIONIC TACTICAL" design standard. The application provides scientific analysis of attractants, territory mapping, weather integration, and collaborative features for hunters.

## Core Requirements
- **Design System:** Strict BIONIC TACTICAL design - professional, scientific aesthetic
- **No Emojis:** All UI elements must use lucide-react icons or professional images
- **Species Display:** Use real wildlife photos via SpeciesIcon component
- **Workflow:** "Supra-sécuritaire" - explicit validation required for all tasks

## What's Been Implemented

### Date: 2025-02-12 - Phase 6 (Session Heatmap) COMPLETE

**Phase 6 Status:** COMPLETE - Awaiting validation

**Implementation:**
- Created `SessionHeatmap.jsx` component in `/app/frontend/src/modules/groupe/components/`
- Displays GPS position density of group members during active session
- Read-only visualization layer using existing `HeatmapLayer.jsx`
- Integrated as overlay on GROUPE map in `MonTerritoireBionicPage.jsx`
- Uses `useGroupeTracking` hook for live GPS data
- BIONIC color gradient: blue (sparse) → gold (good) → red (hotspot)

**Files Modified:**
- `/app/frontend/src/modules/groupe/components/SessionHeatmap.jsx` (NEW)
- `/app/frontend/src/modules/groupe/index.js` (updated exports, version 1.5.0)
- `/app/frontend/src/modules/groupe/components/GroupePanel.jsx` (version bump)
- `/app/frontend/src/pages/MonTerritoireBionicPage.jsx` (integration)

**Scope Compliance:**
- Data source: GPS positions ONLY
- Integration: Overlay on GROUPE map ONLY
- Interaction: Read-only ONLY
- No filters, no controls, no extra features

### Previous: BIONIC Design System Audit - COMPLETE (Validated)
- 45+ files refactored
- All emojis replaced with lucide-react icons
- 100% Design System compliance

## Architecture

```
/app/
├── backend/
│   ├── server.py
│   └── modules/
│       └── groupe/          # Backend (Phase 7+)
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── groupe/
│   │   │       ├── components/
│   │   │       │   ├── GroupeTab.jsx
│   │   │       │   ├── GroupePanel.jsx
│   │   │       │   ├── MembersTracker.jsx
│   │   │       │   ├── GroupChat.jsx
│   │   │       │   ├── SafetyStatus.jsx
│   │   │       │   ├── ShootingZones.jsx
│   │   │       │   ├── SmartAlerts.jsx
│   │   │       │   └── SessionHeatmap.jsx  # Phase 6 NEW
│   │   │       ├── hooks/
│   │   │       └── index.js
│   │   ├── components/
│   │   │   └── HeatmapLayer.jsx  # Used by SessionHeatmap
│   │   └── pages/
│   │       └── MonTerritoireBionicPage.jsx
└── memory/
    └── PRD.md
```

## GROUPE Module Phases

| Phase | Component | Status |
|-------|-----------|--------|
| 1 | GroupeTab, GroupePanel | VALIDATED |
| 2 | - | VALIDATED |
| 3 | MembersTracker | VALIDATED |
| 3.5 | GroupChat | VALIDATED |
| 4 | SafetyStatus, ShootingZones | VALIDATED |
| 5 | SmartAlerts | VALIDATED |
| 6 | SessionHeatmap | COMPLETE - Awaiting validation |
| 7 | Final integration, QA | PENDING |

## Pending Tasks

### Awaiting Validation
- [ ] Phase 6 (Session Heatmap) - Implementation complete

### P0 - Next (After Phase 6 validation)
- [ ] Phase 7: Final integration, testing, QA

### P1 - Future
- [ ] BIONIC Refactoring - Lot E: AIInsights.jsx
- [ ] Real Estate Module (Phases 11-15)
- [ ] Integrate real mature game images
- [ ] Offline mode & live navigation
- [ ] Full CRUD for private user paths

### P2 - Production
- [ ] Deploy Quebec proxy for MFFP WMS access
- [ ] Implement bathymetry data
- [ ] WebSocket sync & advanced scoring

## Credentials
- **Admin:** steeve.ross@gmail.com / Saturn5858*

## 3rd Party Integrations
- OpenAI GPT-5.2 (Emergent LLM Key)
- Google OAuth
- Resend (User API Key)
- MongoDB
- OpenWeatherMap (User API Key)
