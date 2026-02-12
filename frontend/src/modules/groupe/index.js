/**
 * MODULE GROUPE - Exports centralisés
 * BIONIC Design System compliant
 * Version: 1.2.0 - Phase 3.5
 * 
 * Fonctionnalités collaboratives pour les sorties de chasse en équipe.
 */

// Components - Phase 1
export { GroupeTab } from './components/GroupeTab';
export { GroupePanel } from './components/GroupePanel';

// Components - Phase 3
export { MembersTracker } from './components/MembersTracker';

// Components - Phase 3.5
export { GroupChat } from './components/GroupChat';

// Hooks - Phase 3
export { useGroupeTracking, TRACKING_STATUS } from './hooks/useGroupeTracking';

// Hooks - Phase 3.5
export { useGroupeChat, MESSAGE_TYPES, ALERT_TYPES, QUICK_MESSAGES } from './hooks/useGroupeChat';

// Future exports (Phase 4+)
// export { SafetyStatus } from './components/SafetyStatus';
// export { ShootingZones } from './components/ShootingZones';
// export { SmartAlerts } from './components/SmartAlerts';
// export { SessionHeatmap } from './components/SessionHeatmap';

// Hooks (Phase 5+)
// export { useGroupeAlerts } from './hooks/useGroupeAlerts';
// export { useGroupeSafety } from './hooks/useGroupeSafety';

// Services (Phase 6+)
// export { GroupeService } from './services/GroupeService';
