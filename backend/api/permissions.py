from rest_framework import permissions


def _role(request):
    user = getattr(request, 'user', None)
    if not user or not user.is_authenticated:
        return None
    profile = getattr(user, 'profile', None)
    return profile.role if profile else None


class CanEdit(permissions.BasePermission):
    """Public read access; writes (POST/PUT/PATCH) require editor or admin."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return _role(request) in ('admin', 'editor')


class IsAdmin(permissions.BasePermission):
    """Writes require the admin role."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return _role(request) == 'admin'
