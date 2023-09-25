/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/* eslint-disable no-console */

import React, { useState } from 'react';
import { Menu } from 'antd';
import styles from './SecNavbar.module.css';

const items = [

  {
    label: 'Prompt Helper',
    key: 'promptHelper',
    children: [
      {
        type: 'group',
        label: 'SOP',
        children: [
          {
            label: 'Write an SOP for <insert detail here>',
            key: 'setting:1'
          },
          {
            label: 'Write an SOP for <insert details here> to be used by < insert department name> in <insert country>',
            key: 'setting:2'
          }
        ]
      },
      {
        type: 'group',
        label: 'Training',
        children: [
          {
            label: 'Write a data breach scenario to be used in a table top exercise for a <insert company type>',
            key: 'setting:3'
          },
          {
            label: 'Provide 5 questions and answers relating to the PDPA use of <insert item here>',
            key: 'setting:4'
          }
        ]
      }
    ]
  },

  {
    label: 'History',
    key: 'history',
    children: []
  }

];

const SecNavbar = ({ setUserText }) => {
  const [current, setCurrent] = useState('');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);

    // Find the clicked label in the 'items' array children required
    const clickedLabel = items
      .flatMap((item) => item.children)
      .flatMap((group) => group.children)
      .find((child) => child.key === e.key)?.label || '';

    // Set the user text to the clicked label
    setUserText(clickedLabel);
  };

  return (
    <>
      <Menu className={styles.secnav} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </>
  );
};

export default SecNavbar;
