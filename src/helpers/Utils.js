export const setDataInLS = (key, value) => {
  localStorage.setItem(key, value);
};

export const getDataFromLS = (key) => {
  const data = localStorage.getItem(key);
  if (data !== null) return JSON.parse(data);
  return undefined;
};

export const removeDataFromLS = (key) => {
  localStorage.removeItem(key);
}