// useCheckout.ts
import { ref } from 'vue';
import axios from 'axios';
import { useAuth } from './useAuth';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://localhost:5002';

export function useCheckout() {
  const auth = useAuth();
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const transactionResult = ref<any>(null);

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  });

  const checkoutSingleItem = async (
    watchId: number,
    quantity = 1,
    shipping_address?: string,
    payment_method?: string
  ) => {
    isLoading.value = true;
    error.value = null;
  
    try {
      const response = await api.post('/api/transactions/checkout', {
        watchId,
        quantity,
        shipping_address,
        payment_method
      });
      transactionResult.value = response.data;
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to checkout item');
    } finally {
      isLoading.value = false;
    }
  };

  const checkoutCart = async (
    shipping_address?: string,
    payment_method?: string
  ) => {
    isLoading.value = true;
    error.value = null;
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('User is not authenticated');
  
      const userId = (jwtDecode(token) as { id?: string | number })?.id;
      if (!userId) throw new Error('User ID is missing');
  
      const cartResponse = await api.get(`/api/carts/${userId}`);
      const cartId = cartResponse.data.cart_id;
      if (!cartId) throw new Error('Cart not found');
  
      const response = await api.post('/api/transactions/checkout-cart', {
        cartId,
        shipping_address,
        payment_method
      });
  
      transactionResult.value = response.data;
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to checkout cart');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUserTransactions = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get('/api/transactions');
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to fetch transactions');
    } finally {
      isLoading.value = false;
    }
  };

  const getTransactionById = async (transactionId: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/api/transactions/${transactionId}`);
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to fetch transaction details');
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

  return {
    isLoading,
    error,
    transactionResult,
    checkoutSingleItem,
    checkoutCart,
    fetchUserTransactions,
    getTransactionById
  };
}
