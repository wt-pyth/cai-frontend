/* eslint-disable prefer-destructuring */
const deptColorsList = [
  '#36a2eb',
  '#ffce56',
  '#ff6384',
  '#4bc0c0',
  '#c8c8c8',
  '#367eeb',
  '#ffaa56',
  '#ff6363',
  '#36ebba',
  '#eb7eff'
];

const deptColorsMap = Object.fromEntries(deptColorsList.map((color, idx) => [idx, color]));

const riskClassMap = [
  {
    val: '1',
    css: 'text-success',
    label: 'Completed',
    sec_label: 'Completed',
    tagCol: 'green',
    bgColor: '#f6ffed', // 1
    color: '#389e0d', // 7
    count: '#d9f7be', // 2
    borderColor: '#b7eb8f' // 3
  },
  {
    val: 'x',
    css: 'text-inProgress',
    label: 'Partial',
    sec_label: 'partial',
    tagCol: 'gold',
    bgColor: '#fffbe6',
    color: '#d48806',
    count: '#fff1b8',
    borderColor: '#ffe58f'
  },
  {
    val: '0',
    css: 'text-delete',
    label: 'Incomplete',
    sec_label: 'Incomplete',
    tagCol: 'red',
    bgColor: '#fff1f0',
    color: '#cf1322',
    count: '#ffccc7',
    borderColor: '#ffa39e'
  },
  {
    val: 'NA',
    css: '',
    label: 'N/A',
    sec_label: 'N/A',
    tagCol: 'default',
    bgColor: '#ECECEC',
    color: '#4E4E4E',
    borderColor: '#989898'
  }
];

const statusBGMap = {
  'text-info': '!bg-infoStatus',
  'text-success': '!bg-successStatus',
  'text-warning': '!bg-warningStatus',
  'text-danger': '!bg-dangerStatus'
};

const textBGMap = {
  'text-info': '!text-infoStatusText',
  'text-success': '!text-successStatusText',
  'text-warning': '!text-warningStatusText',
  'text-danger': '!text-dangerStatusText'
};

const mapStatus = (status, field) => {
  const riskClassMatch = riskClassMap.filter((item) => item.val.toString() === status);

  let riskClass = {};
  if (riskClassMatch.length) riskClass = riskClassMatch[0];

  return riskClass[field] || '';
};

export {
  deptColorsMap, mapStatus, riskClassMap, statusBGMap, textBGMap
};
