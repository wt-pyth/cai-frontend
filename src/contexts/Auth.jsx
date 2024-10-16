/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from 'axios';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'react-use';
import useSWR from 'swr';
import { apiGet } from 'services/api';
import { BASE_PATH, AUTH_PATH, CLIENT_ID } from 'constants/site';
import toastError from 'utils/toastErrors';
import { Secret, Token } from 'fernet';


const userContext = createContext({ user: {} });

const publicPages = [
  '/',
  '/signup',
  '/password/reset',
  '/password/confirm/[uid]/[token]',
  '/resendemail',
  '/confirm-email/[key]'
];
const adminRoutes = ['/organisation-management'];

const UserProvider = ({ children }) => {
  // User is the name of the "data" that gets stored in context
  const baseUser = { first_name: '', uprofile: { email_verified: false } };
  const [user, setUser] = useLocalStorage('caasUser', baseUser);
  const [authToken, setAuthToken] = useLocalStorage('caasToken', '');
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log(router.pathname);
    if (!authToken && router.query && !publicPages.includes(router.pathname)) {
      router.push(`/?next=${router.asPath}`);
    }
    if (adminRoutes.includes(router.pathname)) {
      if (user?.profile?.display_name !== 'Admin') {
        router.push('/');
      }
    }
  }, [authToken, router, user]);

  let hlevel = 20;
  let dtaccess = [];

  const accessQuery = useSWR(authToken ? 'access' : null, () => apiGet('/depts/load/', authToken), {
    refreshInterval: 600000
  });

  if (accessQuery.data) {
    hlevel = accessQuery.data.hlevel;
    dtaccess = accessQuery.data.dtaccess;
  }

  // Login updates the user data with a name parameter
  const login = async (values, setDisabled) => {
    setDisabled(true);

    try {
      const secretKey = process.env.NEXT_PUBLIC_API_KEY;
      const secret = new Secret(secretKey);

      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: CLIENT_ID,
        ...values
      });

      const res = await axios.post(`${AUTH_PATH}o/token/`, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { data } = res;
      const token = data.access_token;
      setAuthToken(token);

      const verifyUser = await axios.get(`${AUTH_PATH}o/introspect?token=${token}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(verifyUser.data);
      let decryptData = verifyUser.data.decode();
      console.log(decryptData);

      // const profileRes = await axios.get(`${BASE_PATH}/auth/user/`, {
      //   headers: { Authorization: `Token ${token}` }
      // });
      // const profileData = { ...profileRes.data, ...verifyUser.data };
      setUser(verifyUser);
      // toast.success(`Welcome! ${profileData.first_name}`);
      router.push('/mycapabara');
    } catch (error) {
      setDisabled(false);
      toastError(error);
    }
  };

  const resetPassword = async (formData) => {
    // setDisabled(true);
    try {
      console.log(formData);
      await axios.post(`${AUTH_PATH}api/auth/password/reset/`, formData);
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

  // Logout updates the user data to default
  const logout = async () => {
    await axios.post(`${BASE_PATH}/auth/logout/`, '', authToken);
    setUser(baseUser);
    setAuthToken('');
    router.push('/');
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

  const isAuth = authToken !== '';
  // const isVerified = user.uprofile.email_verified;

  return (
    <userContext.Provider
      value={{
        dtaccess,
        hlevel,
        isAuth,
        user,
        authToken,
        mounted,
        login,
        logout,
        register,
        resetPassword,
        resetPasswordConfirm,
        setUser
      }}>
      {children}
    </userContext.Provider>
  );
};

export { userContext, UserProvider };
