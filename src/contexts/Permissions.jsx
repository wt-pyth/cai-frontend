/* eslint-disable react/prop-types */
import axios from 'axios';
import { createContext, useEffect, useState, useContext, useCallback, useRef } from 'react';
import { AUTH_PATH } from 'constants/site';
import toastError from 'utils/toastErrors';
import { userContext } from './Auth';

const PermissionsContext = createContext({
  permissions: [],
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  loading: false,
  refreshPermissions: () => {}
});

// Permission constants - you can expand this based on your needs
export const PERMISSIONS = {
  // Users permissions
  USERS_VIEW: 'users.view',
  USERS_SET_ADMIN: 'users.set_admin',
  USERS_ADD: 'users.add',
  USERS_LOCK: 'users.lock', //! not used
  USERS_DELETE: 'users.delete',

  // Company permissions
  COMPANY_VIEW: 'company.view',
  COMPANY_UPDATE: 'company.update',
  COMPANY_DELETE: 'company.delete',

  // Billing permissions
  BILLING_VIEW: 'billing.view',
  BILLING_UPDATE: 'billing.update',
  BILLING_DELETE: 'billing.delete',
  BILLING_VIEW_LOGS: 'billing.view_logs',
  BILLING_CHANGE_PAYMENT_METHOD: 'billing.change_payment_method'
};

const PermissionsProvider = ({ children }) => {
  const { authToken, isAuth, logout } = useContext(userContext);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  // Create axios instance for permissions API calls
  const permissionsApiClient = axios.create({
    baseURL: AUTH_PATH
  });

  // Function to check if user has a specific permission
  const hasPermission = useCallback(
    (permission) => {
      if (!permission || !permissions.length) return false;
      return permissions.includes(permission);
    },
    [permissions]
  );

  // Function to check if user has any of the provided permissions
  const hasAnyPermission = useCallback(
    (permissionArray) => {
      if (!permissionArray || !permissionArray.length || !permissions.length) return false;
      return permissionArray.some((permission) => permissions.includes(permission));
    },
    [permissions]
  );

  // Function to check if user has all of the provided permissions
  const hasAllPermissions = useCallback(
    (permissionArray) => {
      if (!permissionArray || !permissionArray.length || !permissions.length) return false;
      return permissionArray.every((permission) => permissions.includes(permission));
    },
    [permissions]
  );

  // Fetch user permissions from API
  const fetchPermissions = useCallback(
    async (forceRefresh = false) => {
      if (!authToken || !isAuth) {
        setPermissions([]);
        hasFetchedRef.current = false;
        return;
      }

      // Skip if already fetched and not forcing refresh
      if (hasFetchedRef.current && !forceRefresh) {
        return;
      }

      setLoading(true);
      try {
        const response = await permissionsApiClient.get('/api/users/me/', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        const userPermissions = response.data.active_sessions.permissions || [];
        setPermissions(userPermissions);
        hasFetchedRef.current = true;
      } catch (error) {
        console.error('Error fetching permissions:', error);

        // If unauthorized, logout user
        if (error.response?.status === 401) {
          toastError('Session expired. Please log in again.');
          logout();
        } else {
          toastError('Error fetching user permissions');
        }
        setPermissions([]);
        hasFetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    },
    [authToken, isAuth, logout]
  );

  // Fetch permissions only once when user logs in
  useEffect(() => {
    if (isAuth && authToken && !hasFetchedRef.current && !loading) {
      fetchPermissions();
    } else if (!isAuth || !authToken) {
      // Clear permissions when user logs out
      setPermissions([]);
      hasFetchedRef.current = false;
    }
  }, [isAuth, authToken, fetchPermissions, loading]);

  // Add request interceptor to include auth token
  useEffect(() => {
    const requestInterceptor = permissionsApiClient.interceptors.request.use(
      (config) => {
        if (authToken) {
          return {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${authToken}`
            }
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => permissionsApiClient.interceptors.request.eject(requestInterceptor);
  }, [authToken]);

  const contextValue = {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading,
    refreshPermissions: () => fetchPermissions(true) // Force refresh method
  };

  return <PermissionsContext.Provider value={contextValue}>{children}</PermissionsContext.Provider>;
};

// Custom hook to use permissions context
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export { PermissionsContext, PermissionsProvider };
