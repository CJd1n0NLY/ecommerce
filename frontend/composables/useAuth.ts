import { ref, reactive, onMounted } from 'vue';
import { useRuntimeConfig } from '#imports';

export function useAuth() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  interface User {
    id: number;
    user_email: string;
    user_name: string;
  }

  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref('');

  const getUserId = (): number => {
    if (!user.value) {
      throw new Error('User not authenticated');
    }
    return user.value.id;
  };

  const isAuthenticated = () => {
    if (process.client) { 
      return !!localStorage.getItem('authToken');
    }
    return false;
  };

  const fetchUserProfile = async (): Promise<User> => {
    if (!isAuthenticated()) throw new Error('Not authenticated');
    
    isLoading.value = true;
    error.value = '';
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
  
      const response = await fetch(`${baseURL}/api/users/profile`, {
        method: 'GET',
        headers: { 'x-auth-token': token },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const userData = await response.json();
      console.log('Received user data:', userData); 

      user.value = userData;
      return userData; 
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch profile';
      throw err; 
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await fetch(`${baseURL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (process.client) {
        localStorage.setItem('authToken', data.token);
      }
      user.value = data.user;

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: { email: string; password: string; user_name: string; preferences: number[] }) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await fetch(`${baseURL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePreferences = async (preferences: number[]) => {
    if (!isAuthenticated()) return null;

    isLoading.value = true;
    error.value = '';

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${baseURL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update preferences');
      }

      // Refresh user data
      await fetchUserProfile();

      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update preferences';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      user.value = null;
      
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      isLoading.value = false;
    }
  };

  const ensureUserData = async (): Promise<void> => {
    if (!user.value && isAuthenticated()) {
      await fetchUserProfile();
    }
  };

  const init = async () => {
    try {
      if (isAuthenticated()) {
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
      user.value = null;
      throw error;
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserProfile,
    updatePreferences,
    ensureUserData,
    init
  };
}
