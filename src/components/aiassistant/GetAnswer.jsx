/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */

import React, { useContext, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Avatar } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './GetAnswer.module.css';
import { userContext } from 'contexts/Auth';

function GetAnswer({ setUserText, userText }) {
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(userContext);

  const setChatData = (data) => {
    const tempData = data.map((temp, i) => ({
      ...temp,
      id: i
    }));
    setChatLog(tempData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Store user input in the chat log
    const updatedChatLog = [...chatLog, { type: 'user', text: userText }];

    try {
      const response = await fetch(`/api/getData?userText=${encodeURIComponent(userText)}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const responseData = await response.json();

      // Store bot response in the chat log
      const updatedChatLogWithResponse = [...updatedChatLog, { type: 'bot', text: responseData }];
      setChatData(updatedChatLogWithResponse);
    } catch (error) {
      console.error('Error:', error);

      // Store error message in the chat log
      const updatedChatLogWithError = [...updatedChatLog, { type: 'bot', text: 'An error occurred.' }];
      setChatData(updatedChatLogWithError);
    }

    setLoading(false);
    setUserText('');
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUserText('');
  };

  console.log('chatLog', chatLog);
  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <button type="button" onClick={handleClear} className={styles.deleteBtn}>
            <DeleteOutlined style={{ fontSize: '26px', color: '#F07C28' }} />
          </button>
          <input
            type="text"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Enter question"
            className={styles.inputBox}
          />
          <button type="submit" className={styles.submitButton}>
            <img src="/plane.svg" alt="Submit" />
          </button>
        </form>
      </div>

      {loading && (
        <p><i>Loading response, please wait a moment...</i></p>
      )}

      <div className={styles.responseContainer}>
        {chatLog.slice().reverse().map((entry) => (
          <div key={entry.id.toString()}>
            {entry.type === 'user' ? (
              <div className={`${styles.message} ${styles.queryContainer}`}>
                <div className={styles.icon}>
                  <Avatar size={37}>{user.two_letters}</Avatar>
                </div>
                <div className={styles.messageText}>
                  {entry.text}
                </div>
              </div>
            ) : (
              <div className={styles.message}>
                <div className={styles.icon}>
                  <img src="/TM_Capabara Logo-210622-Logo Icon.png" alt="" />
                </div>
                <div className={styles.messageText}>
                  {ReactHtmlParser(
                    entry.text.replace(/\n\n/g, '<br><br>')
                      .replace('References', '<b>References</b>')
                      .replace(/\n \n/g, '<br><br>')
                      .replace('\n1:', '<br>1:')
                      .replace('\n2:', '<br>2:')
                      .replace('\n3:', '<br>3:')
                      .replace('\n4:', '<br>4:')
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetAnswer;
