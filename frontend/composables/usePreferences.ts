import { ref } from 'vue';

export function usePreferences() {
  const baseURL = 'http://localhost:5002'; 
  const preferences = ref<Array<{preference_id: number, preference_name: string}>>([]);
  const isLoading = ref(false);
  const error = ref('');

  const fetchPreferences = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await fetch(`${baseURL}/api/preferences`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      preferences.value = data;
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch preferences';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserPreferences = async (preferenceIds: number[]) => {
    if (process.client && !localStorage.getItem('authToken')) {
      throw new Error('User not authenticated');
    }

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
        body: JSON.stringify({ preferences: preferenceIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      return await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update preferences';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    preferences,
    isLoading,
    error,
    fetchPreferences,
    updateUserPreferences,
  };
}