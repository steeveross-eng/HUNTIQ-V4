# 📱 ROADMAP - Mode Hors-Ligne & Navigation Terrain BIONIC

**Date**: 11 Février 2026  
**Version**: 1.0  
**Priorité**: P0.5  
**Statut**: PLANIFIÉ  

---

## 🎯 Objectif

Permettre au chasseur de se déplacer sur le terrain avec une carte premium dynamique, lisible et précise, **même sans signal cellulaire**, tout en maintenant une architecture propre, évolutive et sans dette technique.

---

## 📋 Fonctionnalités Requises

### 1. Mode Hors-Ligne Complet (Téléchargement des Tuiles)

| Fonctionnalité | Description |
|----------------|-------------|
| **Sélection de zone** | Interface pour délimiter la zone à télécharger (rectangle, cercle, polygone) |
| **Choix des niveaux de zoom** | Sélection des niveaux (ex: 10-17) selon l'usage terrain |
| **Estimation de taille** | Calcul et affichage de l'espace requis avant téléchargement |
| **Téléchargement progressif** | Barre de progression, pause/reprise, téléchargement en arrière-plan |
| **Gestion multi-cartes** | Télécharger plusieurs types de cartes pour la même zone |

**Architecture modulaire:**
```
/app/frontend/src/
├── modules/
│   └── offline/
│       ├── TileDownloader.js        # Service de téléchargement
│       ├── TileStorage.js           # Gestion IndexedDB
│       ├── DownloadManager.jsx      # UI de téléchargement
│       ├── OfflineMapProvider.jsx   # Provider pour cartes offline
│       └── hooks/
│           ├── useOfflineTiles.js
│           └── useDownloadProgress.js
```

### 2. Navigation Terrain en Direct (Guidage GPS)

| Fonctionnalité | Description |
|----------------|-------------|
| **Position GPS temps réel** | Marqueur animé avec direction et précision |
| **Suivi de parcours** | Enregistrement automatique du trajet |
| **Guidage vers waypoint** | Distance, direction, temps estimé |
| **Alertes de proximité** | Notification à l'approche d'une zone/waypoint |
| **Mode économie batterie** | Fréquence GPS adaptative |

**Architecture modulaire:**
```
/app/frontend/src/
├── modules/
│   └── navigation/
│       ├── GPSService.js            # Service géolocalisation
│       ├── NavigationEngine.js      # Calculs de navigation
│       ├── TrackRecorder.js         # Enregistrement parcours
│       ├── ProximityAlerts.js       # Alertes de zone
│       ├── NavigationPanel.jsx      # UI de guidage
│       └── hooks/
│           ├── useGPS.js
│           ├── useNavigation.js
│           └── useProximityAlerts.js
```

### 3. Orientation Boussole Temps Réel

| Fonctionnalité | Description |
|----------------|-------------|
| **Boussole digitale** | Affichage de l'orientation (Device Orientation API) |
| **Rotation de carte** | Option "north-up" ou "heading-up" |
| **Calibration** | Détection et correction des erreurs magnétiques |
| **Indicateur de qualité** | Fiabilité de la boussole |

**Architecture modulaire:**
```
/app/frontend/src/
├── modules/
│   └── compass/
│       ├── CompassService.js        # Service orientation
│       ├── CompassCalibration.js    # Calibration magnétique
│       ├── CompassWidget.jsx        # Widget boussole
│       └── hooks/
│           └── useCompass.js
```

### 4. Mise à Jour Automatique des Tuiles

| Fonctionnalité | Description |
|----------------|-------------|
| **Détection de connexion** | Monitoring réseau (online/offline) |
| **Sync intelligente** | Mise à jour des tuiles obsolètes en arrière-plan |
| **Priorité de sync** | Zone actuelle > Zones favoris > Reste |
| **Notification** | Informer l'utilisateur des mises à jour disponibles |

**Architecture modulaire:**
```
/app/frontend/src/
├── modules/
│   └── sync/
│       ├── NetworkMonitor.js        # Détection réseau
│       ├── TileSyncService.js       # Synchronisation tuiles
│       ├── SyncQueue.js             # File d'attente de sync
│       └── hooks/
│           └── useNetworkStatus.js
```

### 5. Gestion Intelligente du Cache

| Fonctionnalité | Description |
|----------------|-------------|
| **IndexedDB** | Stockage local haute performance |
| **LRU Cache** | Éviction des tuiles les moins utilisées |
| **Quota management** | Respect des limites navigateur |
| **Compression** | Optimisation de l'espace (WebP si supporté) |
| **Statistiques** | Affichage de l'utilisation du cache |

**Architecture modulaire:**
```
/app/frontend/src/
├── modules/
│   └── cache/
│       ├── CacheManager.js          # Gestionnaire principal
│       ├── IndexedDBAdapter.js      # Adapter IndexedDB
│       ├── LRUStrategy.js           # Stratégie d'éviction
│       ├── CacheStats.jsx           # UI statistiques
│       └── hooks/
│           └── useCacheStats.js
```

