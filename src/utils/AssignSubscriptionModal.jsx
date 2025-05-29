import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Select } from 'antd';
import { toast } from 'react-toastify';
import toastError from './toastErrors';
import { userContext } from 'contexts/Auth';

const AssignSubscriptionModal = ({
  visible, onCancel, onAssigned, userRecord
}) => {
  const { apiClient, selectedCompany } = useContext(userContext);
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);

  useEffect(() => {
    const fetchAvailableSubscriptions = async () => {
      try {
        const res = await apiClient.get(`/api/auth/subscriptions/available/?company=${selectedCompany}`);
        if (res.data && res.data.subscriptions) {
          setAvailableSubscriptions(res.data.subscriptions);
        }
      } catch (error) {
        toastError('Error fetching available subscriptions');
      }
    };
    if (visible) {
      fetchAvailableSubscriptions();
    }
  }, [visible, selectedCompany, apiClient]);

  const handleAssign = async () => {
    if (!selectedSubscriptionId) {
      toastError('Please select a subscription');
      return;
    }
    try {
      const payload = {
        subscription_id: selectedSubscriptionId,
        assigned_user_id: userRecord.id,
        company: selectedCompany
      };
      const res = await apiClient.post('/api/auth/subscriptions/assign/', payload);
      if (res.status === 201) {
        toast.success('Subscription assigned successfully');
        onAssigned();
      } else {
        toastError('Error assigning subscription');
      }
    } catch (error) {
      toastError('Error assigning subscription');
    }
  };

  const userSubscriptions = userRecord.assigned_subscription.map((sub) => sub.subscription_id);
  // eslint-disable-next-line max-len
  const filteredSubscriptions = availableSubscriptions.filter((sub) => !userSubscriptions.includes(sub.subscription_id));

  return (
    <Modal
      visible={visible}
      title={`Assign Subscription Seat to ${userRecord.email}`}
      onCancel={onCancel}
      onOk={handleAssign}
      okText="Assign"
    >
      <Form layout="vertical">
        <Form.Item label="Select Subscription">
          <Select
            placeholder="Select a subscription"
            value={selectedSubscriptionId}
            onChange={(value) => setSelectedSubscriptionId(value)}
          >
            {filteredSubscriptions.map((sub) => (
              <Select.Option key={sub.subscription_id} value={sub.subscription_id}>
                {sub.name}
                {' '}
                (Available Seats:
                {sub.available_seats}
                )
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignSubscriptionModal;
