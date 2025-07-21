/* eslint-disable */
import 'rsuite/dist/rsuite.min.css';
import '../styles/globals.less';
import '../styles/antd.less';
import 'react-toastify/dist/ReactToastify.css';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { UserProvider } from 'contexts/Auth';
import { PermissionsProvider } from 'contexts/Permissions';
// import { ObjectiveProvider } from 'contexts/Objective';
import dynamic from 'next/dynamic';
import PFruitButton from 'components/PFruitButton';

const DynToaster = dynamic(() => import('react-toastify').then((mod) => mod.ToastContainer));

function CapabaraPlatformApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <PermissionsProvider>
        {/* <ObjectiveProvider> not require for now. */}
        <Component {...pageProps} />
        <PFruitButton isPage />
        <DynToaster />
        {/* </ObjectiveProvider> */}
      </PermissionsProvider>
    </UserProvider>
  );
}

export default CapabaraPlatformApp;
