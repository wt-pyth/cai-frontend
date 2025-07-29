import React, { useContext, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Empty, Typography } from 'antd';
import { toast } from 'react-toastify';
import AuthorizedUsage from './AuthorizedUsage';
import toastError from 'utils/toastErrors';
import { userContext } from 'contexts/Auth';
import { PERMISSIONS } from 'contexts/Permissions';

const PaymentMethod = ({ selectedPlan, refreshSubscriptions, setActiveTab }) => {
  const { user, apiClient, selectedCompany } = useContext(userContext);

  const stripe = useStripe();
  const elements = useElements();
  const [iserror, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (!selectedPlan) {
      setError('No plan selected');
      toastError('No plan selected');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { email: user.email }
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[error]', error);
      setError(error.message);
    } else {
      try {
        const response = await apiClient.post('/api/auth/subscriptions/payment/', {
          paymentMethodId: paymentMethod.id,
          email: user.email,
          plan: {
            id: selectedPlan.id,
            amount: selectedPlan.amount,
            app: selectedPlan.app,
            min_quantity: selectedPlan.min_quantity
          },
          quantity: selectedPlan.quantity,
          currency: selectedPlan.currency,
          company: selectedCompany
        });

        if (response.data) {
          toast.success('Payment successful');
          refreshSubscriptions();
          setActiveTab('1');
          setError(null);
        } else {
          toastError('Payment failed', response.data.message);
        }
      } catch (serverError) {
        toastError('[serverError]', serverError);
      }
    }
  };

  return (
    <AuthorizedUsage
      permission={PERMISSIONS.BILLING_CHANGE_PAYMENT_METHOD}
      fallback={
        <div className="h-[80vh] flex flex-col items-center justify-center">
          <Empty
            description={
              <Typography.Text>
                You do not have permission to view this section. Please contact your administrator.
              </Typography.Text>
            }></Empty>
        </div>
      }>
      <div className="flex flex-col items-center w-full gap-10 p-5 overflow-auto">
        {iserror && <div className="text-red-500 mb-4">{iserror}</div>}
        <form onSubmit={handleSubmit} className="space-y-6 w-[600px]">
          <div className="p-4 border border-gray-300 rounded-md shadow-sm">
            <CardElement className="p-2" />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!stripe || !selectedPlan}
            className="w-full py-2">
            Pay for {selectedPlan?.product || 'Plan'}
          </Button>
        </form>
      </div>
    </AuthorizedUsage>
  );
};

export default PaymentMethod;
