/* eslint-disable react/prop-types */
import { useRouter } from 'next/router';
import qs from 'qs';
import { createContext, useContext, useState } from 'react';
import { useLocalStorage, useMountedState } from 'react-use';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import { apiGet, apiList } from 'services/api';
import useDepartments from 'services/departments';
import useForms from 'services/forms';
import useUsers from 'services/users';
import { userContext } from 'contexts/Auth';

const objectiveContext = createContext({});

const pathnameMap = {
  '/capabilities': '/capabilities',
  '/capabilities/[ouuid]': '/capabilities'
};

const regMap = {
  inherent: 'residual',
  residual: 'inherent'
};

const ObjectiveProvider = ({ children }) => {
  const { authToken, dtaccess } = useContext(userContext);
  const {
    mainDeptsTree,
    mainExpandedKeys,
    mainDeptsMap,

    assignDeptsTree,
    assignExpandedKeys,
    assignDeptsMap
  } = useDepartments(authToken, dtaccess);
  const { users, usersMap } = useUsers(authToken);

  const router = useRouter();
  const { ouuid } = router.query;

  const { actions, actObjectMap } = useForms(authToken, ouuid);

  const [currPeriod, setCurrPeriod] = useLocalStorage('currPeriod', {});
  const [capSet, setCapSet] = useState({});
  const [task, setTask] = useState({ uuid: '' });

  const lskey = pathnameMap[router.pathname] || router.pathname;
  const [search, setSearch] = useLocalStorage(`search-${lskey}`, '');
  const [debSearch] = useDebounce(search, 1000);
  const [dept, setDept] = useLocalStorage(`deptSel-${lskey}`, null);
  const [status, setStatus] = useState('active');
  const [regType, setRegType] = useState('inherent');

  const isMounted = useMountedState();

  const pformat = qs.stringify({
    level: 1,
    status
  });

  const onPeriodLoadSuccess = (data) => {
    if (currPeriod.uuid === undefined) {
      setCurrPeriod(data[0]);
    }
  };

  const periodsQuery = useSWR(
    authToken ? ['periods', status] : null,
    () => apiList('/folders/', pformat, authToken, onPeriodLoadSuccess)
  );

  let periods = [];
  if (periodsQuery.data) {
    periods = periodsQuery.data;
  }

  const riskConfQuery = useSWR(
    authToken ? 'config' : null, () => apiGet('/risk-conf/', authToken)
  );

  let riskConfArr = [];
  let riskConfMap = {};
  if (riskConfQuery.data && !riskConfQuery.data.err) {
    riskConfArr = riskConfQuery.data;
    riskConfMap = Object.fromEntries(
      riskConfArr.map((conf) => {
        const nconf = { ...conf };
        const matrixVals = [...conf.nmatrix].reverse().reduce((acc, arr) => [...acc, ...arr], []);

        nconf.matrixVals = matrixVals;
        return [conf.name, nconf];
      })
    );
  }

  const switchRegType = () => {
    setRegType((rt) => regMap[rt]);
  };

  return (
    <objectiveContext.Provider
      value={{
        mainDeptsTree,
        mainExpandedKeys,
        mainDeptsMap,
        assignDeptsTree,
        assignExpandedKeys,
        assignDeptsMap,
        dept,
        users,
        usersMap,
        actions,
        actObjectMap,
        capSet,
        currPeriod,
        periods,
        task,
        debSearch,
        search,
        riskConfMap,
        regType,
        status,
        isMounted,
        setDept,
        setTask,
        setCapSet,
        setCurrPeriod,
        setSearch,
        setStatus,
        switchRegType
      }}
    >
      {children}
    </objectiveContext.Provider>
  );
};

export { objectiveContext, ObjectiveProvider };
