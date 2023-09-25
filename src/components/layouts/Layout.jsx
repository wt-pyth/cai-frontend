import { Layout } from 'antd';
import Head from 'next/head';
import PropTypes from 'prop-types';
import MainFooter from 'components/layouts/MainFooter';
import NavBar from 'components/layouts/Navbar';
import ProductFruit from 'components/ProductFruit';

const MainLayout = (props) => {
  const { children } = props;
  return (
    <Layout>
      <Head>
        <title>Capabara</title>
      </Head>
      <NavBar />
      <div
        className="bg-containerColor flex flex-col"
        style={{ minHeight: 'calc( 100vh - 114px)' }}
      >
        {children}
      </div>
      <MainFooter />
      <ProductFruit />
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node // or PropTypes.node.isRequired to make it required
};

MainLayout.defaultProps = {
  children: null
};

export default MainLayout;
