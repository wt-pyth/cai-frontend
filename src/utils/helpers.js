export const randomInRange = (
  min,
  max,
  decimals = 0
) => +(Math.random() * (max - min) + min).toFixed(decimals);

export const generateStringArray = (length, title) => [...Array(length).keys()].map((_, index) => `${title} ${index + 1}`);

export const capitalize = (str) => str[0].toUpperCase() + str.substring(1);
