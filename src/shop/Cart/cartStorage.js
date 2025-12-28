const STORAGE_KEY = 'cart';

export const saveCart = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const loadCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const clearCart = () => {
  localStorage.removeItem(STORAGE_KEY);
};
