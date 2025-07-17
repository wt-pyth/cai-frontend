# Permissions System Documentation

This documentation explains how to use the permissions system in the Capabara Platform application.

## Overview

The permissions system allows you to control access to different parts of your application based on user permissions. It consists of:

1. **Permissions Context** (`src/contexts/Permissions.jsx`) - Manages permission state and API calls
2. **AuthorizedUsage Component** (`src/components/AuthorizedUsage.jsx`) - Conditionally renders components based on permissions
3. **useAuth Hook** (`src/hooks/useAuth.js`) - Provides convenient methods for permission checking

## Setup

The permissions system is already integrated into your app. The `PermissionsProvider` wraps your entire application in `_app.jsx`.

## API Integration

The system automatically fetches user permissions from the `/api/auth/me/` endpoint **only once** when a user logs in successfully. This prevents unnecessary API calls on every page navigation or component mount.

### Performance Optimization
- ✅ **Fetches permissions only once** after successful login
- ✅ **Caches permissions** in memory for the entire session
- ✅ **Manual refresh option** available when needed
- ✅ **Automatic cleanup** on logout

The expected response format is:

```json
{
  "permissions": [
    "users.view",
    "users.set_admin",
    "company.view",
    "company.update",
    "company.delete"
  ]
}
```

### Manual Refresh
You can manually refresh permissions when needed:

```javascript
import useAuth from 'hooks/useAuth';

const { refreshPermissions, loading } = useAuth();

// Refresh permissions (e.g., after role change)
const handleRoleChange = async () => {
  await updateUserRole(); // Your API call
  await refreshPermissions(); // Refresh permissions
};
```

## Available Permissions

The following permissions are defined in `PERMISSIONS` constant:

```javascript
export const PERMISSIONS = {
  // Users permissions
  USERS_VIEW: 'users.view',
  USERS_SET_ADMIN: 'users.set_admin',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  
  // Company permissions
  COMPANY_VIEW: 'company.view',
  COMPANY_UPDATE: 'company.update',
  COMPANY_DELETE: 'company.delete',
  COMPANY_CREATE: 'company.create',
  
  // Custom permissions
  RESTRICT_CREATE_CAPABILITY_TOOL_LIBRARY: 'capability_tool_library.create',
};
```

## Usage Examples

### 1. Basic AuthorizedUsage Component

Wrap any component to show/hide based on permissions:

```jsx
import AuthorizedUsage from 'components/AuthorizedUsage';
import { PERMISSIONS } from 'contexts/Permissions';

<AuthorizedUsage permission={PERMISSIONS.USERS_CREATE}>
  <Button onClick={() => createUser()}>
    Add User
  </Button>
</AuthorizedUsage>
```

### 2. Multiple Permissions (Any)

Show component if user has ANY of the specified permissions:

```jsx
<AuthorizedUsage 
  permission={[PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_SET_ADMIN]}
  permissionType="any"
>
  <Button>User Management</Button>
</AuthorizedUsage>
```

### 3. Multiple Permissions (All)

Show component only if user has ALL specified permissions:

```jsx
<AuthorizedUsage 
  permission={[PERMISSIONS.COMPANY_VIEW, PERMISSIONS.COMPANY_UPDATE]}
  permissionType="all"
>
  <Button>Full Company Access</Button>
</AuthorizedUsage>
```

### 4. With Fallback Component

Show alternative content when user doesn't have permission:

```jsx
<AuthorizedUsage 
  permission={PERMISSIONS.USERS_CREATE}
  fallback={<Button disabled>No Permission</Button>}
>
  <Button>Add User</Button>
</AuthorizedUsage>
```

### 5. Using the useAuth Hook

For more complex conditional logic:

```jsx
import useAuth from 'hooks/useAuth';

const MyComponent = () => {
  const { can, hasPermission } = useAuth();

  return (
    <div>
      {can.createUsers() && (
        <Button>Create User</Button>
      )}
      
      {hasPermission(PERMISSIONS.USERS_DELETE) && (
        <Button danger>Delete User</Button>
      )}
      
      {can.doAny([PERMISSIONS.USERS_UPDATE, PERMISSIONS.USERS_CREATE]) && (
        <div>User management options</div>
      )}
    </div>
  );
};
```