### 6. Compatibilité Totale

**Éléments supportés en mode hors-ligne:**

| Élément | Stockage | Synchronisation |
|---------|----------|-----------------|
| 7 cartes premium | IndexedDB (tuiles) | Sync partielle |
| 14 zones avancées | IndexedDB (GeoJSON) | Sync complète |
| Chemins privés | IndexedDB (geo_entities) | Sync bidirectionnelle |
| Hotspots | IndexedDB (coords + scores) | Sync complète |
| Waypoints utilisateur | IndexedDB | Sync bidirectionnelle |
| Préférences | localStorage | Sync complète |

### 7. Continuité Visuelle Online/Offline

| Aspect | Implémentation |
|--------|----------------|
| **Indicateur de mode** | Badge discret "Hors-ligne" / "En ligne" |
| **Transition fluide** | Pas de rechargement lors du changement de mode |
| **Fallback gracieux** | Tuiles basse résolution si haute rés non dispo |
| **Cohérence des styles** | Même rendu CSS online/offline |

---

## 🏗️ Architecture Modulaire Stricte

### Principes BIONIC

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │  Maps   │ │  Zones  │ │ Chemins │ │ Guidage │           │
│  │ Module  │ │ Module  │ │ Module  │ │ Module  │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       │           │           │           │                 │
├───────┼───────────┼───────────┼───────────┼─────────────────┤
│       │           │           │           │                 │
│       ▼           ▼           ▼           ▼                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              OFFLINE CORE SERVICE                    │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │  │  Cache  │ │  Sync   │ │  GPS    │ │ Compass │    │   │
│  │  │ Manager │ │ Service │ │ Service │ │ Service │    │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
├───────────────────────────┼─────────────────────────────────┤
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              STORAGE LAYER                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │  IndexedDB  │  │ localStorage │  │   Memory    │  │   │
│  │  │   (tiles)   │  │  (prefs)     │  │  (runtime)  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Règles d'Architecture

1. **Indépendance des modules**
   - Chaque module expose une API publique claire
   - Communication via événements ou Context API
   - Aucun import direct entre modules de même niveau

2. **Aucune dépendance circulaire**
   - Flux unidirectionnel: App → Modules → Services → Storage
   - Les modules ne peuvent pas s'appeler mutuellement

3. **Aucune logique couplée**
   - Maps ne connaît pas Zones
   - Zones ne connaît pas Chemins
   - Guidage ne connaît pas l'implémentation des cartes

4. **Remplaçabilité**
   - Chaque module peut être remplacé via injection de dépendance
   - Interfaces TypeScript pour les contrats

5. **Extensibilité**
   - Nouveaux types de cartes sans modifier l'existant
   - Nouvelles zones via configuration
   - Nouveaux modes de guidage via plugins

---

## 📊 Estimation Technique

### Stockage Estimé par Zone (50km²)

| Type de carte | Zoom 10-14 | Zoom 10-17 |
|---------------|------------|------------|
| BIONIC Premium | ~15 MB | ~120 MB |
| Satellite HR | ~50 MB | ~400 MB |
| Topo Avancée | ~20 MB | ~160 MB |
| **TOTAL (3 cartes)** | ~85 MB | ~680 MB |

### APIs Requises

- **Geolocation API** - Position GPS
- **Device Orientation API** - Boussole
- **IndexedDB API** - Stockage local
- **Service Worker API** - Cache et offline
- **Background Sync API** - Synchronisation différée

---

## 🚀 Plan d'Implémentation

### Sprint 1 - Fondations Offline
- [ ] IndexedDBAdapter avec support tuiles
- [ ] CacheManager avec stratégie LRU
- [ ] NetworkMonitor (online/offline)
- [ ] UI indicateur de mode

### Sprint 2 - Téléchargement de Tuiles
- [ ] TileDownloader service
- [ ] DownloadManager UI (sélection zone, progression)
- [ ] Estimation de taille
- [ ] Gestion des erreurs et reprise

### Sprint 3 - GPS & Navigation
- [ ] GPSService avec précision adaptative
- [ ] TrackRecorder pour parcours
- [ ] NavigationEngine (calculs distance/direction)
- [ ] NavigationPanel UI

### Sprint 4 - Boussole & Finitions
- [ ] CompassService
- [ ] Mode "heading-up" pour carte
- [ ] Alertes de proximité
- [ ] Tests terrain réels

---

## ✅ Critères de Validation

- [ ] Téléchargement de zone 50km² en < 5 minutes (WiFi)
- [ ] Navigation GPS fonctionnelle sans réseau
- [ ] Précision boussole < 5° d'erreur
- [ ] Transition online/offline transparente
- [ ] Cache respectant quota navigateur
- [ ] Aucune perte de données lors de la sync
- [ ] Performance carte identique online/offline
- [ ] Architecture passant l'analyse de dépendances (madge)

---

*Document préparé pour HUNTIQ V3 / BIONIC™*  
*Mode Hors-Ligne & Navigation Terrain*
