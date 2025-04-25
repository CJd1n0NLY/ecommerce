import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuth } from './useAuth';

interface CartItem {
  cart_item_id: number;
  cart_id: number;
  watch_id: number;
  quantity: number;
  watch: {
    watch_id: number;
    watch_name: string;
    watch_image: string;
    watch_price: string;
  };
}

const BASE_URL = 'http://localhost:5002';

export function useCart() {
  const auth = useAuth();
  const cart = ref<CartItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentCartId = ref<number | null>(null);

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const getCartId = async (userId: number): Promise<number> => {
    try {
      const response = await api.get(`/api/carts/${userId}`);
      currentCartId.value = response.data.cart_id;
      return response.data.cart_id;
    } catch (error) {
      console.error('Failed to get cart ID:', error);
      throw error;
    }
  };

  const fetchCart = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!auth.isAuthenticated()) return;
      
      await auth.ensureUserData();
      const userId = auth.user.value?.id;
      if (!userId) throw new Error('User authentication failed');

      // First get the cart ID
      const cartId = await getCartId(userId);
      
      // Then get cart items
      const response = await api.get(`/api/carts/${cartId}/items`);
      const rawItems: any[] = response.data;

      cart.value = rawItems.map(item => ({
      cart_item_id: item.cart_item_id,
      cart_id:       item.cart_id,
      watch_id:      item.watch_id,
      quantity:      item.quantity,
      watch: {
          watch_id:    item.watch_id,
          watch_name:  item.watch.watch_name,
          watch_image: item.watch.watch_image,
          watch_price: item.watch.watch_price,
      }
      }));
      console.log('🛒 raw cart items:', cart.value);
    } catch (err: unknown) {
      handleError(err, 'Failed to fetch cart');
    } finally {
      isLoading.value = false;
    }
  };

  const addToCart = async (watchId: number, quantity = 1) => {
    isLoading.value = true;
    try {
      if (!auth.isAuthenticated()) throw new Error('Not authenticated');
      
      const userId = auth.user.value?.id;
      if (!userId) throw new Error('User ID not available');

      const response = await api.post(`/api/carts/${userId}`, {
        watchId,
        quantity
      });

      await fetchCart();
      return response.data;
    } catch (err: unknown) {
      handleError(err, 'Failed to add to cart');
    } finally {
      isLoading.value = false;
    }
  };

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    isLoading.value = true;
    try {
      await api.put(`/api/carts/${cartItemId}`, { quantity });
      
      const itemIndex = cart.value.findIndex(item => item.cart_item_id === cartItemId);
      if (itemIndex >= 0) {
        cart.value[itemIndex].quantity = quantity;
      }
    } catch (err: unknown) {
      handleError(err, 'Failed to update cart');
    } finally {
      isLoading.value = false;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    isLoading.value = true;
    try {
      await api.delete(`/api/carts/items/${cartItemId}`);
      cart.value = cart.value.filter(item => item.cart_item_id !== cartItemId);
    } catch (err: unknown) {
      handleError(err, 'Failed to remove item');
    } finally {
      isLoading.value = false;
    }
  };

  const clearCart = async () => {
    isLoading.value = true;
    try {
      if (!auth.isAuthenticated()) return;
      
      const userId = auth.user.value?.id;
      if (!userId) throw new Error('User ID not available');

      const cartId = await getCartId(userId);
      await api.delete(`/api/carts/${cartId}`);
      cart.value = [];
    } catch (err: unknown) {
      handleError(err, 'Failed to clear cart');
    } finally {
      isLoading.value = false;
    }
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || defaultMessage;
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = defaultMessage;
    }
    console.error(`${defaultMessage}:`, err);
    throw err;
  };

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + (parseFloat(item.watch.watch_price) * item.quantity);
    }, 0);
  });

  const totalItems = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  return {
    cart,
    isLoading,
    error,
    cartTotal,
    totalItems,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
}