import qs from 'qs';
import useSWR from 'swr';
import { apiList } from 'services/api';

const useForms = (authToken, ouuid, currAct = '', setCurrAct = null) => {
  const filters = {
    system: 'capabara'
  };

  const onSuccess = (data) => {
    if (!currAct && setCurrAct) {
      setCurrAct(data[0].uuid);
    }
  };

  let actions = [];
  let actObjectMap = {};
  const actionsQuery = useSWR(
    authToken ? ['forms', ouuid || 'main'] : null,
    () => apiList('/forms/', qs.stringify(filters, { indices: false }), authToken, onSuccess)
  );

  if (actionsQuery.data) {
    actions = actionsQuery.data;
    actObjectMap = Object.fromEntries(actions.map((act) => [act.uuid, act]));
  }

  return { actions, actObjectMap };
};

export default useForms;
