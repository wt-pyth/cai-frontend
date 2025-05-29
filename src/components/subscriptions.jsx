import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, InputNumber, Modal } from 'antd';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import moment from 'moment';
import { toast } from 'react-toastify';
import { userContext } from 'contexts/Auth';

const Subscriptions = ({
  subscriptionsDetails,
  onPlanSelect,
  refreshSubscriptions,
  setActiveTab // Replace handleTabChange with setActiveTab
}) => {
  const {
    authToken, user, apiClient, selectedCompany
  } = useContext(userContext);
  const [quantities, setQuantities] = useState({});
  const [cancelMessage, setCancelMessage] = useState('');
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelPlan, setCancelPlan] = useState(null);
  const [cancelQuantity, setCancelQuantity] = useState(1);

  useEffect(() => {
    if (subscriptionsDetails && subscriptionsDetails.plans) {
      const initialQuantities = subscriptionsDetails.plans.reduce((acc, plan) => {
        const initialQuantity = plan.subscribed && plan.subscription_quantity
          ? plan.subscription_quantity
          : plan.min_quantity || 1;
        acc[plan.id] = initialQuantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [subscriptionsDetails]);

  const handleIncrease = (planId) => {
    setQuantities((prev) => ({ ...prev, [planId]: prev[planId] + 1 }));
  };

  const handleDecrease = (planId) => {
    const plan = subscriptionsDetails.plans.find((p) => p.id === planId);
    const minQuantity = plan ? plan.min_quantity || 1 : 1;
    setQuantities((prev) => ({ ...prev, [planId]: Math.max(minQuantity, prev[planId] - 1) }));
  };

  const calculateTotalCost = (planAmount, quantity) => planAmount * quantity;

  const openCancelModal = (plan) => {
    setCancelPlan(plan);
    setCancelQuantity(plan.subscription_quantity || 1);
    setCancelModalVisible(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelPlan) return;
    const maxQuantity = cancelPlan.subscription_quantity || 1;
    if (cancelQuantity <= 0 || cancelQuantity > maxQuantity) {
      toast.error('Invalid cancellation quantity.');
      return;
    }
    try {
      const response = await apiClient.post(
        '/api/auth/subscriptions/cancel/',
        {
          email: user.email,
          subscription_id: cancelPlan.subscription_id,
          cancel_quantity: cancelQuantity,
          company: selectedCompany
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      if (response.status === 200) {
        setCancelMessage('Subscription cancelled successfully!');
        refreshSubscriptions?.();
      } else {
        setCancelMessage(`Error: ${response.data?.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      toast.error('Error cancelling subscription:', error);
      setCancelMessage(`An unexpected error occurred: ${error.message}`);
    }
    setCancelModalVisible(false);
    setCancelPlan(null);
  };

  if (!subscriptionsDetails) {
    return <div>Loading...</div>;
  }

  const subscribedApps = new Set(
    subscriptionsDetails.plans
      .filter((plan) => plan.subscribed && plan.subscription_status === 'active')
      .map((plan) => plan.app)
  );

  return (
    <div className="flex flex-col items-center w-full gap-10 p-5 overflow-auto">
      <h2 className="text-4xl font-medium">Subscription Plans</h2>
      {cancelMessage && <p>{cancelMessage}</p>}
      <div className="grid grid-cols-4 gap-8 items-center justify-center">
        {subscriptionsDetails.plans.map((plan) => {
          const isDisabled = subscribedApps.has(plan.app) && !plan.subscribed;
          return (
            <div
              key={plan.id}
              className="bg-white shadow-lg rounded-tr-2xl rounded-bl-2xl flex flex-col items-center justify-between p-6 w-80 h-auto transition-transform transform hover:scale-105"
            >
              <div className="flex flex-col items-center justify-start gap-4">
                <span className="text-xl font-semibold text-center text-gray-800">
                  {plan.product}
                </span>
                <span className="text-3xl font-bold text-[#F07C28]">
                  $
                  {calculateTotalCost(plan.amount, quantities[plan.id])}
                  {' '}
                  {plan.currency.toUpperCase()}
                </span>
                <span className="text-sm capitalize text-gray-600">
                  Billed
                  {' '}
                  {plan.interval}
                  ly
                </span>
                <span className="text-xs text-gray-500">
                  Min Quantity:
                  {' '}
                  <strong>{plan.min_quantity}</strong>
                </span>
                <span className="text-xs text-gray-500">
                  App:
                  {' '}
                  <strong>{plan.app}</strong>
                </span>
                {plan.subscribed && plan.subscription_quantity && (
                  <span className="text-xs text-gray-500">
                    Subscribed Quantity:
                    {' '}
                    <strong>{plan.subscription_quantity}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 justify-center mt-4">
                <Button
                  onClick={() => handleDecrease(plan.id)}
                  disabled={isDisabled}
                  className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                  <FontAwesomeIcon icon={faAngleDown} />
                </Button>
                <input
                  className="w-[60px] text-center border border-gray-300 rounded-md"
                  value={quantities[plan.id]}
                  readOnly
                />
                <Button
                  onClick={() => handleIncrease(plan.id)}
                  disabled={isDisabled}
                  className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full"
                >
                  <FontAwesomeIcon icon={faAngleUp} />
                </Button>
              </div>
              {plan.subscribed && plan.subscription_status === 'active' ? (
                <div className="flex flex-col items-center gap-4 mt-4">
                  <span className="text-xs text-gray-500">
                    Expires on:
                    {' '}
                    <strong>{moment(plan.subscription_end_date).format('MM/DD/YYYY')}</strong>
                  </span>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="primary"
                      className="w-full"
                      onClick={() => {
                        setActiveTab('2'); // Directly set the tab to '2'
                        onPlanSelect({ ...plan, quantity: quantities[plan.id] });
                      }}
                    >
                      Increase Subscription
                    </Button>
                    <Button
                      type="danger"
                      className="w-full"
                      size="small"
                      onClick={() => openCancelModal(plan)}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  className="w-full mt-4"
                  onClick={() => {
                    setActiveTab('2'); // Directly set the tab to '2'
                    onPlanSelect({ ...plan, quantity: quantities[plan.id] });
                  }}
                  disabled={isDisabled}
                >
                  {isDisabled ? 'Already Subscribed' : 'Select Plan'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        title="Cancel Subscription"
        visible={cancelModalVisible}
        onOk={handleCancelConfirm}
        onCancel={() => setCancelModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        {cancelPlan && (
          <>
            <p>
              Enter the quantity to cancel (max:
              {' '}
              {cancelPlan.subscription_quantity || 1}
              ):
            </p>
            <InputNumber
              min={1}
              max={cancelPlan.subscription_quantity || 1}
              value={cancelQuantity}
              onChange={(value) => setCancelQuantity(value)}
              style={{ width: '100%' }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default Subscriptions;
