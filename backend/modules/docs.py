"""OpenAPI Documentation Generator for HUNTIQ Modules

Generates comprehensive OpenAPI/Swagger documentation for all modular endpoints.

Version: 1.0.0
"""

from fastapi import APIRouter
from fastapi.openapi.utils import get_openapi
from typing import Dict, Any

# Documentation metadata
MODULES_DOCS = {
    "nutrition_engine": {
        "name": "Nutrition Engine",
        "description": """
## Module d'Analyse Nutritionnelle

Analyse complète des ingrédients d'attractants pour la chasse.

### Fonctionnalités
- Base de données de 29 ingrédients scientifiquement documentés
- Catégorisation par type (olfactif, nutritionnel, comportemental, fixateur)
- Recherche et filtrage avancés
- Calcul de scores nutritionnels

### Types d'ingrédients
- **Olfactif**: Composés d'attraction par l'odeur (AGV, terpènes, esters)
- **Nutritionnel**: Composés d'attraction par la nutrition (protéines, glucides, minéraux)
- **Comportemental**: Phéromones et signaux chimiques
- **Fixateur**: Prolongent la durée d'action des attractants
        """,
        "version": "1.0.0",
        "prefix": "/api/v1/nutrition"
    },
    "scoring_engine": {
        "name": "Scoring Engine",
        "description": """
## Module de Scoring Scientifique

Système d'évaluation des attractants basé sur 13 critères pondérés.

### Critères d'évaluation
| Critère | Poids | Description |
|---------|-------|-------------|
| Durée d'attraction | 15% | Nombre de jours d'efficacité |
| Appétence naturelle | 12% | Attrait gustatif pour le gibier |
| Puissance olfactive | 12% | Intensité de l'odeur |
| Persistance | 10% | Durée du signal olfactif |
| Nutrition | 10% | Valeur nutritive |
| Composés comportementaux | 10% | Présence de phéromones |
| Résistance intempéries | 8% | Rainproof |
| Sécurité alimentaire | 7% | Feed-Proof |
| Certification ACIA | 6% | Certification officielle |
| Résistance physique | 4% | Durabilité du produit |
| Pureté ingrédients | 3% | Qualité des composants |
| Fidélisation | 2% | Retour du gibier |
| Stabilité chimique | 1% | Dégradation dans le temps |

### Système de pastilles
- 🟢 **Vert** (≥7.5): Attraction forte
- 🟡 **Jaune** (≥5.0): Attraction modérée  
- 🔴 **Rouge** (<5.0): Attraction faible
        """,
        "version": "1.0.0",
        "prefix": "/api/v1/scoring"
    },
    "ai_engine": {
        "name": "AI Engine",
        "description": """
## Module d'Analyse IA GPT-5.2

Analyse intelligente des produits d'attractants utilisant GPT-5.2.

### Fonctionnalités
- Analyse complète de produits par nom
- Estimation des ingrédients et composition
- Comparaison avec produits BIONIC™
- Analyse contextuelle (espèce, saison, météo, terrain)
- Références scientifiques intégrées

### Produits BIONIC™ de référence
- Apple Jelly Premium (gel)
- Bloc Mix Ultra (bloc)
- Buck Urine Premium (urine)
- Deer Granules Pro (granules)
- Spray Attraction Max (liquide)
- Powder Attract Plus (poudre)

### Paramètres d'analyse avancée
- **Espèce**: cerf, orignal, ours, sanglier, dindon
- **Saison**: printemps, été, automne, hiver
- **Météo**: froid, normal, chaud, pluie, neige
- **Terrain**: forêt, champ, marais, montagne
        """,
        "version": "1.0.0",
        "prefix": "/api/v1/ai"
    },
    "weather_engine": {
        "name": "Weather Engine",
        "description": """
## Module d'Analyse Météorologique

Analyse des conditions météo pour optimiser les sorties de chasse.

### Facteurs analysés
- **Température**: Impact sur l'activité du gibier
- **Humidité**: Diffusion des odeurs
- **Vent**: Vitesse et direction
- **Pression**: Changements déclencheurs d'activité
- **Précipitations**: Impact sur la visibilité et les déplacements

### Conditions optimales pour le cerf
- Température: -5°C à 15°C (idéal: 5°C)
- Humidité: 40% à 80%
- Vent: 0-20 km/h (idéal: 8 km/h)

### Phases lunaires
Le module calcule également l'impact de la lune:
- Nouvelle lune: Activité diurne accrue
- Pleine lune: Activité nocturne, journées calmes
- Croissant: Activité crépusculaire forte
        """,
        "version": "1.0.0",
        "prefix": "/api/v1/weather"
    },
    "geospatial_engine": {
        "name": "Geospatial Engine",
        "description": """
## Module d'Analyse Géospatiale

Gestion et analyse des territoires de chasse au Québec.

### Fonctionnalités
- 17 régions administratives du Québec
- Calcul de distances (formule Haversine)
- Analyse de terrain (élévation, pente, végétation)
- Recherche de zones de chasse à proximité

### Types de zones
- **ZEC**: Zones d'exploitation contrôlée
- **Pourvoirie**: Territoires privés avec services
- **Terres publiques**: Domaine de l'État
- **Réserves fauniques**: Gérées par SÉPAQ

### Calculs géographiques
- Distance entre deux points (km)
- Azimut/bearing (degrés)
- Direction cardinale (N, NE, E, SE, S, SW, W, NW)
        """,
        "version": "1.0.0",
        "prefix": "/api/v1/geospatial"
    },
    "wms_engine": {
        "name": "WMS Engine",
        "description": """
## Module de Gestion WMS

Gestion des couches cartographiques WMS pour la chasse.

### Couches disponibles
| ID | Nom | Catégorie |
|----|-----|-----------|
| base_topo | Carte topographique | Base |
| hunting_zones | Zones de chasse | Chasse |
| zecs | ZEC | Chasse |
| wildlife_reserves | Réserves fauniques | Chasse |
| public_lands | Terres publiques | Terres |
| hydrography | Hydrographie | Environnement |
| forests | Couvert forestier | Environnement |
| elevation | Élévation | Terrain |
| roads | Réseau routier | Infrastructure |
| satellite | Imagerie satellite | Base |

### Sources
Données gouvernementales du Québec (MFFP, MERN, MTQ, SÉPAQ)

### Cas d'usage
- **Général**: Topo, zones, hydrographie
- **Repérage**: Satellite, forêts, élévation
- **Navigation**: Topo, routes, hydrographie
- **Planification**: Zones, ZEC, réserves, terres publiques
        """,
        "version": "1.0.0",
        "prefix": "/api/v1/wms"
    },
    "strategy_engine": {
        "name": "Strategy Engine",
        "description": """
## Module de Stratégie de Chasse

Génération de stratégies de chasse personnalisées.

### Éléments de stratégie
- Score global de conditions
- Estimation de succès
- Approche principale recommandée
- Recommandations prioritaires
- Liste d'équipement
- Timing optimal
- Avertissements de sécurité

### Espèces supportées
- **Cerf**: Sensibilité haute, actif aube/crépuscule
- **Orignal**: Sensibilité moyenne, zones humides
- **Ours**: Sensibilité faible, long approche
- **Sanglier**: Actif la nuit, forêts/champs
- **Dindon**: Sensibilité très haute, champs/lisières

### Placement de poste
- Type (tree stand, blind, naturel)
- Orientation par rapport au vent
- Hauteur recommandée
- Distance des sentiers

### Stratégie d'attractants
- Type de produit recommandé
- Distance de placement
- Fréquence de renouvellement
        """,
        "version": "1.0.0",
        "prefix": "/api/v1/strategy"
    }
}


