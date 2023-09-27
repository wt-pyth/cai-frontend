/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
import { Layout } from 'antd';
import MainFooter from 'components/layouts/MainFooter';
import Navbar from 'components/layouts/Navbar';

const { Content } = Layout;

export default function MyCapabara() {
  return (
    <Layout className="layout h-screen">
      <Navbar />
      <Content>
        My Capabara Page
      </Content>
      <MainFooter />
    </Layout>
  );
}
