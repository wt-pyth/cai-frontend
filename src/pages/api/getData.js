/* eslint-disable no-console */

import axios from 'axios';

export default async function handler(req, res) {
  const endpoint = 'https://func-si-genai-mvp-sea-01.azurewebsites.net/app/get';
  const { userText } = req.query; // Get user input from query parameter
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzaXVzZXIxIiwiZXhwIjoxNjkyODc1MzYyfQ.Zj9EeDNSuU5O3kbSNlWps2wPE-btcsdcclCbEzUzBYI'; // Replace

  const url = `${endpoint}?userText=${encodeURIComponent(userText)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (!response.status === 200) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const responseData = response.data;
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
}