def get_modules_openapi_schema() -> Dict[str, Any]:
    """Generate complete OpenAPI schema for all modules"""
    return {
        "openapi": "3.1.0",
        "info": {
            "title": "HUNTIQ V3 - Modular API",
            "description": """
# HUNTIQ V3 - API Modulaire

Documentation complète des endpoints modulaires HUNTIQ V3.

## Architecture
L'API est organisée en modules indépendants et versionnés:
- Chaque module a son propre préfixe `/api/v1/{module}`
- Les modules sont isolés et sans dépendances croisées
- Versionnement sémantique pour chaque module

## Modules disponibles
- **Nutrition Engine**: Analyse des ingrédients
- **Scoring Engine**: Évaluation scientifique (13 critères)
- **AI Engine**: Analyse IA GPT-5.2
- **Weather Engine**: Conditions météo de chasse
- **Geospatial Engine**: Gestion des territoires
- **WMS Engine**: Couches cartographiques
- **Strategy Engine**: Stratégies de chasse

## Authentification
Les endpoints publics ne nécessitent pas d'authentification.
Les endpoints admin utilisent l'authentification existante.
            """,
            "version": "1.0.0",
            "contact": {
                "name": "HUNTIQ Support",
                "url": "https://bionic-hunt.com"
            },
            "license": {
                "name": "Proprietary",
                "url": "https://bionic-hunt.com/license"
            }
        },
        "servers": [
            {
                "url": "https://bionic-tutorial.preview.emergentagent.com",
                "description": "Preview Server"
            }
        ],
        "tags": [
            {"name": "Modules Status", "description": "État des modules"},
            {"name": "Nutrition Engine", "description": MODULES_DOCS["nutrition_engine"]["description"]},
            {"name": "Scoring Engine", "description": MODULES_DOCS["scoring_engine"]["description"]},
            {"name": "AI Engine", "description": MODULES_DOCS["ai_engine"]["description"]},
            {"name": "Weather Engine", "description": MODULES_DOCS["weather_engine"]["description"]},
            {"name": "Geospatial Engine", "description": MODULES_DOCS["geospatial_engine"]["description"]},
            {"name": "WMS Engine", "description": MODULES_DOCS["wms_engine"]["description"]},
            {"name": "Strategy Engine", "description": MODULES_DOCS["strategy_engine"]["description"]}
        ],
        "paths": {},  # Paths are auto-generated by FastAPI
        "components": {
            "schemas": {}  # Schemas are auto-generated by Pydantic models
        }
    }


# Export documentation metadata
__all__ = ["MODULES_DOCS", "get_modules_openapi_schema"]
