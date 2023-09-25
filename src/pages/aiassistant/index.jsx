/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
import { Layout } from 'antd';
import React, { useState } from 'react';
import Navbar from 'components/layouts/Navbar';
import GetAnswer from 'components/aiassistant/GetAnswer';
import SecNavbar from 'components/layouts/SecNavbar';

const { Content } = Layout;

function Home() {
  const [userText, setUserText] = useState('');

  return (
    <Layout className="layout min-h-screen">
      <Content>
        <Navbar />
        <SecNavbar setUserText={setUserText} userText={userText} />
        <GetAnswer setUserText={setUserText} userText={userText} />
      </Content>
    </Layout>
  );
}

export default Home;
