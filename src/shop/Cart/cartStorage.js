const STORAGE_KEY = 'cart';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const saveCart = (items = []) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage', error);
  }
};

export const loadCart = () => {
  try {
    const data = safeParse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage', error);
    return [];
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart in localStorage', error);
  }
};
