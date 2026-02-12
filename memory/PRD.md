# HUNTIQ V3 - BIONIC Hunting Platform

## Project Overview
HUNTIQ V3 is a professional hunting intelligence platform following the "BIONIC TACTICAL" design standard. The application provides scientific analysis of attractants, territory mapping, weather integration, and collaborative features for hunters.

## Core Requirements
- **Design System:** Strict BIONIC TACTICAL design - professional, scientific aesthetic
- **No Emojis:** All UI elements must use lucide-react icons or professional images
- **Species Display:** Use real wildlife photos via SpeciesIcon component
- **Workflow:** "Supra-sécuritaire" - explicit validation required for all tasks

## What's Been Implemented

### Date: 2025-02-12 - BIONIC Design System Audit COMPLETE

**Audit Status:** 100% COMPLETE

**Files Modified (45+ files):**

#### Modules (src/modules/):
- suppliers/components/SupplierCard.jsx
- notifications/NotificationService.js
- collaborative/components/SightingsFeed.jsx
- products/components/ProductCard.jsx
- products/components/ProductGrid.jsx
- affiliate/components/AffiliateStats.jsx
- cart/components/CartWidget.jsx
- recommendation/components/SimilarProducts.jsx
- ai/components/AIChat.jsx
- live_heading_view/components/SessionControls.jsx
- live_heading_view/components/WindIndicator.jsx
- orders/components/OrdersList.jsx
- scoring/ScoringService.js
- weather/WeatherService.js

#### Components (src/components/):
- BionicAnalyzer.jsx
- ContentDepot.jsx
- DynamicReferralWidget.jsx
- GeoSyncToggle.jsx
- HuntMarketplace.jsx
- LandsRental.jsx
- MaintenanceControl.jsx
- MaintenancePage.jsx
- MarketplacePayments.jsx
- OfflineIndicator.jsx
- PartnerDashboard.jsx
- PartnerOffers.jsx
- PromptManager.jsx
- ReferralModule.jsx
- ReferralWidget.jsx
- SiteAccessControl.jsx
- SuccessForecast.jsx
- TerritoryAdvanced.jsx
- TerritoryRankings.jsx
- trips/TripStatsDashboard.jsx

#### Components Territoire:
- BionicMicroZones.jsx
- EcoforestryLayers.jsx
- ShareComponents.jsx
- ZoneFavorites.jsx

#### Layouts & Configs:
- layouts/MainLayout.jsx
- services/ExportService.js
- config/mapSources.js
- config/EcoforestryDataSources.js

#### Pages:
- pages/TripsPage.jsx
- pages/AdminGeoPage.jsx

**Emoji Replacements Applied:**
- Species emojis → SpeciesIcon component or Target icon
- Weather emojis → lucide-react (Sun, Cloud, Snowflake, Wind)
- Action emojis → lucide-react (Check, X, AlertTriangle, Bell)
- Navigation emojis → lucide-react (MapPin, Map, Compass)
- E-commerce emojis → lucide-react (ShoppingCart, Package, DollarSign)
- Tier/Rank emojis → lucide-react (Trophy, Medal, Crown, Award)
- Misc emojis → lucide-react (Bot, Lightbulb, Flame, Star, BarChart3)

**Files Intentionally Excluded:**
- config/bionic-icons.js (migration mapping file)
- CategoriesManager.jsx (admin interface with intentional emoji defaults)
- DynamicReferralWidget.jsx (social platform icons)
- MarketingAIAdmin.jsx (social media content generation)

## Architecture

```
/app/
├── backend/
│   ├── server.py
│   ├── modules/
│   │   ├── groupe/          # Group hunting features
│   │   └── realestate/      # Real estate scaffold
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/bionic/species/  # Professional wildlife photos
│   │   ├── components/
│   │   │   ├── bionic/SpeciesIcon.jsx  # Centralized species display
│   │   │   ├── ui/          # Shadcn components
│   │   │   └── territoire/  # Territory components
│   │   ├── config/
│   │   │   ├── speciesImages.js    # Species image mapping
│   │   │   └── bionic-icons.js     # Icon migration map
│   │   ├── modules/         # Feature modules
│   │   ├── pages/           # Route pages
│   │   └── layouts/         # Layout components
│   └── package.json
└── memory/
    └── PRD.md
```

## Tech Stack
- **Frontend:** React, Tailwind CSS, Shadcn/UI, lucide-react
- **Backend:** FastAPI, Python
- **Database:** MongoDB
- **Maps:** Leaflet, react-leaflet
- **Charts:** Recharts
- **AI:** OpenAI GPT-5.2 (via Emergent LLM Key)

## Pending Tasks

### P0 - Blocked (awaiting validation)
- [ ] Phase 5 (Smart Alerts) - Functionally complete, validation blocked
- [ ] Phase 6: Session Heatmap
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