### 6. Permission-Aware Components

Update existing components to support permissions:

```jsx
import SecondaryHeader from 'components/secondaryNav';
import { PERMISSIONS } from 'contexts/Permissions';

<SecondaryHeader
  title="Users"
  icon={faUserGear}
  searchValue={searchValue}
  setSearchValue={setSearchValue}
  onAdd={() => setIsUserModalOpen(true)}
  addButtonText="Add User"
  addButtonPermission={PERMISSIONS.USERS_CREATE} // Add this prop
/>
```

## AuthorizedUsage Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `permission` | `string \| string[]` | Required | Single permission or array of permissions |
| `permissionType` | `'single' \| 'any' \| 'all'` | `'single'` | Type of permission check |
| `children` | `ReactNode` | Required | Component(s) to render if permission check passes |
| `fallback` | `ReactNode` | `null` | Component to render if permission check fails |
| `hideOnNoPermission` | `boolean` | `true` | Whether to hide component when no permission |

## useAuth Hook Methods

The `useAuth` hook provides these convenience methods:

```javascript
const {
  permissions,        // Array of user permissions
  hasPermission,      // Check single permission
  hasAnyPermission,   // Check if user has any of the permissions
  hasAllPermissions,  // Check if user has all permissions
  loading,           // Boolean indicating if permissions are loading
  refreshPermissions, // Function to manually refresh permissions
  hasInitiallyFetched, // Boolean indicating if permissions have been fetched
  can                // Object with convenience methods
} = useAuth();

// Convenience methods in 'can' object:
can.viewUsers()       // Check users.view permission
can.createUsers()     // Check users.create permission
can.updateUsers()     // Check users.update permission
can.deleteUsers()     // Check users.delete permission
can.setUserAdmin()    // Check users.set_admin permission
can.viewCompany()     // Check company.view permission
can.createCompany()   // Check company.create permission
can.updateCompany()   // Check company.update permission
can.deleteCompany()   // Check company.delete permission
can.do(permission)    // Generic permission check
can.doAny([perms])    // Check any of multiple permissions
can.doAll([perms])    // Check all of multiple permissions
```

### When to Refresh Permissions

Call `refreshPermissions()` in these scenarios:
- After a user's role has been changed
- After switching companies/organizations
- After permissions are updated in the backend
- When troubleshooting permission issues

```javascript
// Example: After admin changes user role
const handleRoleChange = async (userId, newRole) => {
  await updateUserRole(userId, newRole);
  await refreshPermissions(); // Refresh to get updated permissions
};
```

## Best Practices

1. **Always use AuthorizedUsage for UI elements** that should be hidden based on permissions
2. **Use the useAuth hook for complex conditional logic**
3. **Define permission constants** in the PERMISSIONS object for reusability
4. **Provide fallback components** for better UX when permissions are missing
5. **Test your permission logic** with different user roles
6. **Use descriptive permission names** that clearly indicate what they control

## Adding New Permissions

1. Add the permission to the `PERMISSIONS` object in `src/contexts/Permissions.jsx`
2. Add corresponding convenience method to the `can` object in `src/hooks/useAuth.js`
3. Use the new permission in your components

```javascript
// In Permissions.jsx
export const PERMISSIONS = {
  // ...existing permissions
  NEW_FEATURE_ACCESS: 'new_feature.access',
};

// In useAuth.js
const can = {
  // ...existing methods
  accessNewFeature: () => hasPermission(PERMISSIONS.NEW_FEATURE_ACCESS),
};
```

## Troubleshooting

1. **Permissions not loading**: Check if the API endpoint `/api/auth/me/` is accessible and returns the expected format
2. **Components not hiding**: Ensure you're using the correct permission string and that it matches what the API returns
3. **Loading state issues**: The `loading` state from useAuth can help manage UI during permission fetching

## Error Handling

The permissions system handles these scenarios:
- Network errors when fetching permissions
- 401 unauthorized responses (triggers logout)
- Missing or invalid permission data
- Loading states during permission fetching

The system will gracefully fallback to hiding protected components when permissions cannot be determined.
