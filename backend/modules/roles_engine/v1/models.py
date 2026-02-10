"""
Roles Engine - Pydantic Models
Defines user roles and permissions for HUNTIQ V3
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    """User role types - hierarchical permissions"""
    HUNTER = "hunter"      # Standard user - basic access
    GUIDE = "guide"        # Professional guide - extended access
    ADMIN = "admin"        # Administrator - full access


# Permission definitions per role
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    UserRole.HUNTER.value: [
        # Basic features
        "view_dashboard",
        "create_trip",
        "manage_own_trips",
        "view_analytics",
        "view_wqs",
        "manage_waypoints",
        "view_map",
        "manage_profile",
        "receive_notifications",
        # Limited features
        "view_public_territories",
    ],
    UserRole.GUIDE.value: [
        # All hunter permissions
        "view_dashboard",
        "create_trip",
        "manage_own_trips",
        "view_analytics",
        "view_wqs",
        "manage_waypoints",
        "view_map",
        "manage_profile",
        "receive_notifications",
        "view_public_territories",
        # Guide-specific permissions
        "view_client_trips",
        "manage_group_trips",
        "share_waypoints",
        "view_group_analytics",
        "export_reports",
        "manage_territory_access",
        "send_group_notifications",
    ],
    UserRole.ADMIN.value: [
        # All permissions
        "*",  # Wildcard - full access
        # Explicit admin permissions
        "admin_panel",
        "manage_users",
        "manage_roles",
        "view_all_trips",
        "view_all_analytics",
        "manage_site_settings",
        "manage_maintenance_mode",
        "view_system_logs",
        "manage_features",
        "manage_products",
        "manage_orders",
        "manage_territories",
        "manage_notifications",
        "impersonate_user",
        "export_all_data",
    ]
}


class RoleInfo(BaseModel):
    """Role information model"""
    role: UserRole
    label: str
    description: str
    permissions: List[str]
    is_elevated: bool = False


# Role metadata
ROLE_METADATA: Dict[str, RoleInfo] = {
    UserRole.HUNTER.value: RoleInfo(
        role=UserRole.HUNTER,
        label="🎯 Chasseur",
        description="Utilisateur standard avec accès aux fonctionnalités de base",
        permissions=ROLE_PERMISSIONS[UserRole.HUNTER.value],
        is_elevated=False
    ),
    UserRole.GUIDE.value: RoleInfo(
        role=UserRole.GUIDE,
        label="🧭 Guide",
        description="Guide professionnel avec accès étendu pour gérer des groupes",
        permissions=ROLE_PERMISSIONS[UserRole.GUIDE.value],
        is_elevated=True
    ),
    UserRole.ADMIN.value: RoleInfo(
        role=UserRole.ADMIN,
        label="⚙️ Administrateur",
        description="Accès complet à toutes les fonctionnalités et paramètres",
        permissions=ROLE_PERMISSIONS[UserRole.ADMIN.value],
        is_elevated=True
    )
}


class UserWithRole(BaseModel):
    """Extended user model with role information"""
    user_id: str
    name: str
    email: str
    phone: Optional[str] = None
    picture: Optional[str] = None
    auth_provider: str = "local"
    role: UserRole = UserRole.HUNTER
    permissions: List[str] = []
    created_at: Optional[datetime] = None
    is_active: bool = True


class RoleUpdate(BaseModel):
    """Model for updating a user's role"""
    user_id: str
    new_role: UserRole
    reason: Optional[str] = None


class RoleChangeLog(BaseModel):
    """Log entry for role changes"""
    user_id: str
    old_role: UserRole
    new_role: UserRole
    changed_by: str
    changed_at: datetime
    reason: Optional[str] = None


class PermissionCheck(BaseModel):
    """Permission check result"""
    has_permission: bool
    permission: str
    user_role: UserRole
    message: Optional[str] = None
