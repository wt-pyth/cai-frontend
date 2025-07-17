import { usePermissions, PERMISSIONS } from 'contexts/Permissions';

/**
 * Custom hook for easier permission checking
 * Provides convenient methods for checking permissions throughout the app
 */
export const useAuth = () => {
  const {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
    refreshPermissions
  } = usePermissions();

  // Convenience methods for common permission checks
  const can = {
    // User permissions
    viewUsers: () => hasPermission(PERMISSIONS.USERS_VIEW),
    addUsers: () => hasPermission(PERMISSIONS.USERS_ADD),
    lockUsers: () => hasPermission(PERMISSIONS.USERS_LOCK),
    deleteUsers: () => hasPermission(PERMISSIONS.USERS_DELETE),
    setUserAdmin: () => hasPermission(PERMISSIONS.USERS_SET_ADMIN),

    // Company permissions
    viewCompany: () => hasPermission(PERMISSIONS.COMPANY_VIEW),
    updateCompany: () => hasPermission(PERMISSIONS.COMPANY_UPDATE),
    deleteCompany: () => hasPermission(PERMISSIONS.COMPANY_DELETE),

    // Billing permissions
    viewBilling: () => hasPermission(PERMISSIONS.BILLING_VIEW),
    updateBilling: () => hasPermission(PERMISSIONS.BILLING_UPDATE),
    deleteBilling: () => hasPermission(PERMISSIONS.BILLING_DELETE),
    viewBillingLogs: () => hasPermission(PERMISSIONS.BILLING_VIEW_LOGS),
    changePaymentMethod: () => hasPermission(PERMISSIONS.BILLING_CHANGE_PAYMENT_METHOD),

    // Generic permission check
    do: (permission) => hasPermission(permission),

    // Multiple permission checks
    doAny: (permissionArray) => hasAnyPermission(permissionArray),
    doAll: (permissionArray) => hasAllPermissions(permissionArray)
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
    refreshPermissions,
    can
  };
};

export default useAuth;
