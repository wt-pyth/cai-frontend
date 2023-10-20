import { useRouter } from 'next/router';
import { useEffect } from 'react';
import MainLayout from 'components/layouts/Layout';

const NotifRedirect = () => {
  const router = useRouter();
  const { nuuid } = router.query;

  useEffect(() => {
    window.location.replace(`https://manage.capabara.com/notifications/${nuuid}`);
  }, []);

  return (
    <MainLayout>
      <p>Loading...</p>
    </MainLayout>
  );
};

export default NotifRedirect;
