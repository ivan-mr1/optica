import ItemsController from './controllers/ItemsController';
import { STORAGE_KEYS } from './storage/storageKeys';

export const cart = new ItemsController({
  storageKey: STORAGE_KEYS.CART,
  counterSelector: '.cart__count',
});

export const favorite = new ItemsController({
  storageKey: STORAGE_KEYS.FAVORITE,
  counterSelector: '.favorite__count',
});
