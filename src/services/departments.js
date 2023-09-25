import useSWR from 'swr';
import { apiList } from 'services/api';

const loadTree = (dtQuery) => {
  const deptsTree = [];
  const expandedKeys = [];
  let deptsMap = {};

  const hashTable = Object.fromEntries(
    dtQuery.map((dt) => [dt.id, {
      ...dt,
      title: dt.dept.name,
      text: dt.dept.name,
      value: dt.id,
      children: [],
      childrenList: [],
      key: dt.id
    }])
  );

  dtQuery.forEach((dt) => {
    try {
      hashTable[dt.parent].children.push(hashTable[dt.id]);
    } catch {
      deptsTree.push(hashTable[dt.id]);
    }

    expandedKeys.push(dt.id);
  });

  deptsMap = Object.fromEntries(
    dtQuery.map((dt) => [dt.id, { uuid: dt.uuid, dept: dt.dept.name }])
  );

  return [deptsTree, expandedKeys, deptsMap];
};

const useDepartments = (authToken, dtaccess) => {
  let mainDeptsTree = [];
  let mainExpandedKeys = [];
  let mainDeptsMap = {};
  let assignDeptsTree = [];
  let assignExpandedKeys = [];
  let assignDeptsMap = {};

  const deptsQuery = useSWR(
    authToken ? 'depts' : null,
    () => apiList('/depts/', '', authToken)
  );

  if (deptsQuery.data) {
    const baseQuery = deptsQuery.data.filter((dt) => !dt.deleted);
    [mainDeptsTree, mainExpandedKeys, mainDeptsMap] = loadTree(baseQuery);

    const assignQuery = [...baseQuery].filter((dt) => dtaccess && dtaccess.includes(dt.id));
    [assignDeptsTree, assignExpandedKeys, assignDeptsMap] = loadTree(assignQuery);
  }

  return {
    mainDeptsTree,
    mainExpandedKeys,
    mainDeptsMap,
    assignDeptsTree,
    assignExpandedKeys,
    assignDeptsMap
  };
};

export default useDepartments;
