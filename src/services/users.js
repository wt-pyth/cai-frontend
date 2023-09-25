import useSWR from 'swr';
import { apiList } from 'services/api';

/* eslint-disable no-bitwise */
function stringToColour(stringInput) {
  const stringUniqueHash = [...stringInput].reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
  );
  return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
}

const useUsers = (authToken) => {
  let users = [];
  let usersMap = {};

  const usersQuery = useSWR(
    authToken ? 'users' : null,
    () => apiList('/users/', '', authToken)
  );

  if (usersQuery.data) {
    users = usersQuery.data.map((user) => ({ ...user, color: stringToColour(user.email) }));
  }

  usersMap = Object.fromEntries(users.map((user) => [user.id, user]));

  return { users, usersMap };
};

export default useUsers;
