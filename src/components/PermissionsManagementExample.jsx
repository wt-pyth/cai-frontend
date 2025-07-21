/**
 * Example: How to manually refresh permissions when needed
 *
 * This example shows when and how to refresh permissions manually
 */

import React from 'react';
import { Button, Space, Alert } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import useAuth from 'hooks/useAuth';

const PermissionsManagementExample = () => {
  const { permissions, loading, refreshPermissions, hasInitiallyFetched, can } = useAuth();

  const handleRefreshPermissions = async () => {
    try {
      await refreshPermissions();
      console.log('Permissions refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Permissions Management</h3>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Status Display */}
        <Alert
          message={`Permissions Status: ${hasInitiallyFetched ? 'Loaded' : 'Not Loaded'}`}
          description={`You have ${permissions.length} permissions`}
          type={hasInitiallyFetched ? 'success' : 'warning'}
          showIcon
        />

        {/* Current Permissions */}
        <div>
          <h4>Current Permissions:</h4>
          <ul>
            {permissions.map((permission) => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        </div>

        {/* Refresh Button */}
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          loading={loading}
          onClick={handleRefreshPermissions}>
          Refresh Permissions
        </Button>

        {/* Example: When to refresh permissions */}
        <div>
          <h4>When to refresh permissions:</h4>
          <ul>
            <li>After a user's role has been changed by an admin</li>
            <li>After permissions have been updated in the backend</li>
            <li>After a user joins a new company/organization</li>
            <li>When troubleshooting permission-related issues</li>
          </ul>
        </div>

        {/* Example: Admin actions that might require permission refresh */}
        {can.setUserAdmin() && (
          <div>
            <h4>Admin Actions:</h4>
            <Space>
              <Button
                onClick={() => {
                  // Simulate admin action
                  console.log('User role changed');
                  // Refresh permissions after role change
                  handleRefreshPermissions();
                }}>
                Change User Role (then refresh)
              </Button>

              <Button
                onClick={() => {
                  // Simulate company change
                  console.log('Company switched');
                  // Refresh permissions after company change
                  handleRefreshPermissions();
                }}>
                Switch Company (then refresh)
              </Button>
            </Space>
          </div>
        )}
      </Space>
    </div>
  );
};

export default PermissionsManagementExample;
