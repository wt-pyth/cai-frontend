/* eslint-disable no-new */
const isValidUrl = (url) => {
  try {
    new URL(url);
  } catch (e) {
    // console.error(e);
    return false;
  }
  return true;
};

export default isValidUrl;
