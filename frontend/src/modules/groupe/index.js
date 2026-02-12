/**
 * MODULE GROUPE - Exports centralisés
 * BIONIC Design System compliant
 * Version: 1.3.0 - Phase 4
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

// Components - Phase 4
export { SafetyStatus, SafetyStatusBadge } from './components/SafetyStatus';
export { ShootingZones, ShootingZone } from './components/ShootingZones';

// Hooks - Phase 3
export { useGroupeTracking, TRACKING_STATUS } from './hooks/useGroupeTracking';

// Hooks - Phase 3.5
export { useGroupeChat, MESSAGE_TYPES, ALERT_TYPES, QUICK_MESSAGES } from './hooks/useGroupeChat';

// Hooks - Phase 4
export { useGroupeSafety, SAFETY_STATUS, SHOOTING_ZONE_TYPES } from './hooks/useGroupeSafety';

// Future exports (Phase 5+)
// export { SmartAlerts } from './components/SmartAlerts';
// export { SessionHeatmap } from './components/SessionHeatmap';

// Hooks (Phase 5+)
// export { useGroupeAlerts } from './hooks/useGroupeAlerts';

// Services (Phase 6+)
// export { GroupeService } from './services/GroupeService';
