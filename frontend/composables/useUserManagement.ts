import { ref } from 'vue';
import axios from 'axios';

interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  preferences: number[];
}

interface UpdateUserData {
  user_name?: string;
  user_email?: string;
  preferences?: number[];
}

export function useUserManagement() {
  const BASE_URL = 'http://localhost:5002';
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${BASE_URL}/api/users/allUsersByAdmin`);
      users.value = response.data;
      return users.value;
    } catch (err) {
      console.error('Error fetching users:', err);
      error.value = 'Failed to fetch users';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = async (userId: string, userData: UpdateUserData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.put(`${BASE_URL}/api/users/${userId}`, userData);
      
      // Update the user in the local array
      const index = users.value.findIndex(u => u.user_id.toString() === userId);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userData };
      }
      
      return response.data;
    } catch (err) {
      console.error('Error updating user:', err);
      error.value = 'Failed to update user';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    updateUser
  };
}