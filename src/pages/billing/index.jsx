/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Layout, Spin } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { faBuildingColumns } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MainLayout from 'components/layouts/Layout';
import Subscriptions from 'components/subscriptions';
import PaymentMethod from 'components/paymentMethod';
import PaymentLogs from 'components/paymentLogs';
import toastError from 'utils/toastErrors';
import { userContext } from 'contexts/Auth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const Billing = () => {
  const { user, apiClient, selectedCompany } = useContext(userContext);
  const [allSubscriptionDetails, setAllSubscriptionDetails] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/auth/subscriptions', {
        params: { email: user.email, company: selectedCompany }
      });
      setAllSubscriptionDetails(res.data);
    } catch (error) {
      toastError('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email && user?.token) fetchSubscriptions();
  }, [user, selectedCompany]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === '1') {
      fetchSubscriptions();
    }
  };

  const tabItems = [
    {
      key: '1',
      label: 'Subscription',
      content: (
        <Subscriptions
          subscriptionsDetails={allSubscriptionDetails}
          onPlanSelect={setSelectedPlan}
          refreshSubscriptions={fetchSubscriptions}
          loading={loading}
          setLoading={setLoading}
          setActiveTab={setActiveTab}
        />
      )
    },
    {
      key: '2',
      label: 'Payment Methods',
      content: (
        <Elements stripe={stripePromise}>
          <PaymentMethod
            selectedPlan={selectedPlan}
            refreshSubscriptions={fetchSubscriptions}
            setActiveTab={setActiveTab}
          />
        </Elements>
      )
    },
    {
      key: '3',
      label: 'Payment Logs',
      content: <PaymentLogs setLoading={setLoading} />
    }
  ];

  return (
    <MainLayout>
      <Layout>
        <CustomTabHeader items={tabItems} activeKey={activeTab} onTabChange={handleTabChange} />
        <Spin
          spinning={loading}
          size="large"
          className="flex justify-center items-center w-full h-full"
        >
          <div className="p-5">{tabItems.find((item) => item.key === activeTab)?.content}</div>
        </Spin>
      </Layout>
    </MainLayout>
  );
};

const CustomTabHeader = ({ items, activeKey, onTabChange }) => (
  <div className="h-[48px] bg-darkBlueText text-white p-4 flex justify-start items-center">
    <FontAwesomeIcon icon={faBuildingColumns} style={{ fontSize: '20px', color: '#fff' }} />
    {items.map((item) => {
      const isActive = item.key === activeKey;
      return (
        <div
          key={item.key}
          className="px-4 py-2 mx-2 cursor-pointer"
          role="button"
          tabIndex="0"
          style={{
            borderBottom: isActive ? '2px solid #F07C28' : 'none',
            fontWeight: isActive ? 'bold' : 'normal'
          }}
          onClick={() => onTabChange(item.key)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onTabChange(item.key);
            }
          }}
        >
          {item.label}
        </div>
      );
    })}
  </div>
);

export default Billing;
