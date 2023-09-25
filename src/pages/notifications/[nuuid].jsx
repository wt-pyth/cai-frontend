import { useRouter } from 'next/router';
import qs from 'qs';
import { useContext } from 'react';
import useSWR from 'swr';
import { apiGet } from 'services/api';
import { userContext } from 'contexts/Auth';
import MainLayout from 'components/layouts/Layout';

const NotifRedirect = () => {
  const router = useRouter();
  const { nuuid } = router.query;
  const { authToken } = useContext(userContext);

  const onSuccess = (notif) => {
    let url = '';
    if (notif.url === 'all-capabilities') {
      url = `/capabilities?${qs.stringify(notif.url_kwargs)}`;
    } else {
      const { obj, get } = notif.url_kwargs;
      url = `/capabilities/${obj}?${qs.stringify(get)}`;
    }

    router.push(url);
  };

  useSWR(
    router.isReady ? ['notif', nuuid] : null,
    () => apiGet(`/notifications/${nuuid}/`, authToken, onSuccess)
  );

  return (
    <MainLayout>
      <p>Loading...</p>
    </MainLayout>
  );
};

export default NotifRedirect;
