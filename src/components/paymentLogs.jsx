/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { FilePdfOutlined } from '@ant-design/icons';
import toastError from 'utils/toastErrors';
import { userContext } from 'contexts/Auth';

const PaymentLogs = ({ setLoading }) => {
  const [paymentLogs, setPaymentLogs] = useState([]);
  const { apiClient, user, selectedCompany } = useContext(userContext);

  const getPaymentLogs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/api/auth/subscriptions/logs/?email=${user.email}&company=${selectedCompany}`
      );
      setPaymentLogs(res.data.logs);
    } catch (error) {
      toastError('Error fetching payment logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentLogs();
  }, [selectedCompany]);

  const columns = [
    { title: 'Invoice ID', dataIndex: 'invoice_id', key: 'invoice_id' },
    { title: 'Plan Name', dataIndex: 'plan_name', key: 'plan_name' },
    {
      title: 'Payment Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text) => moment(text).format('MM/DD/YYYY')
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (text) => moment(text).format('MM/DD/YYYY')
    },
    { title: 'Amount', dataIndex: 'amount_paid', key: 'amount_paid' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'view',
      dataIndex: 'invoice_url',
      key: 'invoice_url',
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          <FilePdfOutlined />
        </a>
      )
    }
  ];

  return (
    <div className="flex justify-center w-full items-center m-auto gap-20 p-5 overflow-auto">
      <div className="flex items-center justify-center w-full flex-col gap-5">
        <Table columns={columns} dataSource={paymentLogs} />
      </div>
    </div>
  );
};

export default PaymentLogs;
