/* eslint-disable react/prop-types */
import { usePermissions } from 'contexts/Permissions';

/**
 * AuthorizedUsage Component
 *
 * Wraps components and conditionally renders them based on user permissions
 *
 * @param {string|string[]} permission - Single permission string or array of permissions
 * @param {string} permissionType - Type of permission check: 'any', 'all', or 'single' (default: 'single')
 * @param {React.ReactNode} children - Components to render if user has permission
 * @param {React.ReactNode} fallback - Component to render if user doesn't have permission (optional)
 * @param {boolean} hideOnNoPermission - If true, renders nothing when no permission (default: true)
 */
const AuthorizedUsage = ({
  permission,
  permissionType = 'single',
  children,
  fallback = null,
  hideOnNoPermission = true
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  // Show loading state if permissions are still being fetched
  if (loading) {
    return fallback || (hideOnNoPermission ? null : children);
  }

  // Handle different permission types
  let hasRequiredPermission = false;

  if (permissionType === 'any' && Array.isArray(permission)) {
    hasRequiredPermission = hasAnyPermission(permission);
  } else if (permissionType === 'all' && Array.isArray(permission)) {
    hasRequiredPermission = hasAllPermissions(permission);
  } else {
    // Single permission check (default)
    const permissionToCheck = Array.isArray(permission) ? permission[0] : permission;
    hasRequiredPermission = hasPermission(permissionToCheck);
  }

  // Render based on permission check
  if (hasRequiredPermission) {
    return children;
  }

  // User doesn't have permission
  if (fallback) {
    return fallback;
  }

  return hideOnNoPermission ? null : children;
};

export default AuthorizedUsage;
