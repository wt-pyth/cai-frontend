/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  createContext, useEffect, useState, useCallback, useRef
} from 'react';
import fernet from 'fernet';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'react-use';
// import useSWR from 'swr';
// import { apiGet } from 'services/api';
import {
  BASE_PATH, AUTH_PATH, CLIENT_ID, API_KEY
} from 'constants/site';
import toastError from 'utils/toastErrors';

const userContext = createContext({ user: {} });

const publicPages = [
  '/',
  '/signup',
  '/password/reset',
  '/password/confirm/[uid]/[token]',
  '/resendemail',
  '/confirm-email',
  '/invite-signup',
  '/accept-invite'
];
const adminRoutes = ['/organisation-management', '/billing'];

// Create an Axios instance for API calls
const apiClient = axios.create({
  baseURL: AUTH_PATH
});

// Utility to get token directly from localStorage
const getStoredToken = () => JSON.parse(localStorage.getItem('caasToken')) || '';
const getStoredRefreshToken = () => JSON.parse(localStorage.getItem('caasRefreshToken')) || '';

const UserProvider = ({ children }) => {
  const router = useRouter();
  const baseUser = { first_name: '', uprofile: { email_verified: false } };
  const [user, setUser] = useLocalStorage('caasUser', baseUser);
  const [authToken, setAuthToken] = useLocalStorage('caasToken', '');
  const [refreshToken, setRefreshToken] = useLocalStorage('caasRefreshToken', '');
  const [mounted, setMounted] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  // Use useRef to persist refreshTokenPromise across renders
  const refreshTokenPromiseRef = useRef(null);

  // Request interceptor to always use the latest token from localStorage
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        const token = getStoredToken();
        if (token) {
          return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => apiClient.interceptors.request.eject(requestInterceptor);
  }, []);

  const logout = () => {
    setUser(baseUser);
    setAuthToken('');
    setRefreshToken('');
    setCompanies([]);
    setSelectedCompany(null);
    router.push('/');
  };

  // Fetch companies with a memoized callback
  const fetchCompanies = useCallback(async (page = pagination.current, search = searchText, pageSize = pagination.pageSize) => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const { data } = await apiClient.get(`api/auth/user/companies/?page=${page}&search=${search}&page_size=${pageSize}`);
      // Ensure unique companies by uuid
      const uniqueCompanies = Array.from(
        new Map(data.companies.map((item) => [item.uuid, item])).values()
      );
      setCompanies(uniqueCompanies);
      setPagination((prev) => ({
        ...prev,
        current: data.current_page,
        pageSize, // Use the provided pageSize
        total: data.total_companies
      }));
      if (data?.companies.length > 0 && !selectedCompany) {
        setSelectedCompany(data.companies[0].uuid);
      }
    } catch (error) {
      toastError('Error fetching companies');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, pagination.current, searchText, pagination.pageSize]);

  // Fetch companies only when authToken is available
  useEffect(() => {
    if (authToken) fetchCompanies();
  }, [authToken, fetchCompanies]);

  // Handle initial mount and route protection
  useEffect(() => {
    setMounted(true);
    const token = getStoredToken();
    if (!token && !publicPages.includes(router.pathname)) {
      router.push(`/?next=${router.asPath}`);
    }
  }, [router]);

  // Note: The following SWR code is commented out as it is not used in the current context.
  // SWR for access data
  // const { data: accessData } = useSWR(
  //   authToken ? 'access' : null,
  //   () => apiGet('/depts/load/', getStoredToken()),
  //   { refreshInterval: 600000 }
  // );

  // const hlevel = accessData?.hlevel || 20;
  // const dtaccess = accessData?.dtaccess || [];

  // Refresh token logic with synchronization
  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = getStoredRefreshToken();
    const currentAuthToken = getStoredToken();

    if (!currentRefreshToken) throw new Error('No refresh token found');

    // If a refresh is already in progress, return the existing promise
    if (refreshTokenPromiseRef.current) {
      return refreshTokenPromiseRef.current;
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: currentRefreshToken,
      client_id: CLIENT_ID
    });

    // Create a new promise for the refresh operation and store it in the ref
    refreshTokenPromiseRef.current = axios
      .post(`${AUTH_PATH}o/token/`, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${currentAuthToken}`
        }
      })
      .then((response) => {
        setAuthToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        return response.data.access_token;
      })
      .catch((error) => {
        toastError('Session expired. Please log in again.');
        logout();
        throw error;
      })
      .finally(() => {
        // Clear the promise once the refresh is complete
        refreshTokenPromiseRef.current = null;
      });

    return refreshTokenPromiseRef.current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Response interceptor for token refresh
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log('Response error:', error);
        const originalRequest = error.config;
        if (
          error.response?.status === 401
          && !originalRequest._retry
          && !originalRequest.url.includes('o/token/')
        ) {
          originalRequest._retry = true; // Mark as retried
          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => apiClient.interceptors.response.eject(responseInterceptor);
  }, [refreshAccessToken]);

  // Login function
  const login = async (values, setDisabled) => {
    setDisabled(true);
    try {
      const fernetKey = new fernet.Secret(API_KEY);
      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: CLIENT_ID,
        ...values
      });

      const res = await axios.post(`${AUTH_PATH}o/token/`, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token, refresh_token } = res.data;
      setAuthToken(access_token);
      setRefreshToken(refresh_token);

      const verifyUser = await axios.get(`${AUTH_PATH}o/introspect?token=${access_token}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      const encryptedData = verifyUser.data.data;
      const fernetToken = new fernet.Token({ secret: fernetKey, token: encryptedData, ttl: 0 });
      const decryptedData = fernetToken.decode();
      setUser(JSON.parse(decryptedData));

      router.push('/mycapabara');
    } catch (error) {
      setDisabled(false);
      toastError(error);
    }
  };

  const isAuth = !!authToken;

  const resetPassword = async (formData) => {
    // setDisabled(true);
    try {
      await apiClient.post('/api/auth/account/reset-password', {
        action: 'reset_passowrd',
        email: formData.email
      });
      toast.success('Please check your email for the password reset link!');
    } catch (error) {
      // setDisabled(false);
      toastError(error);
    }
  };

  const resetPasswordConfirm = async (formData) => {
    // setDisabled(true);
    try {
      await axios.post(`${AUTH_PATH}api/auth/password/reset/confirm/`, formData);
      router.push('/');
      toast.success('Reset Successful. Please login!');
    } catch (error) {
      // setDisabled(false);
      toastError(error);
    }
  };

  const register = async (formData, _) => {
    // setDisabled(true);
    try {
      const nformData = { ...formData };
      nformData.username = '-';
      nformData.password2 = formData.password1;
      await axios.post(`${AUTH_PATH}api/auth/register/`, nformData);
      router.push('/');
      toast.success(
        'Registration successful. Please proceed to login. An email has been sent to your verify your account!'
      );
    } catch (error) {
      // setDisabled(false);
      toastError(error);
    }
  };

  return (
    <userContext.Provider
      value={{
        // dtaccess,
        // hlevel,
        isAuth,
        user,
        authToken,
        mounted,
        login,
        logout,
        register,
        resetPassword,
        resetPasswordConfirm,
        setUser,
        apiClient,
        selectedCompany,
        setSelectedCompany,
        companies,
        setCompanies,
        handleCompanyChange: (value) => setSelectedCompany(value),
        fetchCompanies,
        pagination,
        setPagination,
        searchText,
        setSearchText
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export { userContext, UserProvider };
